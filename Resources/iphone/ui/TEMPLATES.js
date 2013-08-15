exports.packages = {
	properties : {
		backgroundColor : 'white',
		height : 120
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'pic_url',
		properties : {
			width : '70dp',
			height : 'auto',
			top : '10dip',
			left : '5dip'
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : '100dip',
			height : Ti.UI.SIZE,
			top : '5dip',
			bottom : '5dip',
			right : '5dip',
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'package_name',
			properties : {
				color : '#444',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				font : {
					fontSize : '18dip',
					fontWeight : 'bold',
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
					fontSize : '13dip',
					fontFamily : 'OpenBaskerville0.0.75'
				},
				left : 0,
				top : '5dip'
			}
		}]
	}]
};

