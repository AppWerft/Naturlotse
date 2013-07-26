exports.create = function(_args) {
	var self = require('module/win').create('Autoren und andere Infos zum Bestimmungsbaum');
	self.setModal(true);
		self.backgroundColor = 'white';
	self.addEventListener('android:back', function(_e) {
		self.close()
	});
	self.addEventListener('longpress', function(_e) {
		self.close()
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
	var autorenimg = {
		'Paul Bachhausen' : 'http://www.salamanderseiten.de/Paul.jpg',
		'Gregor Hagedorn' : 'http://www.naturkundemuseum-berlin.de/uploads/pics/nrodegah-gregor-re00.jpg',
		'G. Hagedorn' : 'http://www.naturkundemuseum-berlin.de/uploads/pics/nrodegah-gregor-re00.jpg',
		'Pier Luigi Nimis' : 'http://www.wumingfoundation.com/giap/wp-content/uploads/2012/04/Pierluiginimis.jpeg',
		'Stefano Martellos' : '/assets/creators/stefano.jpg',
		'Walter Gams' : 'http://dpg.phytomedizin.org/uploads/pics/WalterGams1.jpg',
		'Andrea Moro' : '',
		'Werner Nezadal' : 'http://www.herbarium-erlangense.nat.uni-erlangen.de/mitarbeiter/Werner_neu_4.jpg',
		'Philipp Meinecke' : '',
		'Rolf Wißkirchen' : 'http://www.ikg.uni-bonn.de/typo3temp/pics/84a909e2bf.jpg',
		'Tomi Trilar' : 'http://boa.czp-vecer.si/VECER2000/20100120/01480903-300.jpg',
		'Sven Gemballa' : 'http://www.uni-tuebingen.de/uploads/RTEmagicC_Gemballa_Sven.jpg.jpg',
		'Sabine von Mering' : 'http://www.bgbm.fu-berlin.de/bgbm/STAFF/wiss/Mering/images/Foto_SvM_hoch_klein.jpg',
		'Ekkehard Foerster' : '',
		'Andreas Plank' : 'http://www.jki.bund.de/typo3temp/pics/bf16f5f2c8.jpg',
		'A.Plank' : 'http://www.jki.bund.de/typo3temp/pics/bf16f5f2c8.jpg',
		'N.Poelloth' : ''
	}
	var tv = Ti.UI.createTableView();
	self.add(tv);
	if (_args.meta.creator) {
		var autoren = _args.meta.creator.split(', ');
		var rows = [];
		for (var i = 0; i < autoren.length; i++) {
			var autor = autoren[i];
			var row = Ti.UI.createTableViewRow({
				backgroundColor : 'white',
				height : Ti.UI.SIZE,
			});
			row.add(Ti.UI.createImageView({
				top : 10,
				left : 10,
				width : 80,
				height : 'auto',
				defaultImage : '/assets/user.png',
				image : (autorenimg[autor]) ? autorenimg[autor] : '/assets/user.png',
			}));
			console.log(autor);
			row.add(Ti.UI.createLabel({
				top : 10,
				left : 100,
				height : Ti.UI.SIZE,
				text : autor,
				color : '#444',
				font : {
					fontSize : Ti.App.CONF.fontsize_title,
					fontFamily : 'TheSans-B6SemiBold'
				},
			}));
			tv.appendRow(row);
		}
	}
	if (_args.meta.created)
		tv.appendRow(require('module/commonrow').create('Erstellung', require('vendor/moment')(_args.meta.created).format('DD.MM.YYYY')));
	if (_args.meta.modified)
		tv.appendRow(require('module/commonrow').create('letzte Änderung', require('vendor/moment')(_args.meta.modified).format('DD.MM.YYYY')));
	if (_args.meta.audience)
		tv.appendRow(require('module/commonrow').create('Zielgruppe', _args.meta.audience));
	if (_args.meta.source)
		tv.appendRow(require('module/commonrow').create('Quelle', _args.meta.source));
	if (_args.meta.geoscope)
		tv.appendRow(require('module/commonrow').create('Verbreitung', _args.meta.geoscope));
	return self;
}
