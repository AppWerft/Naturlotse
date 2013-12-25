exports.create = function(event) {
	return {
		properties : {
			backgroundColor : 'white'
		},
		events : {
			'click' : event
		},
		childTemplates : [{
			type : 'Ti.UI.ImageView',
			bindId : 'pic_url',
			bubbleParent : false,
			properties : {
				width : '70dp',
				height : 'auto',
				top : '5dp',
				bottom: '5dp',
				left : '5dip'
			},
			events : {
				'click' : event
			}
		}, {
			type : 'Ti.UI.View',
			properties : {
				width : Ti.UI.FILL,
				layout : 'vertical',
				bubbleParent : false,
				left : '90dp',
				height : Ti.UI.SIZE,
				top : '5dp',
				bottom : '5dp',
				right : '20dp',
			},
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'paket_name',
				events : {
					'click' : event
				},
				properties : {
					color : '#222',
					width : Ti.UI.FILL,
					height : Ti.UI.SIZE,
					bubbleParent : false,
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
				events : {
					'click' : event
				},
				properties : {
					color : '#070',
					height : Ti.UI.SIZE,
					bubbleParent : false,
					font : {
						fontSize : '15dp',
						fontFamily : 'OpenBaskerville0.0.75'
					},
					left : 0,
					top : '5dp'
				}
			}]
		}]
	};
};