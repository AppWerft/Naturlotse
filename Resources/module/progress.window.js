exports.create = function() {
	var self = Ti.UI.createWindow({});
	var bg = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.7
	});
	self.add(bg);
	self.preview = Ti.UI.createImageView({
		width : 280,
		height : 'auto',
		borderRadius : 10
	});
	self.add(self.preview);
	var container = Ti.UI.createView({
		bottom : 0,
		height : 100,
		layout : 'vertical',
		backgroundColor : 'white',
		height : Ti.UI.SIZE
	});
	self.add(container);
	self.progress = {
		detail : Ti.UI.createProgressBar({
			height : 20,
			width : '90%',
			top : 10,
			min : 0,
			value : 0,
			max : 1
		}),
		total : Ti.UI.createProgressBar({
			height : 20,
			top : 10,
			min : 0,
			width : '90%',
			max : 1,
			value : 0
		}),
	}
	self.progress.detail.show();
	self.progress.total.show();
	container.add(self.progress.detail);
	container.add(self.progress.total);
	return self;
}

