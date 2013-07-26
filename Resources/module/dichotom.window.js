exports.create = function(_args) {
	var self = require('module/win').create('Dichotom window');
	self.setModal(true);
	self.backgroundColor = 'white';
	console.log(Ti.Platform.availableMemory);
	self.addEventListener('android:back', function(_e) {
		console.log('CLOSE ======');
		_e.source.close()
	});
	self.actind.message = 'Suche Bilder.';
	self.actind.show();

	self.setTitle(_args.dichotom_title);

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

	Ti.App.Dichotom.getDecisionById(_args, function(decision) {
		self.actind.hide();
		if (!decision)
			return self;
		if (decision.meta) {
			if (!decision.meta.creator)
				decision.meta.creator = decision.meta.creators;
			if (!decision.meta.creator)
				decision.meta.creator = decision.meta.contributor;
			var head = Ti.UI.createView({
				top : 0,
				backgroundColor : '#383',
				height : 90,
			});
			head.add(Ti.UI.createLabel({
				text : decision.meta.title.entities2utf8(),
				top : 10,
				left : 10,
				right : 90,
				color : 'white',
				font : {
					fontSize : Ti.App.CONF.fontsize_subtitle
				},
				height : Ti.UI.SIZE
			}));
			if (decision.meta && decision.meta.creator) {
				var autors = Ti.UI.createButton({
					backgroundImage : '/assets/users.png',
					width : 40,
					height : 40,
					zIndex : 9999,
					meta : decision.meta,
					right : 5,
					bottom : 5
				});
				head.add(autors);
			}
			self.add(head);
		}
		var tv = Ti.UI.createTableView({
			backgroundColor : 'transparent',
			top : (decision.meta) ? 90 : 0
		});
		self.add(tv)
		var rows = [];
		for (var i = 0; i < decision.alternatives.length; i++) {
			rows[i] = require('module/decisionrow').create(decision.alternatives[i]);
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
			var options = {
				next_id : _e.rowData.next_id,
				dichotom_id : _args.dichotom_id,
				tree_id : decision.tree_id
			};
			if (self.tab) {
				self.tab.open(require('module/dichotom.window').create(options));
			} else {
				require('module/dichotom.window').create(options).open();
			}
		});
		if (autors)
			autors.addEventListener('click', function(_e) {
				var options = {
					meta : _e.source.meta
				};
				if (self.tab) {
					self.tab.open(require('module/autoren.window').create(options));
				} else {
					require('module/autoren.window').create(options).open();
				}
			})
	});
	self.addEventListener('close', function() {
		//	self = null;
	})
	return self;
}
