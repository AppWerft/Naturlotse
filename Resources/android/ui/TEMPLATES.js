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
				width : '100dip',
				height : 'auto',
				top : '10dip',
				left : '-10dip'
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
				left : '90dip',
				height : Ti.UI.SIZE,
				top : '5dip',
				bottom : '5dip',
				right : '20dip',
			},

			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'package_name',
				events : {
					'click' : event
				},
				properties : {
					color : '#222',
					width : Ti.UI.FILL,
					height : Ti.UI.SIZE,
					bubbleParent : false,
					font : {
						fontSize : '18dip',
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
						fontSize : '13dip',
						fontFamily : 'OpenBaskerville0.0.75'
					},
					left : 0,
					top : '5dip'
				}
			}]
		}]
	};
}