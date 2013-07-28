exports.create = function(_image, _caption) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	var image = Ti.UI.createImageView({
		top : 0,
		width : Ti.UI.FILL,
		height : 'auto'
	});
	row.add(image);
	Ti.App.Dichotom.getImage({
		url : _image,
		onload : function(_e) {
			image.image = _e.path
		}
	});
	row.add(Ti.UI.createLabel({
		top : 10,
		left : 10,
		right : 10,
		bottom : 20,
		height : Ti.UI.SIZE,
		text : _caption.entities2utf8(),
		color : '#444',
		font : {
			fontSize : Ti.App.CONF.fontsize_subtitle,
			fontFamily : 'TheSans-B6SemiBold'
		},
	}));
	return row;
}
