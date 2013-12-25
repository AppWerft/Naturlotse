exports.create = function(_args) {
	console.log('Start decisionwindow');
	console.log(_args);
	var self = require('ui/win').create(_args.package_title);
	self.actind.message = 'Suche Bilder.';
	self.actind.show();
	Ti.App.Taxo.getDecisionById(_args, function(decision) {
		self.actind.hide();
		if (!decision)
			return self;
		if (decision.name)
			self.title = 'Entscheidung № ' + decision.name;
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
					fontSize : Ti.App.CONF.fontsize_subtitle,fontFamily: 'OpenBaskerville-0.0.75'
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
		self.add(tv);
		var rows = [];
		if (decision.alternatives)
			for (var i = 0; i < decision.alternatives.length; i++) {
				rows[i] = require('ui/decisionrow').create(decision.alternatives[i]);
			}
		tv.setData(rows);
		tv.addEventListener('click', function(_e) {
			self.actind.show();
			self.actind.message = 'Hole nächste Entscheidung';
			var next_id = _e.rowData.next_id;
			if (!next_id || next_id.match(/_wikipage/i)) {
				var win = self.actind.message = 'Hole Detailinfos …';
				if (self.tab) {
					self.tab.open(require('ui/taxodetail.window').create(_e.rowData.item));
				} else {
					require('ui/taxodetail.window').create(_e.rowData.item).open();
				}
				return;
			}
			var options = {
				next_id : _e.rowData.next_id,
				package_id : _args.package_id,
				currenttree_id : decision.currenttree_id
			};
			if (self.tab) {
				self.tab.open(require('ui/decision.window').create(options));
			} else {
				require('ui/decision.window').create(options).open();
			}
		});
		if (autors)
			autors.addEventListener('click', function(_e) {
				var options = {
					meta : _e.source.meta
				};
				if (self.tab) {
					self.tab.open(require('ui/autoren.window').create(options));
				} else {
					require('ui/autoren.window').create(options).open();
				}
			});
	});
	return self;
};
