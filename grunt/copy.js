module.exports = {
	
	static: {
		expand: true,
		cwd: '<%= app.source_dir %>/static/',
		src: ['**'],
		dest: '<%= app.build_dir %>',
		filter: 'isFile'
	}

};
