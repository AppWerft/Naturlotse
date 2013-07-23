(function() {
	Ti.App.XMLTools = require('vendor/XMLTools');
	Ti.include('vendor/prototypes.js');
	var dichotom = require('module/dichotom.model');
	Ti.App.Dichotom = new dichotom();
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	require('module/dichotom.list').create().open();
})();
