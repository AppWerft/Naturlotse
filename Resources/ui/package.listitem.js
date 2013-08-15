exports.create = function(_args) {
	if (!_args.package || !_args.package.Title) {
		console.log('Warning: missing Title of package');
		return null;
	}

	_args.package.id = Ti.Utils.md5HexDigest(_args.package.Title);
	console.log('listitem build:   ' + _args.package.id);
	var self = {
		properties : {
			itemId : _args.package.id,
			accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL,
		},
		pic_url : {
			image : (_args.package.IconURL) ? _args.package.IconURL : ''
		},
		package_name : {
			text : _args.package.Title.entities2utf8().replace(/\(.*?\)/,'')
		},
		meta_text : {
			text : 'Metaangaben zum Paket'
		}
	}

	Ti.App.Taxo.getPackageInfo({
		package : _args.package,
		listitem : self
	});
	return self;
}