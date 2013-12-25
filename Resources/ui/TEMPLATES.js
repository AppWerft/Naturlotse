exports.create = function() {
	return {
		properties : {
			backgroundColor : 'white'
		},
		childTemplates : [{
			type : 'Ti.UI.ImageView',
			bindId : 'pic_url',
			events : {
				click : function() {
				}
			},
			bubbleParent : false,
			properties : {
				width : '75dp',
				height : 'auto',
				top : '10dp',
				left : '10dp'
			}
		}, {
			type : 'Ti.UI.View',
			properties : {
				width : Ti.UI.FILL,
				layout : 'vertical',
				left : '95dp',
				height : Ti.UI.SIZE,
				top : '5dp',
				bottom : '5dp',
				right : '20dp',
			},
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'paket_name',
				properties : {
					color : '#222',
					width : Ti.UI.FILL,
					text :'Titel des Pakets',
					height : Ti.UI.SIZE,
					font : {
						fontSize : '18dp',
						fontFamily : 'OpenBaskerville0.0.75'
					},
					left : 0,
					top : 0
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'meta_text',
				properties : {
					color : '#070',
					height : Ti.UI.SIZE,
					font : {
						fontSize : '13dp',
						fontFamily : 'OpenBaskerville0.0.75'
					},
					left : 0,
					top : '5dp'
				}
			}]
		}]
	};
}; 