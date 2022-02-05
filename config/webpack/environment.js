const { environment } = require('@rails/webpacker')

environment.loaders.prepend('html', {
    test: /\.html$/,
    use: [{
        loader: 'html-loader',
        options: {
            minimize: true,
        }
    }]
});

module.exports = environment
