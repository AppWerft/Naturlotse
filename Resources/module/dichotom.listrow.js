exports.create = function(item) {
	var self = Ti.UI.createView({
		hasChild : false,
		backgroundColor : 'white',
		dichotom : item,
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : '#393'
	});
	self.add(Ti.UI.createImageView({
		image : item.IconURL,
		width : 70,
		height : 'auto',
		parent : self,
		top : 10,
		bottom : 10,
		left : 10
	}));
	var container = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		left : 90,
		top : 10,
		dichotom : item,
		parent : self,
		right : 10,
		bottom : 10,
		bubbleParent : true,
		height : Ti.UI.SIZE,
	});
	self.add(container);
	container.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		bottom : 0,
		color : '#444',
		dichotom : item,
		bubbleParent : true,
		touchEnabled : false,
		text : item.Title,
		parent : self,
		font : {
			fontSize : Ti.App.CONF.fontsize_title * 0.9,
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	self.meta = Ti.UI.createLabel({
		height : 25,
		text : 'Metaangaben zum Dichotom',
		top : 0,
		width : '100%',
		color : '#070',
		font : {
			fontSize : Ti.App.CONF.fontsize_title * 0.6,
			fontFamily : 'TheSans-B6SemiBold'
		},
	});
	container.add(self.meta);
	self.progress = Ti.UI.createProgressBar({
		height : 5,
		width : '90%',
		min : 0,
		max : 1,
		value : 0
	});
	container.add(self.progress);
	Ti.App.Dichotom.importDichotom({
		row : self,
		dichotom : item
	});
	return self;
}
