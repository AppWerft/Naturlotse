exports.create = function(_args) {
	if (!_args.paket || !_args.paket.Title) {
		console.log('Warning: missing Title of paket');
		return null;
	}
	_args.paket.id = Ti.Utils.md5HexDigest(_args.paket.Title);
	console.log('listitem build:   ' + _args.paket.id);
	var self = {
		properties : {
			itemId : _args.paket.id,
			accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
		},
		pic_url : {
			image : (_args.paket.IconURL) ? _args.paket.IconURL : ''
		},
		paket_name : {
			text : _args.paket.Title.entities2utf8().replace(/\(.*?\)/,'')
		},
		meta_text : {
			text : 'Metaangaben zum Paket'
		}
	};
	Ti.App.Taxo.getPackageInfo({
		paket : _args.paket,
		listitem : self
	});
	return self;
};