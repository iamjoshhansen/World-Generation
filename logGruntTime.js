var fs = require('fs');

module.exports = function(stats, done) {

	var time_data = {
			duration: stats.reduce(function(acc, stat) {
				return acc + stat[1]
			}, 0),
			tasks: stats.length,
			timestamp: Date.now(),
			parts: stats
		},
		json = ',\n' + JSON.stringify(time_data);

	fs.appendFile('grunt-time-log.jsn', json);

};
