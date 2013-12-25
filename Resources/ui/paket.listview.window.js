exports.create = function() {
	// /Applications/android-sdk-mac_x86/platform-tools/adb -d logcat | grep TiAPI

	var self = Ti.UI.createWindow({
		title : 'Naturlotse – Paketübersicht',
	//	navBarHidden : true,
		fullscreen : true,
		exitOnClose : true,
		locked : false,
		orientationModes : [Titanium.UI.PORTRAIT]
	});
	var onitemclick = function(_event) {
		console.log(_event.itemId);
		self.actind.show();
		self.actind.message = ' Start Bilderspeicherung.';
		Ti.App.Taxo.trytocacheAllByPackageId({
			paket_id : _event.itemId,
			onload : function(_e) {
				self.actind.hide();
				if (_e == true) {
					self.actind.hide();
					var options = {
						paket_id : _event.itemId,
						level : 'start',
						paket_title : 'Title of decision'
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
		width : '2400dip',
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
		backgroundImage : '/default.png',
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
		onload : function(_listofpakets) {
			self.actind.hide();
			if (_listofpakets && _listofpakets.isArray) {
				var items = [];
				var section = Ti.UI.createListSection({
					items : items
				});
				if (Ti.Android)
					Ti.UI.createNotification({
						message : _listofpakets.length + ' Bestimmungspakete gefunden.'
					});
				console.log(_listofpakets.length + ' Packages.');
				for (var i = 0; i < _listofpakets.length; i++) {
					var paket = _listofpakets[i].Template;
					if (!paket) {
						continue;
						console.log('Warning: paket has no Template');
					}
					if ( typeof paket.Title != 'string' || !paket['Exchange_4_Format']) {
						console.log('Warning: invalid paket in list');
						continue;
					}
					var item = require('ui/paket.listitem').create({
						paket : paket,
					});
					if (item)
						items.push(item);
				}
				section.setItems(items);
				self.listView.setSections([section]);
				//Ti.App.Taxo.updateAllPackages(_listofpakets);
			} else;
		}
	});
	self.listView.addEventListener('itemclick', onitemclick);
	return self;
};
