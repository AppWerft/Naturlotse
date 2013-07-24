var IMAGECACHE = 'ImageCache';
var Dichotom = function() {
	this.dblink = Ti.Database.install('/depot/dichotoms.sql', 'dichotoms');
	this.dichotom_id = null;
	this.tree_id = null;
	this.tree_metadata = null;
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, IMAGECACHE);
	if (!g.exists()) {
		g.createDirectory();
	};
	return this;
}

Dichotom.prototype.getImage = function(_args) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, IMAGECACHE, Ti.Utils.md5HexDigest(_args.url) + '@2x.png');
	console.log(_args.url);
	if (file.exists()) {
		console.log('IMAGE is always here ...');
		_args.onload(file.nativePath)
	} else {
		var xhr = Ti.Network.createHTTPClient({
			timeout : 20000,
			onload : function(_e) {
				console.log(this.status);
				file.write(xhr.responseData);
				_args.onload(file.nativePath);
			},
			onerror : function(_e) {
				console.log(_e.error);
			}
		});
		xhr.open('GET', _args.url);
		xhr.send(null);

	}

};
Dichotom.prototype.trytocacheAllByDichotomId = function(_args) {
	console.log('START CACHING');
	if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_MOBILE) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Ja, weiter', 'Nein, Abbruch'],
			message : 'ZUr Zeit steht nur eine mobile Verbindung zu Verfügung.\n\nDennoch Naturpilozten nutzen?',
			title : 'Kein WLAN …'
		});
		dialog.show();
		dialog.addEventListener('click', function(_e) {
			if (_e.index == 0) {
				_args.onload(true);
			} else
				_args.onload(false);
		})
		return;
	}
	var q = 'SELECT decision FROM decisions WHERE dichotomid = "' + _args.dichotom_id + '"';
	var resultset = this.dblink.execute(q);
	var images = [];
	var imagecounter = {
		images : 0,
		found : 0
	};
	while (resultset.isValidRow()) {
		var decision = JSON.parse(resultset.fieldByName('decision'));
		if (decision) {
			for (var a = 0; a < decision.length; a++) {
				if (decision[a].media && decision[a].media[0] && decision[a].media[0]['url_420px']) {
					var url = decision[a].media && decision[a].media[0]['url_420px'];
					var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, IMAGECACHE, Ti.Utils.md5HexDigest(url) + '@2x.png');
					if (file.exists()) {
						imagecounter.found += 1;
					} else {
						images.push(url);
					}
					imagecounter.images += 1;
					Ti.App.fireEvent('imagescanprogress', {
						imagecounter : imagecounter
					});
				}
			}
		}
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
		message : 'Insgesamt besteht die Bestimmung aus ' + parseInt(imagecounter.images) + ' Bildern. \nMöchten Sie die fehlenden ' + images.length + ' Bilder für den Freiimfelde-Gebrauch herunterladen?',
		title : 'Für netzlosen Gebrauch vorbereiten …'
	});
	dialog.show();
	var self = this;
	dialog.addEventListener('click', function(e) {
		_args.onload();
		// switch to next page
		if (e.index === 0) {// no cancel, the user  want to cache
			setTimeout(function() {
				for (var i = 0; i < images.length; i++) {
					self.getImage({
						url : images[i],
						onload : function(_path) {
						}
					});
				}
			}, 100);
		}
	});
}

Dichotom.prototype.getAll = function(_args) {
	if (Ti.App.Properties.hasProperty('dichotoms')) {
		console.log('DICHOTOMs exists');
		var dichotomsstring = Ti.App.Properties.getString('dichotoms');
		var md5 = Ti.Utils.md5HexDigest(dichotomsstring);
		try {
			_args.onload(JSON.parse(dichotomsstring));
			return;
		} catch(E) {
			console.log('remove DICHOTOMLIST');
			Ti.App.Properties.removeProperty('dichotom');
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
	console.log('Try to get DICHOTOMs');
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var xml = new Ti.App.XMLTools(this.responseText);
			if (!xml) {
				dialog.setMessage('Wir sind im lokalen Netz, allerdings nicht wirklich im Neuland.');
				dialog.show();
			}
			var dichotoms = xml.toObject(xml).Wiki.Page;
			console.log(dichotoms);
			_args.onload(dichotoms);
			if (md5 && md5 !== Ti.Utils.md5HexDigest(dichotoms)) {console.log('refresh DICHOTOMs');
				Ti.App.Properties.setString('dichotoms', JSON.stringify(dichotoms));
			}
		},
		onerror : function() {
			console.log(this.error);
		},
		timeout : 20000
	});
	xhr.open('GET', 'http://offene-naturfuehrer.de/w/index.php?title=Special:TemplateParameterExport&action=submit&do=export&template=MobileKey');
	xhr.send(null);
}

