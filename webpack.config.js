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
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css/,
                loaders: ['style-loader', 'css-loader']
            }
        ],

    },
    
}

module.exports = config;