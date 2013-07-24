exports.create = function(_args) {
	var self = require('module/win').create('dichotom window');
	self.setModal(true);
	self.backgroundColor = 'white';
	self.addEventListener('android:back', function(_e) {
		console.log('CLOSE ======');
		_e.source.close()
	});
	Ti.UI.CONF = {
		fontsize_title : Ti.Platform.displayCaps.platformWidth * 0.06,
		fontsize_subtitle : Ti.Platform.displayCaps.platformWidth * 0.04,
		fontsize_label : Ti.Platform.displayCaps.platformWidth * 0.04,
		padding : Ti.Platform.displayCaps.platformWidth * 0.04,
	};
	self.actind.message = 'Suche Bilder.';
	self.actind.show();

	self.setTitle(_args.dichotom_title);
	var leftButton = Ti.UI.createButton({
		title : 'Zurück'
	});
	if (Ti.Platform.name !== 'android') {
		self.setLeftNavButton(leftButton);
		leftButton.addEventListener('click', function() {
			self.close({
				animated : true
			})
		});
	}

	Ti.App.Dichotom.getDecisionById(_args, function(decision) {
		self.actind.hide();
		if (!decision)
			return self;
		if (decision.meta) {
			var head = Ti.UI.createView({
				top : 0,
				backgroundColor : '#383',
				height : Ti.UI.SIZE,
				bottom : 0,
				layout : 'horizontal'
			});
			head.addEventListener('click', function() {
				self.close();
			});
			/*if (decision.meta.icon_url)
			 head.add(Ti.UI.createImageView({
			 image : decision.meta.icon_url,
			 top : 0,
			 left : 5,
			 color : 'white',
			 bottom : 0,
			 width : 80,
			 height : 90,
			 height : Ti.UI.SIZE
			 }));*/
			head.add(Ti.UI.createLabel({
				text : decision.meta.title.entities2utf8(),
				top : 10,
				left : 10,
				right : 10,
				color : 'white',
				bottom : 10,
				font : {
					fontSize : Ti.UI.CONF.fontsize_subtitle
				},
				height : 70
			}));
			self.add(head);
		}
		var tv = Ti.UI.createTableView({
			backgroundColor : 'transparent',
			top : (decision.meta) ? 90 : 0
		});
		self.add(tv)
		var rows = [];
		for (var i = 0; i < decision.alternatives.length; i++) {
			rows[i] = require('module/decisionrow').create(decision.alternatives[i]) ;
		}
		tv.setData(rows);
		tv.addEventListener('click', function(_e) {
			self.actind.show();
			self.actind.message = 'Hole nächste Entscheidung';
			var next_id = _e.rowData.next_id;
			if (!next_id || next_id.match(/_wikipage/i)) {
				self.actind.message = 'Hole Detailinfos …';
				var win = require('module/dichotom.detail').create(_e.rowData.item);
				win.open();
				return;
			}
			if (self.tab) {
				self.tab.open(require('module/dichotom.window').create({
					next_id : _e.rowData.next_id,
					dichotom_id : _args.dichotom_id,
					tree_id : decision.tree_id
				}));
			} else {
				require('module/dichotom.window').create({
					next_id : _e.rowData.next_id,
					dichotom_id : _args.dichotom_id,
					tree_id : decision.tree_id
				}).open();
			}
		});
	});
	self.addEventListener('close', function() {
		//	self = null;
	})

	return self;
}
