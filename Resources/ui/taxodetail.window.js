exports.create = function(_item) {
	var self = require('ui/win').create('Detailseite');
	self.audioPlayer = Ti.Media.createAudioPlayer({
		allowBackground : true,
	});
	self.audioPlayer.addEventListener('progress', function(_e) {
		self.audioPlayer.progress = _e.progress;
	});
	self.audioPlayer.addEventListener('change', function(_e) {
		if (self.audioPlayer.playing == true)
			self.actind.hide();

	});
	self.addEventListener('close', function() {
		self.audioPlayer.stop();
		if (Ti.Platform.osname === 'android') {
			self.audioPlayer.release();
		}
	});

	if (_item.result.common_names)
		self.setTitle(_item.result.common_names);

	var container = Ti.UI.createTableView({
		backgroundColor : 'white',
	});
	self.add(container);
	if (_item.result.common_names)
		container.appendRow(require('ui/commonrow').create('Bezeichnung', _item.result.common_names));
	if (_item.result.description)
		container.appendRow(require('ui/commonrow').create('Beschreibung', _item.result.common_description));
	if (_item.statement)
		container.appendRow(require('ui/commonrow').create('', _item.statement));

	if (_item.result.scientific_name)
		container.appendRow(require('ui/commonrow').create('wiss. Name', _item.result.scientific_name));
	if (_item.result.qualifier)
		container.appendRow(require('ui/commonrow').create('Qualifier', _item.result.qualifier));

	if (_item.media) {
		for (var i = 0; i < _item.media.length; i++) {
			var caption = _item.media[i].caption;
			container.appendRow(require('ui/imagerow').create(_item.media[i].url_420px, caption));
			var res = /\([\s]+(.*?)[\s]+\)/g.exec(caption);
			if (res) {
				self.setTitle(res[1]);
				require('ui/xenocanto.model').getSongsByLatinname({
					latin : res[1],
					onload : function(_songs) {
						for (var song = 0; song < _songs.length && song < 10; song++) {
							container.appendRow(require('ui/xenocantoplayer').create(self, _songs[song]));
						}
						if (_item.result.text)
							container.appendRow(require('ui/commonrow').create(_item.result.text, ''));

					},
					oncomplete : function(_e) {
					}
				});
				break;
			} else if (_item.result.text)
				container.appendRow(require('ui/commonrow').create(_item.result.text, ''));

		}
	}
	return self;
};
