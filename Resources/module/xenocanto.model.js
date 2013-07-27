exports.getIDsByLatinname = function(_args) {
	var regex = /\/download\.php\?XC=([\d]+)"/g;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var lines = xhr.responseText.split('\n');
			console.log(lines);
			var res = [];
			for (var i = 0; i < lines.length; i++) {
				var elems = lines[i].split(';')
				res.push({
					id : elems[0],
					genus : elems[1],
					species : elems[2],
					name : elems[3],
					lat : elems[8],
					lon : elems[9],
				})
			}
			console.log(res);
		}
	});
	xhr.open('GET', 'http://www.xeno-canto.org/csv.php?fileinfo=1&species=' + _args.latin);
	xhr.send(null);
}
