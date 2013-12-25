(function() {
	Ti.App.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	Ti.App.XMLTools = require('vendor/XMLTools');
	Ti.include('vendor/prototypes.js');
	var Taxo = require('model/taxonomy.model');
	Ti.App.Taxo = new Taxo();
	require('ui/paket.listview.window').create().open();
})();
///Applications/android-sdk-mac_x86/platform-tools/adb -d logcat | grep TiAPI