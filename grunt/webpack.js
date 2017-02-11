var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	'world': {
		entry: './<%= app.source_dir %>/<%= app.name %>.js',
		output: {
			path: '<%= app.build_dir %>',
            filename: '<%= app.name %>.js'
		},
		module: {
			loaders: [
				// HTML
				{
					test: /\.html$/,
					loaders: ['html']
				},

				// JSON
				{
					test: /\.json$/,
					loaders: ['json']
				},

				// SCSS
				{
					test: /\.scss$/,
					loader:  ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
				},

				// Fonts -- With special inclusion for icon svg font
				{
					test: /(^|\/)icon-awf-dev.*.(svg|eot|ttf|woff)$/,
					loader:  'file-loader?name=fonts/[name].[ext]'
				},

				// Images -- With special exclusion for icon svg font
				{
					test: /^((?!\/icon-awf-dev|^icon-awf-dev).)*\.svg$|^.*\.(png|jpg|gif)$/,
					loader:  'file-loader?name=images/[name].[ext]'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('<%= app.name %>.css')
		]
	}
};
