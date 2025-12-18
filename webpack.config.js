// webpack.config.js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "inline-source-map",
  entry: {
    // 🔑 CRITICAL FIX: Point to the actual location of index.js
    main: "./src/pages/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/",
    clean: true,
  },
  target: ["web", "es5"],
  stats: "errors-only",
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },
  module: {
    rules: [
      // ... (other rules)
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // <--- ADD THE OPTIONS BLOCK HERE
              importLoaders: 1, // Fixes pathing for @import statements inside CSS
              url: true, // Ensures Webpack resolves paths for fonts and images
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif|woff(2)?|eot|ttf|otf|ico)$/,
    type: "asset/resource",
    generator: {
      // Keep this for the output directory
      filename: "images/[name].[ext]",
    },
      },
    ],
  },
  plugins: [
    // In webpack.config.js -> plugins array
    new HtmlWebpackPlugin({
    //  Tell Webpack to use your index.html file
    template: "./index.html",
    //  Update the favicon path to point into the 'src/images' folder
    favicon: "./src/images/favicon.ico", // 
}),
new CleanWebpackPlugin(),
new MiniCssExtractPlugin(),
  ],
};
