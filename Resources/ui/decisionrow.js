exports.create = function(alt) {
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		next_id : alt.result.next_id,
		item : alt,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : 'gray'
	});
	self.add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		left : 10,
		top : 5,
		height : Ti.UI.SIZE,
		color : '#ddd',
		text : alt.code,
		font : {
			fontSize : 25,
			fontWeight : 'bold'
		}
	}));

	if (alt.media[0] && alt.media[0].url_420px) {
		self.setHeight(360);
		self.image_url = alt.media[0].url_420px;
		var WIDTH = Ti.Platform.DisplayCaps.platformWidth * 0.9;
		Ti.App.Taxo.getImage({// make caching
			url : self.image_url,
			onload : function(_res) {
				var iv = null;
				function onFinishrendering(_e) {
					setTimeout(function() {
						var ratio = parseFloat(parseFloat(iv.size.height) / parseFloat(iv.size.width));
						console.log('Info: image ratio= ' + ratio);
						var height = parseFloat(WIDTH) * ratio + 50.0;
						console.log('Info: height of image: ' + height);
						if (!isNaN(height))
							self.setHeight(height);
					}, 100);

					iv.removeEventListener('postlayout', onFinishrendering);
				}

				iv = Ti.UI.createImageView({

					image : _res.path
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
		right : 0,
		height : Ti.UI.SIZE,
		bottom : 15,
		color : '#444',
		text : alt.statement.striptags().entities2utf8(),
		font : {
			fontSize : Ti.App.CONF.fontsize_title,
			fontFamily : 'OpenBaskerville0.0.75'
		},
	}));
	return self;
};
