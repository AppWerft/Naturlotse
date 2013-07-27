exports.create = function(_item) {
	var self = require('module/win').create('Detailseite');
	
	self.setTitle(_item.result.common_names);
	self.addEventListener('android:back', function(_e) {
		_e.source.close()
	});
	if (Ti.Platform.name !== 'android') {
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
	var container = Ti.UI.createTableView({
		backgroundColor : 'white',
	});
	self.add(container);
	if (_item.result.common_names)
		container.appendRow(require('module/commonrow').create('Bezeichnung', _item.result.common_names));
	if (_item.result.description)
		container.appendRow(require('module/commonrow').create('Beschreibung', _item.result.common_description));
	if (_item.statement)
		container.appendRow(require('module/commonrow').create('', _item.statement));
		
	if (_item.result.scientific_name)
		container.appendRow(require('module/commonrow').create('wiss. Name', _item.result.scientific_name));	
	if (_item.result.qualifier)
		container.appendRow(require('module/commonrow').create('Qualifier', _item.result.qualifier));	
		
	if (_item.media) {
		for (var i = 0; i < _item.media.length; i++) {
			container.appendRow(require('module/imagerow').create(_item.media[i].url_420px, _item.media[i].caption));
		}
	}
	if (_item.result.text)
		container.appendRow(require('module/commonrow').create( _item.result.text,''));

	return self;
}
