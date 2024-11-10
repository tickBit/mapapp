const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Lisää tämä rivi

module.exports = {
    entry: './src/index.js', // Tiedosto, josta Webpack aloittaa
    output: {
        filename: 'bundle.js', // Webpackin generoima tiedosto
        path: path.resolve(__dirname, 'dist'), // Polku, johon tiedosto tallennetaan
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Käytä Babelia JavaScript-tiedostoille
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // Käytä es6=>es5 käännöstä
                    },
                },
            },
        ],
    },
    devServer: {
        static: './dist', // Palvelee dist-hakemiston tiedostot
        open: true, // Avaa selain automaattisesti
        port: 9000, // Käytä porttia 9000
    },
    resolve: {
        alias: {
            leaflet: path.resolve(__dirname, 'node_modules/leaflet'), // Määrittele Leafletin polku
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Lähdetiedosto, jonka pohjalta uusi luodaan
            filename: 'index.html', // Tiedoston nimi dist-hakemistossa
        }),
    ],
};
