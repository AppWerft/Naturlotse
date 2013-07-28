exports.create = function(_win, _song) {
	var self = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	var _player = _win.audioPlayer;
	self.sono = Ti.UI.createImageView({
		image : _song.sono,
		width : Ti.UI.FILL,
		top : 10,
		height : 'auto',
		bubbleParent : false,
		bubbleParent : true,
		borderWidth : 1
	});
	self.label = Ti.UI.createLabel({
		text : _song.location + ', ' + _song.country,
		top : 10,
		height : Ti.App.CONF.fontsize_subtitle * 1.4,
		left : 10,
		color : 'black',
		font : {
			fontSize : Ti.App.CONF.fontsize_subtitle,
			fontFamily : 'TheSans-B6SemiBold'
		},
	});

	self.addEventListener('click', function() {
		console.log('PLAYING SONG');
		try {
			if (_player.playing || _player.paused) {
				_player.stop();
				play.image = '/assets/play.png';
				if (Ti.Platform.name === 'android') {
					_player.release();
				}
			} else {
				require('module/xenocanto.model').getDetails({
					id : _song.id,
					onload : function(_e) {
						console.log(_e);
					}
				});
				_win.actind.show();
				_win.actind.setMessage('Lade Stimmprobe …');
				_player.setUrl(_song.mp3);
				_player.start();
				play.image = '/assets/pause.png';
			}
		} catch(E) {
			console.log(E);
		}

	});
	self.navi = Ti.UI.createView({
		height : 40,
		top : 10,
		bottom : 10
	});
	var play = Ti.UI.createImageView({
		left : 10,
		image : '/assets/play.png',
		width : 40,
		height : 40
	});
	self.navi.add(play);
	self.add(self.label);
	self.add(self.sono);
	self.add(self.navi);
	return self;
}
