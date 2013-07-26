exports.create = function(_title) {
	var self = Ti.UI.createWindow({
		title : _title,
		modal : true,
		barColor : 'black',
		orientationModes : [Titanium.UI.PORTRAIT],
		backgroundColor : 'white'
	});
	console.log(Ti.Platform.availableMemory / 1000);
	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		width : 300,
		message : 'Bitte etwas Geduld … ',
		height : 100,
		zIndex : 999,
		opacity : 0.8,
		counter : 0,
		font : {
			fontSize : '12dp'
		},
		borderRadius : '8dp',
		borderColor : 'black',
		borderWidth : 0
	});
	self.add(self.actind);
	self.addEventListener('android:back', function(_e) {
		console.log('CLOSE ======');
		self.close()
	});
	if (Ti.Platform.name !== 'android') {
		self.navBarHidden = false;
		var leftButton = Ti.UI.createButton({
			title : 'Zurück'
		});
		self.setLeftNavButton(leftButton);
		leftButton.addEventListener('click', function() {
			self.close({
				animated : true
			})
		});
	}

	self.addEventListener('close', function() {
		//	console.log('!!!!!!!!!! close ' + self.title);
		self = null;
	});
	self.addEventListener('open', function() {
		self.actind.hide();
		//	console.log('!!!!!!!!!! open ' + self.title);
	});
	self.addEventListener('focus', function() {
		self.actind.hide();
		//	console.log('!!!!!!!!!! focus  ' + self.title);
	});
	self.addEventListener('blur', function() {
		self.actind.hide();
		//	console.log('!!!!!!!!!! blur  ' + self.title);
	});
	return self;
}
