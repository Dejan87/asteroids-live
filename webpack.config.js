var path = require("path");

module.exports = {
    entry: {
        app: "./js/app.js",
    },
    output: {
        path: path.resolve(__dirname, "./js/app"),
        filename: "app.js" // [name] will keep the file name dynamic
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
}