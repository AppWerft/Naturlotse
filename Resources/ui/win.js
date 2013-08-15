exports.create = function(_title) {
	var self = Ti.UI.createWindow({
		title : _title,
		fullscreen : true,
		orientationModes : [Titanium.UI.PORTRAIT],
		backgroundColor : 'white'
	});
	self.addEventListener('android:back', function(_e) {
		console.log('CLOSE ======');
		self.close();
		return false
	});
	if (Ti.Platform.name !== 'android') {
		self.navBarHidden = false;
		self.modal = true;
		self.barColor = 'black';
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
			fontSize : '12dp',fontFamily:'OpenBaskerville-0.0.75'
		},
		borderRadius : '8dp',
		borderColor : 'black',
		borderWidth : 0
	});
	self.add(self.actind);
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
