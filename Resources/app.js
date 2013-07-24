(function() {
	Ti.App.XMLTools = require('vendor/XMLTools');
	Ti.include('vendor/prototypes.js');
	var dichotom = require('module/dichotom.model');
	Ti.App.Dichotom = new dichotom();
	var win = require('module/dichotom.list').create();
	win.open();
})();
