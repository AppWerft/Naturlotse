exports.create = function(alt) {
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		next_id : alt.result.next_id,
		item : alt,
		layout : 'vertical',
		height : 320,
		borderWidth : 1,
		borderColor : 'gray'
	});
	if (alt.media[0] && alt.media[0].url_420px) {
		self.image_url = alt.media[0].url_420px;
		var WIDTH = Ti.Platform.DisplayCaps.platformWidth * 0.9;
		Ti.App.Taxo.getImage({// make caching
			url : self.image_url,
			onload : function(_res) {
				var iv = null;
				function onFinishrendering(_e) {
					console.log(_e);
					var size = _e.source.size;
					console.log('Info: image ratio=' + size.height / size.width);
					//self.setHeight(Ti.UI.SIZE);
					iv.removeEventListener('postlayout', onFinishrendering);
				}

				iv = Ti.UI.createImageView({
					width : '100%',
					height : 'auto',
					image : _res.path,
					height : 'auto'
				});
				self.add(iv);
				iv.addEventListener('postlayout', onFinishrendering);
			}
		});
	} 
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		left : 10,
		top : 10,
		right : 10,
		height : Ti.UI.SIZE,
		bottom : 5,
		color : '#444',
		text : alt.statement.striptags().entities2utf8(),
		font : {
			fontSize : Ti.App.CONF.fontsize_title,
			fontFamily : 'OpenBaskerville0.0.75'
		},
	}));
	return self;
};
