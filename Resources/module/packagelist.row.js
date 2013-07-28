exports.create = function(_package) {
	var self = Ti.UI.createView({
		hasChild : false,
		backgroundColor : 'white',
		package : _package,
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : '#393'
	});
	self.add(Ti.UI.createImageView({
		image : _package.IconURL,
		width : '80dp',
		height : 'auto',
		top : '10dp',
		bottom : '10dp',
		left : 0
	}));
	self.container = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		backgroundColor : 'transparent',
		left : '80dp',
		package : _package,
		top : '10dp',
		right : '10dp',
		bottom : '10dp',
		height : Ti.UI.SIZE,
	});
	self.add(self.container);
	self.container.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		bottom : 0,
		package : _package,
		color : '#444',
		text : _package.Title.entities2utf8(),
		backgroundColor : 'transparent',
		font : {
			fontSize : Ti.App.CONF.fontsize_title * 0.9,
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	self.meta = Ti.UI.createLabel({
		height : 25,
		text : 'Metaangaben zum Paket',
		top : 0,
		width : '100%',
		color : '#070',
		font : {
			fontSize : Ti.App.CONF.fontsize_title * 0.6,
			fontFamily : 'TheSans-B6SemiBold'
		},
	});
	self.container.add(self.meta);
	self.progress = Ti.UI.createProgressBar({
		height : 5,
		width : '90%',
		min : 0,
		max : 1,
		value : 0
	});
	self.container.add(self.progress);
	setTimeout(function() {
		Ti.App.Dichotom.updatePackage({
			row : self,
			package : _package,
		});
	}, 100);
	return self;
}
