exports.create = function(_image, _caption) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
	});
	var image = Ti.UI.createImageView({
		top : 0,
		width : Ti.UI.FILL,
		height : 'auto'
	});
	row.add(image);
	Ti.App.Taxo.getImage({
		url : _image,
		onload : function(_e) {
			image.image = _e.path
		}
	});
	row.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5,
		bottom : 0,
		height : Ti.App.CONF.fontsize_subtitle * 3
	}));
	row.add(Ti.UI.createLabel({
		left : 10,
		right : 10,
		bottom : 10,
		height : Ti.UI.SIZE,
		text : _caption.entities2utf8(),
		color : 'white',
		font : {
			fontSize : Ti.App.CONF.fontsize_subtitle,
			fontFamily : 'TheSans-B6SemiBold'
		},
	}));
	return row;
}
