var config = {
    entry: './src/index.js',
    context: __dirname,
    output: {
        path: __dirname + '/build',
        filename: 'index.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: "./public",
        hot: true,
        inline: true,
        port: 8080,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0','react']
                }
            },
            {
                test: /\.css/,
                loaders: ['style-loader', 'css-loader']
            },
	        {
		        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
		        loader: 'url-loader?limit=100000'
	        }
        ],

    },
    resolve: {
        extensions: [ '.js', '.jsx'],
    }
}

module.exports = config;