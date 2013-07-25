exports.create = function(alt) {
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		next_id : alt.result.next_id,
		item : alt,
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : 'gray'
	});
	if (alt.media[0] && alt.media[0].url_420px) {
		self.image = alt.media[0].url_420px;
		self.layout = 'vertical';
		var imageview = Ti.UI.createImageView({
			top : 10,
			left : 10,
			width : Ti.UI.FILL,
			height : 'auto',
			bubbleParent : true
		});
		self.add(imageview);
		Ti.App.Dichotom.getImage({
			url : self.image,
			onload : function(_res) {
				imageview.setImage(_res.path)
			}
		});
	} else {
		self.add(Ti.UI.createImageView({
			image : 'assets/naturlogo.png',
			defaultImage : '/assets/naturlogo.png',
			top : 10,
			left : 5,
			width : 80,
			height : 80,
			opacity : 0.7,
			bubbleParent : true
		}));
	}
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		left : (self.image) ? 10 : 100,
		top : 10,
		right : 10,
		height : Ti.UI.SIZE,
		bottom : 10,
		color : '#444',
		text : alt.statement.striptags().entities2utf8(),
		font : {
			fontSize : Ti.UI.CONF.fontsize_title,
			fontWeight : 'bold',
			fontFamily : 'TheSans-B7Bold'
		},
	}));
	return self;
}
