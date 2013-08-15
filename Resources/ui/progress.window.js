exports.create = function() {
	var self = Ti.UI.createWindow({});
	var bg = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.7
	});
	self.add(bg);
	self.preview = Ti.UI.createImageView({
		width : '90%',
		height : 'auto',
		defaultImage : '/assets/naturlogo.png',
		borderRadius : 10
	});
	self.add(self.preview);
	var container = Ti.UI.createView({
		bottom : 0,
		height : 100,
		layout : 'vertical',
		backgroundImage : '/assets/way.png',
		height : Ti.UI.SIZE
	});
	self.add(container);
	self.progress = {
		detail : Ti.UI.createProgressBar({
			height : 'auto',
			width : '90%',
			top : 10,
			min : 0,
			opacity : 0.7,
			value : 0,
			max : 1
		}),
		total : Ti.UI.createProgressBar({
			height : 'auto',
			message : 'Total',
			top : 5,
			opacity : 0.7,
			bottom : 10,
			min : 0,
			width : '90%',
			max : 1,
			value : 0
		}),
	}
	container.add(self.progress.detail);
	container.add(self.progress.total);
	self.progress.detail.show();
	self.progress.total.show();
	return self;
}

