module.exports = function (grunt) {

	var _ = require('lodash'),
		path = require('path'),
		config = require('load-grunt-config')(grunt, {
			config: {
				app: grunt.file.readJSON('config.json'),
				pkg: grunt.file.readJSON('package.json')
			},
			configPath: path.join(process.cwd(), 'grunt'),
			init: false
		});


	/*	Recording Task Times
	------------------------------------------*/
		require("time-grunt")(grunt, require('./logGruntTime'));


	/*	Grunt Tasks
	------------------------------------------*/
		grunt.registerTask('default', [
			'build'
		]);

		grunt.registerTask('build', "Generate .js", [
			'clean:build',
			'webpack:world',
			'copy:static',
			'notify:build_complete'
		]);


		grunt.registerTask('fix', function () {

			var target = grunt.option.flags()[0].substring(2),
				connections = grunt.file.expand('./data/' + target + '/connections/*.json'),
				things = grunt.file.expand('./data/' + target + '/things/*.json');

			_.each(connections, function (connection) {
				var data = grunt.file.readJSON(connection),
					new_data = {
						roles: data
					},
					new_connection = './new-' + connection.substring(2);

				grunt.file.write(new_connection, JSON.stringify(new_data, null, 4));
			});

			_.each(things, function (thing) {
				var data = grunt.file.readJSON(thing),
					new_data = {
						value: data.value,
						meta: {
							description: data.description
						},
						connections: data.connections
					},
					new_thing = './new-' + thing.substring(2);

				grunt.file.write(new_thing, JSON.stringify(new_data, null, 4));
			});

		});


	/*	Init Config
	------------------------------------------*/
		grunt.initConfig(config);

};
