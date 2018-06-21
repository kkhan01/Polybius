const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const production = true;
const mode = production ? "production" : "development";

const htmlPlugin = function(name, chunks) {
    return new HtmlWebpackPlugin({
        inject: true,
        chunks: chunks || undefined,
        filename: `${name}.html`,
        template: `./src/html/${name}.html`,
        hash: true,
        cache: true,
        // favicon: "./src/img/favicon.ico",
        showErrors: !production,
        minify: production && {
            caseSensitive: false,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            conservativeCollapse: false,
            customAttrAssign: [],
            // customAttrCollapse: undefined,
            customAttrSurround: [],
            // customEventAttributes: [],
            decodeEntities: true,
            html5: true,
            ignoreCustomComments: [],
            ignoreCustomFragments: [],
            includeAutoGeneratedTags: true,
            keepClosingSlash: false,
            maxLineLength: Number.MAX_SAFE_INTEGER,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            preserveLineBreaks: false,
            preventAttributesEscaping: false,
            processConditionalComments: true,
            processScripts: [],
            quoteCharacter: "\"",
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeEmptyElements: false,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeTagWhitespace: false,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true,
        },
    });
};

const htmlPlugins = function(args) {
    return Object.entries(args).map(([name, chunks]) => htmlPlugin(name, chunks));
};

module.exports = {
    target: "web",
    entry: {
        Polybius: "./src/ts/polybius/Polybius.ts",
        PolybiusSandbox: "./src/ts/polybius/PolybiusSandbox.ts",
    },
    output: {
        filename: "[name].js",
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
    // optimization: {
    //     splitChunks: {
    //         chunks: "all",
    //     },
    // },
    plugins: [
        ...htmlPlugins({
            popup: [],
            options: ["Polybius"],
            sandbox: ["PolybiusSandbox"],
        }),
    ],
    mode: mode,
};