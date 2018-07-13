"use strict";

var basePath = "/";

var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var swPlugin = require("serviceworker-webpack-plugin")

module.exports = {
    devtool: "source-map",
    entry: [
        "babel-polyfill",
        "webpack-dev-server/client?http://localhost:3000/",
        "webpack/hot/only-dev-server",
        "react-hot-loader/patch",
        path.join(__dirname, "src/client/index.js")
    ],
    devServer: {
        contentBase: path.join(__dirname, ""),
        hot: true,
        port: 3000,
        publicPath: basePath,
        historyApiFallback: {
            index: basePath + "index.html"
        },
        disableHostCheck: true,
        host: "0.0.0.0"
    },
    output: {
        path: path.join(__dirname, "/public/"),
        filename: "[name].js",
        publicPath: basePath
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/client/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
        new ExtractTextPlugin("[name].min.css"),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        new swPlugin({
            entry: path.join(__dirname, "src/client/sw.js"),
            publicPath: basePath
        })
    ],
    module: {
        preLoaders: [],
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: "babel"
            },
            {
                test: /\.json?$/,
                loader: "json"
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url-loader",
                options: {
                    limit: 25000
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css!sass")
            },
            {
                test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            },
            { test: /\.(ttf|eot|svg|mp3)(\?[a-z0-9#=&.]+)?$/, loader: "file" }
        ]
    }
};
