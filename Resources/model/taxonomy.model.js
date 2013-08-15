var IMAGECACHE = 'ImageCache';
var PACKAGEURL = 'http://offene-naturfuehrer.de/w/index.php?title=Special:TemplateParameterExport&action=submit&do=export&template=MobileKey';
var CACHEDEBUG = false;
var Taxonom = function() {
	this.dblink = Ti.Database.install('/depot/dichotoms.sql', 'dichotoms_v2');
	this.package_id = null;
	this.tree_id = null;
	this.tree_metadata = null;
	this.httpclients = 0;
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, IMAGECACHE);
	if (!g.exists()) {
		g.createDirectory();
	};
	return this;
}

Taxonom.prototype.getImage = function(_args) {
	var self = this;
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, IMAGECACHE, Ti.Utils.md5HexDigest(_args.url) + '@2x.png');
	if (file.exists()) {
		self.dblink.execute('UPDATE images SET cached=1 WHERE url=?', _args.url);
		_args.onload({
			path : file.nativePath,
			ok : true
		});
		return;
	} else {
		var xhr = Ti.Network.createHTTPClient({
			timeout : 20000,
			ondatastream : function(_e) {
				if (_args.onprogress && typeof _args.onprogress == 'function') {
					_args.onprogress(_e.progress)
				}
			},
			onload : function(_e) {
				if (this.status == 200) {
					file.write(xhr.responseData);
					self.dblink.execute('UPDATE images SET cached=1 WHERE url=?', _args.url);
					_args.onload({
						path : file.nativePath,
						ok : true
					});
					file = null;
					xhr = null;
				} else {
					console.log(this.status);
					_args.onload({
						ok : false,
						status : this.status
					});
				}
			},
			onerror : function(_e) {
				console.log('S=' + this.status);
				console.log('E=' + this.error);
				_args.onload({
					ok : false
				});
			}
		});
		xhr.open('GET', _args.url);
		xhr.send(null);
	}
}

Taxonom.prototype.trytocacheAllByPackageId = function(_args) {
	console.log('START CACHING');
	var total = 0;
	var q = 'SELECT COUNT(*) AS total FROM images WHERE dichotomid = "' + _args.package_id + '"';
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		total = resultset.fieldByName('total')
	}
	var cache = (CACHEDEBUG) ? 1 : 0;
	var q = 'SELECT * FROM images WHERE cached=' + cache + ' AND dichotomid = "' + _args.package_id + '"';
	resultset = this.dblink.execute(q);
	var images = [];
	while (resultset.isValidRow()) {
		images.push(resultset.fieldByName('url'));
		resultset.next();
	}
	resultset.close();
	if (!images.length) {
		_args.onload(true);
		return;
	}
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Ja, runterladen', 'Nein, Abbruch'],
		message : 'Insgesamt besteht die Bestimmung aus ' + total + ' Bildern. \n\nMöchten Sie die ' + images.length + ' Bilder für den Freiimfelde-Gebrauch herunterladen?',
		title : 'Für netzlosen Gebrauch vorbereiten …'
	});
	dialog.show();
	var self = this;
	dialog.addEventListener('click', function(e) {
		_args.onload();
		// switch to next page
		if (e.index === 0) {// no cancel, the user  want to cache
			var counter = 1;
			var progresswindow = require('module/progress.window').create();
			progresswindow.open();
			function cacheAllImagesByPackage(_dichotom_id) {
				console.log(Ti.Platform.availableMemory);
				var q = 'SELECT url FROM images WHERE cached=0  AND dichotomid = "' + _dichotom_id + '" LIMIT 0,1';
				resultset = self.dblink.execute(q);
				if (resultset.isValidRow()) {
					var url = resultset.fieldByName('url');
					self.getImage({
						url : url,
						onprogress : function(_progress) {
							progresswindow.progress.detail.value = _progress;
							progresswindow.progress.total.message = counter + ' / ' + images.length;
						},
						onload : function(_res) {
							counter++;
							progresswindow.preview.image = _res.path;
							progresswindow.progress.total.value = (counter - 2) / images.length;
							/* next row until all ros are cached*/
							if (_res.ok == true) {
								self.dblink.execute('UPDATE images SET cached=1 WHERE url=? AND dichotomid=?', url, _dichotom_id);
								cacheAllImagesByPackage(_dichotom_id);
							} else {
								console.log('Error mirroring');
							}
						}
					});
					resultset.close();
				} else {
					progresswindow.close();
					_args.onload(true);
				}
			}

			cacheAllImagesByPackage(_args.package_id);
		}
	});
}
/*
 *
 *
 *
 * /
 */
