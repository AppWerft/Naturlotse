exports.create = function() {
	// /Applications/android-sdk-mac_x86/platform-tools/adb -d logcat | grep TiAPI

	var self = Ti.UI.createWindow({
		title : 'Offener Naturführer – Paketübersicht',
		navBarHidden : true,
		exitOnClose : true,
		locked : false,
		orientationModes : [Titanium.UI.PORTRAIT]
	});
	var onitemclick = function(_event) {
		console.log(_event.itemId);
		self.actind.show();
		self.actind.message = ' Start Bilderspeicherung.';
		Ti.App.Taxo.trytocacheAllByPackageId({
			package_id : _event.itemId,
			onload : function(_e) {
				self.actind.hide();
				if (_e == true) {
					self.actind.hide();
					var options = {
						package_id : _event.itemId,
						level : 'start',
						package_title : 'Title of decision'
					};
					if (self.tab) {
						self.tab.open(require('ui/decision.window').create(options));
					} else {
						require('ui/decision.window').create(options).open();
					}
				}
			}
		});
	};
	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		width : '300dip',
		message : ' Aktualisiere den Naturlotsen. ',
		height : '80dip',
		zIndex : 999,
		opacity : 0.7,
		font : {
			fontSize : '12dp'
		},
		borderRadius : '8dp'
	});
	self.add(self.actind);
	self.actind.show();
	self.listView = Ti.UI.createListView({
		backgroundImage : '/Default.png',
		templates : {
			'template' : require('ui/TEMPLATES').create(onitemclick)
		},
		defaultItemTemplate : 'template',
	});
	self.add(self.listView);
	self.open();
	Ti.App.Taxo.getAllPackages({
		onerror : function() {
			self.actind.hide();
		},
		onload : function(_listofpackages) {
			self.actind.hide();
			if (_listofpackages && _listofpackages.isArray) {
				var items = [];
				var section = Ti.UI.createListSection({
					items : items
				});
				console.log(_listofpackages.length + ' Packages.');
				for (var i = 0; i < _listofpackages.length; i++) {
					var package = _listofpackages[i].Template;
					if (!package) {
						continue;
						console.log('Warning: package has no Template')
					}
					if ( typeof package.Title != 'string' || !package['Exchange_4_Format']) {
						console.log('Warning: invalid package in list');
						continue;
					}
					var item = require('ui/package.listitem').create({
						package : package,
					});
					if (item)
						items.push(item);
				}
				section.setItems(items);
				self.listView.setSections([section]);
				//Ti.App.Taxo.updateAllPackages(_listofpackages);
			} else
				console.log('Warning: result from JSON invalide');
		}
	});

	self.listView.addEventListener('itemclick', onitemclick);
	return self;
};
