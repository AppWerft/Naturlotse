(function() {
	Ti.App.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	Ti.App.XMLTools = require('vendor/XMLTools');
	Ti.include('vendor/prototypes.js');
	var Taxo = require('module/taxonomy.model');
	Ti.App.Dichotom = new Taxo();
	require('module/packagelist.window').create();
	require('module/xenocanto.model').getIDsByLatinname({
		latin : 'Ciconia nigra',
		onload : function() {
		}
	});
})();