Taxonom.prototype.getAllPackages = function(_args) {
	function getRemoteData(_md5) {
		console.log('Start HTTPclient');
		xhr = Ti.Network.createHTTPClient({
			onload : function() {
				console.log(this.status);
				if (this.status == 200) {
					var xml = new Ti.App.XMLTools(this.responseText);
					if (!xml) {
						dialog.setMessage('Datenabgleich missglückt. Beim nächsten Start des Naturlotsen wird es repariert.');
						dialog.show();
					}
					var packages = xml.toObject(xml).Wiki.Page;
					console.log('Number of Packages:' + packages.length);
					Ti.App.Properties.setString('packages', JSON.stringify(packages));
					if (!_md5 || _md5 !== Ti.Utils.md5HexDigest(JSON.stringify(packages))) {
						console.log('refresh Packagelists');
						return;
					}
					_args.onload(packages);

				}
				_args.onerror();
			},
			onerror : function() {
				_args.onerror(this.error);
			},
			timeout : 60000
		});
		xhr.open('GET', PACKAGEURL);
		xhr.send(null);
	}

	if (!Ti.App.Properties.hasProperty('packages')) {
		console.log('initial loading of packages');
		var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', 'packages.json');
		Ti.App.Properties.setString('packages', file.read().text)
	}
	console.log('Loading of list from LS');
	var packagesstring = Ti.App.Properties.getString('packages');
	var md5 = Ti.Utils.md5HexDigest(packagesstring);
	var packages;
	try {
		packages = JSON.parse(packagesstring);

	} catch(E) {
		console.log('remove LIST');
		Ti.App.Properties.removeProperty('packages');
	}
	console.log('Test Networktype');
	if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_MOBILE) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Ja', 'Nein'],
			message : 'Sie sind lediglich mobil unterwegs. Wollen Sie tatsächlich die Daten des Naturlotsen aktualisieren?',
			title : 'Datenerneuerung'
		});
		console.log('asking of reloading');
		dialog.show();
		dialog.addEventListener('click', function(_e) {
			if (_e.index == 0)
				getRemoteData(md5);
			else {
			}
			_args.onload(packages);
		});
	}
	getRemoteData(md5);
}

