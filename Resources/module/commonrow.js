exports.create = function(key, val) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	row.add(Ti.UI.createLabel({
		top : 10,
		left : 10,
		height : Ti.UI.SIZE,
		text : key,
		color : '#999',
		font : {
			fontSize : Ti.App.CONF.fontsize_title * 0.8,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	row.add(Ti.UI.createLabel({
		top : 10,
		left: 10,
		height : Ti.UI.SIZE,
		text : val.entities2utf8(),
		color : '#444',
		font : {
			fontSize : Ti.App.CONF.fontsize_title,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	return row;
}
