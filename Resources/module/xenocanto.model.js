exports.getSongsByLatinname = function(_args) {
	var regex = /\/download\.php\?XC=([\d]+)"/g;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var lines = xhr.responseText.split('\n');
			var res = [];
			for (var i = 0; i < lines.length; i++) {
				var elems = lines[i].split(';');
				if (elems.length > 10) {
					res.push({
						id : elems[0],
						genus : elems[1],
						species : elems[2],
						english : elems[3],
						subspecies : elems[4],
						recordist : elems[5],
						country : elems[6],
						location : elems[7],
						lat : elems[8],
						lon : elems[9],
						songtype : elems[10],
						mp3 : elems[12].replace(/ /g, ' '),
						sono : elems[13].replace(/\/tb\/(.*)/g, '/XC') + elems[0] + '-large.png'
					})
				}
			}
			_args.onload(res);
		}
	});
	xhr.open('GET', 'http://www.xeno-canto.org/csv.php?fileinfo=1&species=' + _args.latin);
	xhr.send(null);
}

exports.getDetails = function(_song) {
	var url = 'http://www.xeno-canto.org/embed.php?XC=' + _song.id + '&simple=1';
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var regex = /<div class="jp\-xc\-duration">(.*?)<\/div>/g;
			var res = regex.exec(this.responseText);
			if (res) {
				_song.duration = res[1].split(':')[0] * 60 + res[1].split(':')[1];
				_song.onload(_song);
			}
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}