Taxonom.prototype.getPackageList = function(_args) {
	var self = this;
	var url = _args.package['Exchange_4_URI'];
	var package_id = Ti.Utils.md5HexDigest(_args.package.Title);
	_args.row.package_id = package_id;
	var package_is_actual = false;

	/* Test how many image */
	var resultset = this.dblink.execute('SELECT COUNT(*) AS total FROM images WHERE dichotomid=?', package_id);
	if (resultset.isValidRow())
		var imagestotal = resultset.fieldByName('total');
	resultset.close();

	/* test how many decisions */
	resultset = this.dblink.execute('SELECT COUNT(*) AS total FROM decisions WHERE dichotomid=?', package_id);
	if (resultset.isValidRow()) {
		packagestotal = resultset.fieldByName('total');
	}
	resultset.close();
	if (packagestotal == 0) {
		//	_args.row.hide();
	}

	/* Building of text */
	var metatext = packagestotal + ' Fragen   ';
	if (imagestotal > 0)
		metatext += imagestotal + ' Bilder';
	_args.row.meta.setText(metatext);

	/* Test if actuell */
	resultset = this.dblink.execute('SELECT mtime FROM dichotoms WHERE dichotomid=?', package_id);
	if (resultset.isValidRow())
		if (_args.package['Creation_Time'] == resultset.fieldByName('mtime'))
			package_is_actual = true;
	resultset.close();
	if (package_is_actual) {
		console.log('pacjage OK');
		return;
	}

	_args.row.progress.show();
	var xhr = Ti.Network.createHTTPClient({
		timeout : 25000,
		onerror : function() {
			console.log(url);
			console.log(this.error);
		},
		ondatastream : function(_e) {
			_args.row.progress.value = _e.progress;
		},
		onload : function() {
			var json = xhr.responseText;
			try {
				var data = JSON.parse(json.striptags());

			} catch (E) {
				console.log(url);
				_args.row.hide();
				return
			}
			self.dblink.execute('DELETE  FROM  images WHERE dichotomid="' + package_id + '"');
			self.dblink.execute('DELETE  FROM  dichotoms WHERE dichotomid="' + package_id + '"');
			self.dblink.execute('DELETE  FROM  decisiontrees WHERE dichotomid="' + package_id + '"');
			self.dblink.execute('DELETE  FROM  decisions WHERE dichotomid="' + package_id + '"');
			self.dblink.execute('INSERT INTO dichotoms (dichotomid,meta,mtime) VALUES (?,?,?)', package_id, JSON.stringify(data.metadata), mtime);
			for (var i = 0; i < data.content.length; i++) {
				if (data.content[i].type === 'decisiontree') {
					var treeid = data.content[i].id;
					self.dblink.execute('INSERT INTO decisiontrees (dichotomid,treeid,meta) VALUES (?,?,?)', package_id, treeid, JSON.stringify(data.content[i].metadata));
					for (var d = 0; d < data.content[i].decision.length; d++) {
						var decision = data.content[i].decision[d];
						if (decision.id)
							self.dblink.execute('INSERT INTO decisions (dichotomid,treeid,decisionid,decision) VALUES (?,?,?,?)', package_id, treeid, decision.id, JSON.stringify(decision.alternative));
						else
							//console.log(decision);
						for (var a = 0; a < decision.alternative.length; a++) {
							var media = decision.alternative[a].media && decision.alternative[a].media;
							for (var m = 0; m < media.length; m++) {
								if (media[m]['url_420px'])
									self.dblink.execute('INSERT INTO images (dichotomid,url,cached) VALUES (?,?,0)', package_id, media[m]['url_420px']);
							}
						}
					}
				}
			}
			_args.row.progress.hide();
			_args.row.hasChild = true;
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
	data = null;
}
/*  get all for a decision (including infos about decsion tree
 *
 *  args are:
 *  package_id
 *  next_id  (null if start)
 *  currenttree_id
 *  onsuccess  (callback)
 */
Taxonom.prototype.getDecisionById = function(_args, _onsuccess) {
	var options = {
		decision_id : _args.next_id,
		package_id : _args.package_id,
		currenttree_id : _args.currenttree_id,
		name : ''
	};
	console.log('........START getDecisionById');
	console.log(options)
	if (!options.decision_id) {
		var q = 'SELECT treeid, meta FROM decisiontrees WHERE dichotomid = "' + options.package_id + '" LIMIT 0,1';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			options.currenttree_id = resultset.fieldByName('treeid');
			console.log('no nex_id ===> id initial setting to start-treeId "' + options.currenttree_id + '"')
		} else
			console.log('no result by this dichotomid ' + options.package_id)
		resultset.close();
	} else {
		if (options.decision_id.match(/_decisiontree/i)) {// new tree
			options.currenttree_id = options.decision_id + '_';
			console.log('next_id was  new treeId ' + options.currenttree_id)
			options.decision_id = undefined;
		}
	}
	console.log('........After testing if we change to other tree');
	console.log(options)
	console.log('........Determining next decisionid');

	var q = 'SELECT decision, decisionid FROM decisions WHERE dichotomid = "' + options.package_id + '" AND treeid="' + options.currenttree_id + '"';
	if (options.decision_id) {
		q += ' AND decisionid ="' + options.decision_id + '"';
	}
	q += ' LIMIT 0,1';
	console.log(q)
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		console.log('==> next decision found');
		options.alternatives = JSON.parse(resultset.fieldByName('decision'));
		var decisionid = resultset.fieldByName('decisionid');
		if (decisionid)
			options.name = decisionid.split('_decision_')[1];
		resultset.close();
		// getting meta from currenttree
		var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + options.package_id + '" AND treeid="' + options.currenttree_id + '"';
		console.log(q)
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			options.meta = JSON.parse(resultset.fieldByName('meta'));
			resultset.close();
		}
		console.log('..... before callback');
		console.log(options);
		_onsuccess(options);
	} else {
		options.currenttree_id = _args.currenttree_id;
		var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + options.package_id + '" AND treeid="' + options.currenttree_id + '"';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			options.meta = JSON.parse(resultset.fieldByName('meta'));
			resultset.close();
		}
		var q = 'SELECT decision,decisionid FROM decisions WHERE dichotomid = "' + options.package_id + '" AND treeid="' + options.currenttree_id + '" LIMIT 0,1';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			optionsalternatives = JSON.parse(resultset.fieldByName('decision'));
			var decisionid = resultset.fieldByName('decisionid');
			console.log(decisionid);
			options.name = decisionid.split('_decision_')[1];
			resultset.close();
			_onsuccess(options)
		}
	}

}
module.exports = Taxonom;
