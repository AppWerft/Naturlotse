exports.create = function() {
	// /Applications/android-sdk-mac_x86/platform-tools/adb -d logcat | grep TiAPI
	var self = Ti.UI.createWindow({
		title : 'Offener Naturführer',
		navBarHidden : true,
		exitOnClose : true
	});
	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		width : 300,
		message : 'Bitte etwas Geduld … ',
		height : 80,
		zIndex : 999,
		opacity : 0.8,
		font : {
			fontSize : '12dp'
		},
		borderRadius : '8dp',
		borderWidth : 0
	});
	self.add(self.actind);
	var tv = Ti.UI.createScrollView({
		backgroundColor : 'white',
		height : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		contentWidth : Ti.UI.FILL,
		layout : 'vertical'
	});
	self.add(tv);
	self.actind.show();
	self.actind.setMessage('Aktualisiere den Naturpiloten.');
	Ti.App.Dichotom.getAllDichotoms({
		onload : function(_list) {
			self.actind.hide();
			if (!_list) {
				console.log('List is empty => exit');
				self.close();
			}
			console.log(_list.length + ' Dichotome');
			tv.removeAllChildren();
			if (_list)
				for (var i = 0; i < _list.length; i++) {
					var item = _list[i].Template;
					if (!item['Exchange_4_Format'])
						continue;
					item.id = Ti.Utils.md5HexDigest(item.Title)
					var row = require('module/dichotom.listrow').create(item)
					tv.add(row);
					row.addEventListener('click', function(_e) {
						var source = (_e.source.parent) ? _e.source.parent : _e.source;
						source.setBackgroundColor('#9f9');
						setTimeout(function() {
							source.setBackgroundColor('white');
						}, 300);
						if (!source.dichotom || !source.dichotom.id)
							return;
						self.actind.show();
						self.actind.message = 'Überprüfung, ob Bilder zwischengespeichert werden können.';

						Ti.App.Dichotom.trytocacheAllByDichotomId({
							dichotom_id : source.dichotom.id,
							onload : function(_e) {
								self.actind.hide();
								if (_e == true) {
									self.actind.hide();
									var options = {
										dichotom_id : source.dichotom.id,
										dichotom_title : source.dichotom.Title
									};
									if (self.tab) {
										self.tab.open(require('module/dichotom.window').create(options));
									} else {
										require('module/dichotom.window').create(options).open();
									}
								}
							}
						});
					});
				}
		}
	});
	var demo = Ti.UI.createLabel({
		text : 'Demo',
		opacity : 0.25,
		color : 'red',
		borderWidth : 0,
		bubbleParent : true,
		touchEnabled : false,
		transform : Ti.UI.create2DMatrix({
			rotate : -8
		}),
		font : {
			fontSize : '90dp',
			fontWeight : 'bold'
		}
	});
	setTimeout(function() {
		demo.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.01,
				rotate : 180
			}),
			duration : 7000
		}, function() {
			self.remove(demo)
		});
	}, 3000);
	self.add(demo);
	return self;
}