Dichotom.prototype.importDichotom = function(_args) {
	var self = this;
	var url = _args.dichotom['Exchange_4_URI'].text;
	try {
		var mtime = _args.dichotom['Creation_Time'];
	} catch(E) {
		var mtime = 0;
		console.log(E);
	}
	var dichotomid = Ti.Utils.md5HexDigest(_args.dichotom.Title);
	_args.row.dichotom_id = dichotomid;
	var dichotom_is_actual = false;
	var resultset = this.dblink.execute('SELECT mtime FROM dichotoms WHERE dichotomid=?', dichotomid);
	if (resultset.isValidRow())
		if (mtime == resultset.fieldByName('mtime'))
			dichotom_is_actual = true;
	resultset.close();
	if (dichotom_is_actual) {
		_args.progress.hide();
		_args.row.hasChild = true;
		return;
	}
	_args.progress.show();
	var xhr = Ti.Network.createHTTPClient({
		ondatastream : function(_e) {
			_args.progress.value = _e.progress;
		},
		onload : function() {
			var data = JSON.parse(xhr.responseText.striptags());
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
					}
				}
			}
			_args.progress.hide();
			_args.row.hasChild = true;
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
	data = null;
}

Dichotom.prototype._getAll = function() {
	var resultset = this.dblink.execute('SELECT * FROM dichotoms');
	var list = [];
	while (resultset.isValidRow()) {

		list.push({
			id : resultset.fieldByName('dichotomid'),
			meta : JSON.parse(resultset.fieldByName('meta'))
		});
		resultset.next();
	}
	resultset.close();
	return list;
}

Dichotom.prototype.getDecisionById = function(_args, _onsuccess) {
	if (_args.dichotom_id) {
		this.dichotom_id = _args.dichotom_id;
	}
	console.log('START getDecisionById');

	if (!_args.next_id) {
		var q = 'SELECT treeid, meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" LIMIT 0,1';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			this.tree_id = resultset.fieldByName('treeid');
			console.log('no nex_id ===> id initial setting to start-treeId "' + this.tree_id + '"')
		} else
			console.log('no result by this dichotomid ' + this.dichotom_id)
		resultset.close();
	} else {
		var regex = /_decisiontree/i;
		if (_args.next_id.match(regex)) {// new tre
			this.tree_id = _args.next_id + '_';
			console.log('next_id was  new treeId ' + this.tree_id)
			_args.next_id = undefined;
		} else {
			this.tree_id = _args.tree_id;
		}
	}
	var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		var meta = JSON.parse(resultset.fieldByName('meta'));
		resultset.close();
	}
	var q = 'SELECT decision FROM decisions WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
	if (_args.next_id) {
		q += ' AND decisionid ="' + _args.next_id + '"';
	}
	q += ' LIMIT 0,1';
	var resultset = this.dblink.execute(q);
	if (resultset.isValidRow()) {
		var alternatives = JSON.parse(resultset.fieldByName('decision'));
		resultset.close();
		_onsuccess({
			meta : meta,
			alternatives : alternatives,
			tree_id : this.tree_id
		});
	} else {
		this.tree_id = _args.tree_id;
		var q = 'SELECT meta FROM decisiontrees WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '"';
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			var meta = JSON.parse(resultset.fieldByName('meta'));
			resultset.close();
		}
		var q = 'SELECT decision FROM decisions WHERE dichotomid = "' + this.dichotom_id + '" AND treeid="' + this.tree_id + '" LIMIT 0,1';
		console.log(q);
		var resultset = this.dblink.execute(q);
		if (resultset.isValidRow()) {
			var alternatives = JSON.parse(resultset.fieldByName('decision'));
			resultset.close();
			_onsuccess({
				meta : meta,
				alternatives : alternatives,
				tree_id : this.tree_id
			})
		}
	}

}
module.exports = Dichotom;
