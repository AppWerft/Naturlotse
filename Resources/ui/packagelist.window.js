exports.create = function() {
	// /Applications/android-sdk-mac_x86/platform-tools/adb -d logcat | grep TiAPI

	var self = Ti.UI.createWindow({
		title : 'Offener Naturführer – Paketübersicht',
		navBarHidden : true,
		exitOnClose : true,
		locked : false,
		orientationModes : [Titanium.UI.PORTRAIT]
	});

	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		width : 300,
		message : ' Aktualisiere den \n Naturlotsen. ',
		height : 80,
		zIndex : 999,
		opacity : 0.7,
		font : {
			fontSize : '12dp'
		},
		borderRadius : '8dp'
	});
	self.add(self.actind);
	self.actind.show();
	var tv = Ti.UI.createScrollView({
		height : Ti.UI.FILL,
		backgroundImage : 'Default.png',
		contentHeight : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		contentWidth : Ti.UI.FILL,
		layout : 'vertical'
	});
	self.add(tv);

	setTimeout(function() {
		Ti.App.Taxo.getAllPackages({
			onerror : function() {
				self.actind.hide();
			},
			onload : function(_list) {
				tv.backgroundColor = 'white';
				self.actind.hide();
				tv.backgroundColor = 'white';
				if (!_list) {
					console.log('List is empty => exit');
					self.close();
				}
				tv.removeAllChildren();
				console.log(_list);
				if (_list)
					for (var i = 0; i < _list.length; i++) {
						var item = _list[i].Template;
console.log(item.Title);
						if ( typeof item.Title != 'string')
							continue;
						if (!item['Exchange_4_Format']) {
							console.log('JSON in list is missing');
							continue;
						}
						console.log(item.Title);
						item.id = Ti.Utils.md5HexDigest(item.Title)
						var row = require('ui/packagelist.row').create(item)
						tv.add(row);
						/* to decisionstree */
						row.addEventListener('click', function(_e) {
							setTimeout(function() {
								source.setBackgroundColor('white');
							}, 100);
							var source = (_e.source.parentview) ? _e.source.parentview : _e.source;
							if (!source.package || !source.package.id)
								return;
							//	source.setBackgroundColor('#9f9');
							self.actind.show();
							self.actind.message = 'Überprüfung, ob Bilder zwischengespeichert werden können.';
							Ti.App.Taxo.trytocacheAllByPackageId({
								package_id : source.package.id,
								onload : function(_e) {
									self.actind.hide();
									if (_e == true) {
										self.actind.hide();
										var options = {
											package_id : source.package.id,
											package_title : source.package.Title
										};
										if (self.tab) {
											self.tab.open(require('ui/decision.window').create(options));
										} else {
											require('ui/decision.window').create(options).open();
										}
									}
								}
							});
						});
					}
			}
		});
		self.demo = Ti.UI.createLabel({
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
		self.add(self.demo);
	}, 10);
	tv.addEventListener('scroll', function() {
		self.demo.hide()
	});
	return self;
}
