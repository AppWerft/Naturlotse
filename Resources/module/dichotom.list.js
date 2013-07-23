exports.create = function() {
	var self = require('module/win').create('Offener Naturführer');
	self.exitOnClose = true;
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	var tv = Ti.UI.createScrollView({
		backgroundColor : 'transparent',
		height : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		contentWidth : Ti.UI.FILL,
		layout : 'vertical'
	});
	self.add(tv);
	var list = Ti.App.Dichotom.getAll({
		onload : function(_list) {
			tv.removeAllChildren();
			var rows = [];
			for (var i = 0; i < _list.length; i++) {
				var item = _list[i].Template;
				if (!item['Exchange_4_Format'])
					continue;
				item.id = Ti.Utils.md5HexDigest(item.Title)
				rows[i] = Ti.UI.createView({
					hasChild : false,
					backgroundColor : 'white',
					dichotom : item,
					height : Ti.UI.SIZE,
					borderWidth : 1,
					borderColor : '#393'
				});
				rows[i].add(Ti.UI.createImageView({
					image : item.IconURL,
					width : 70,
					height : 'auto',
					top : 10,
					left : 10
				}));
				var container = Ti.UI.createView({
					layout : 'vertical',
					width : Ti.UI.FILL,
					left : 90,
					top : 10,
					dichotom : item,
					right : 10,
					bottom : 10,
					bubbleParent : true,
					height : Ti.UI.SIZE,
				});
				rows[i].add(container);
				container.add(Ti.UI.createLabel({
					width : Ti.UI.FILL,
					height : Ti.UI.SIZE,
					bottom : 0,
					color : '#444',
					dichotom : item,
					bubbleParent : true,
					text : item.Title,
					font : {
						fontSize : Ti.UI.CONF.fontsize_title * 0.9,
						fontWeight : 'bold',
						fontFamily : 'TheSans-B7Bold'
					},
				}));
				var progress = Ti.UI.createProgressBar({
					height : 2,
					width : '100%',
					min : 0,
					max : 1,
					value : 0
				});
				Ti.App.Dichotom.importDichotom({
					progress : progress,
					row : rows[i],
					dichotom : item
				});
				container.add(progress);
				tv.add(rows[i]);
				rows[i].addEventListener('click', function(_e) {
					self.actind.show();
					var options = {
						dichotom_id : _e.source.dichotom.id,
						dichotom_title : _e.source.dichotom.Title
					};
					if (self.tab) {
						self.tab.open(require('module/dichotom.window').create(options));
					} else {
						require('module/dichotom.window').create(options).open();
					}
				});
			}
		}
	});
	var demo = Ti.UI.createLabel({
		text : 'Demo',
		opacity : 0.25,
		color : 'red',
		bubbleParent : true,
		transform : Ti.UI.create2DMatrix({
			rotate : -8
		}),
		font : {
			fontSize : '90dp',
			fontWeight : 'bold'
		}
	});
	/*	demo.animate({
	 transform : Ti.UI.create2DMatrix({
	 scale : 1,
	 duration : 2000
	 })
	 })*/
	

	self.add(demo);
	return self;
}
