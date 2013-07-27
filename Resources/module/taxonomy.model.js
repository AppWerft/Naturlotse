var IMAGECACHE = 'ImageCache';
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

Taxonom.prototype.trytocacheAllByDichotomId = function(_args) {
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
			function cacheAllImagesByDichotom(_dichotom_id) {
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
								cacheAllImagesByDichotom(_dichotom_id);
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

			cacheAllImagesByDichotom(_args.package_id);
		}
	});
}

Taxonom.prototype.getAllPackages = function(_args) {
	if (Ti.App.Properties.hasProperty('dichotoms')) {
		console.log('DICHOTOMs exists');
		var dichotomsstring = Ti.App.Properties.getString('dichotoms');
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'dichotoms.json');
		file.write(dichotomsstring);
		var md5 = Ti.Utils.md5HexDigest(dichotomsstring);
		try {
			_args.onload(JSON.parse(dichotomsstring));
			return;
		} catch(E) {
			console.log('remove DICHOTOMLIST');
			Ti.App.Properties.removeProperty('dichotoms');
		}
	}
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['OK'],
		message : 'Der Naturlotse braucht anfänglich das Neuland.',
		title : 'Netzprobleme'
	});
	dialog.addEventListener('click', function() {
		_args.onload(null);
	});
	if (Ti.Network.online == false) {
		dialog.show();
		return;
	}
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var xml = new Ti.App.XMLTools(this.responseText);
			if (!xml) {
				dialog.setMessage('Wir sind im lokalen Netz, allerdings nicht wirklich im Neuland.');
				dialog.show();
			}
			var dichotoms = xml.toObject(xml).Wiki.Page;
			if (!md5 || md5 !== Ti.Utils.md5HexDigest(JSON.stringify(dichotoms))) {
				console.log('refresh DICHOTOMs');
				Ti.App.Properties.setString('dichotoms', JSON.stringify(dichotoms));
			}
			_args.onload(dichotoms);
		},
		onerror : function() {
			console.log(this.error);
		},
		timeout : 60000
	});
	xhr.open('GET', 'http://offene-naturfuehrer.de/w/index.php?title=Special:TemplateParameterExport&action=submit&do=export&template=MobileKey');
	xhr.send(null);
}

Taxonom.prototype.importDichotom = function(_args) {
	
	console.log(_args);
	var self = this;
	var url = _args.dichotom['Exchange_4_URI'];
	try {
		var mtime = _args.dichotom['Creation_Time'];
	} catch(E) {
		var mtime = 0;
		console.log(E);
	}
	var dichotomid = Ti.Utils.md5HexDigest(_args.dichotom.Title);
	_args.row.package_id = dichotomid;
	var dichotom_is_actual = false;

	var resultset = this.dblink.execute('SELECT COUNT(*) AS total FROM images WHERE dichotomid=?', dichotomid);
	if (resultset.isValidRow())
		var imagestotal = resultset.fieldByName('total');

	console.log(imagestotal);
	resultset.close();

	resultset = this.dblink.execute('SELECT COUNT(*) AS total FROM decisions WHERE dichotomid=?', dichotomid);
	if (resultset.isValidRow())
		decisionstotal = resultset.fieldByName('total');
	resultset.close();

	var metatext = decisionstotal + ' Fragen   ';
	if (imagestotal > 0)
		metatext += imagestotal + ' Bilder';
	console.log(metatext);
	_args.row.meta.setText(metatext);

	resultset = this.dblink.execute('SELECT mtime FROM dichotoms WHERE dichotomid=?', dichotomid);
	if (resultset.isValidRow())
		if (mtime == resultset.fieldByName('mtime'))
			dichotom_is_actual = true;
	resultset.close();
	if (dichotom_is_actual) {
		_args.row.progress.hide();
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
			var data = JSON.parse(xhr.responseText.striptags());
			self.dblink.execute('DELETE  FROM  images WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('DELETE  FROM  dichotoms WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('DELETE  FROM  decisiontrees WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('DELETE  FROM  decisions WHERE dichotomid="' + dichotomid + '"');
			self.dblink.execute('INSERT INTO dichotoms (dichotomid,meta,mtime) VALUES (?,?,?)', dichotomid, JSON.stringify(data.metadata), mtime);
			for (var i = 0; i < data.content.length; i++) {
				if (data.content[i].type === 'decisiontree') {
					var treeid = data.content[i].id;
					self.dblink.execute('INSERT INTO decisiontrees (dichotomid,treeid,meta) VALUES (?,?,?)', dichotomid, treeid, JSON.stringify(data.content[i].metadata));
					for (var d = 0; d < data.content[i].decision.length; d++) {
						var decision = data.content[i].decision[d];
						if (decision.id)
							self.dblink.execute('INSERT INTO decisions (dichotomid,treeid,decisionid,decision) VALUES (?,?,?,?)', dichotomid, treeid, decision.id, JSON.stringify(decision.alternative));
						else
							console.log(decision);
						for (var a = 0; a < decision.alternative.length; a++) {
							var media = decision.alternative[a].media && decision.alternative[a].media;
							for (var m = 0; m < media.length; m++) {
								if (media[m]['url_420px'])
									self.dblink.execute('INSERT INTO images (dichotomid,url,cached) VALUES (?,?,0)', dichotomid, media[m]['url_420px']);
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