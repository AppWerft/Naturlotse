exports.create = function(_item) {
	console.log(_item.result);
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		transform : Ti.UI.create2DMatrix({
			scale : 0.1
		}),
		borderRadius : 6
	});
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.7
	}));
	self.addEventListener('click', function() {
		self.close();
	});
	var container = Ti.UI.createScrollView({
		backgroundColor : 'white',
		layout : 'vertical',
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
		width : '90%',
		height : '90%',
	});

	self.add(container);
	container.add(Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		color : 'black',
		top : 20,
		left : 10,
		right : 10,
		text : _item.result.common_names,
		font : {
			fontWeight : 'bold'
		}
	}));
	container.add(Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		color : 'black',
		top : 20,
		left : 10,
		right : 10,
		text : _item.result.description,
		font : {

		}
	}))
	container.add(Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		color : 'black',
		top : 10,
		left : 10,
		right : 10,
		text : _item.statement,
	}));
	for (var i = 0; i < _item.media.length; i++) {
		container.add(Ti.UI.createImageView({
			top : 0,
			image : _item.media[i].url_420px,
			width : Ti.UI.FILL,
			height : 'auto'
		}));
		container.add(Ti.UI.createLabel({
			text : _item.media[i].caption,
			height : Ti.UI.SIZE,
			bottom : 40,
			left : 10,
			right : 10,
			color : 'black',
			top : 0
		}))
	}
	container.add(Ti.UI.createLabel({
		height : Ti.UI.SIZE,
		color : 'black',
		top : 30,
		left : 10,
		right : 10,
		text : _item.result.text,
	}));

	self.animate(Ti.UI.createAnimation({
		duration : 500,
		transform : Ti.UI.create2DMatrix({
			scale : 1
		})
	}));
	var button = Ti.UI.createButton({
		title : 'Schließen',
		bottom : '5%',
		height : Ti.UI.CONF.fontsize_title * 3,
		opacity : 0.6,
		font : {
			fontWeight : 'bold',
			fontSize : Ti.UI.CONF.fontsize_title
		},
		width : '90%'
	});

	button.addEventListener('click', function() {
		self.close();
	});
	self.add(button);
	return self;
}
