const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const production = true;
const mode = production ? "production" : "development";

module.exports = {
    target: "web",
    entry: {
        client: "./src/ts/Polybius.ts",
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
    cache: true,
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new WebpackCleanupPlugin(),
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
    mode: mode,
};