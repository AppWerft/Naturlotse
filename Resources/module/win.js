exports.create = function(_title) {
	var self = Ti.UI.createWindow({
		title : _title,
		barColor : 'black'
	});
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
	self.addEventListener('close', function() {
		console.log('!!!!!!!!!! close ' + self.title);
		self = null;
	});
	self.addEventListener('open', function() {
		self.actind.hide();
		console.log('!!!!!!!!!! open ' + self.title);
	});
	self.addEventListener('focus', function() {
		self.actind.hide();
		console.log('!!!!!!!!!! focus  ' + self.title);
	});
	self.addEventListener('blur', function() {
		self.actind.hide();
		console.log('!!!!!!!!!! blur  ' + self.title);
	});
	function onScann(_e) {
		var rest = parseInt(_e.imagecounter.images) - parseInt(_e.imagecounter.found);
		try {
			self.actind.setMessage('Bilder-Datenbank: ' + rest + ' / ' + _e.imagecounter.images);
		} catch(E) {
		}
	}
	Ti.App.addEventListener('imagescanprogress', onScann);
	self.addEventListener('close',function(){Ti.App.removeEventListener('imagescanprogress', onScann);})
	return self;
}
