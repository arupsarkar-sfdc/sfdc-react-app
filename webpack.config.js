const HtmlWebPackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

// const htmlPlugin = new HtmlWebPackPlugin({
//   template: "./src/index.html",
//   filename: "./index.html",
// });

const htmlWebPackPlugin =  new HtmlWebPackPlugin({
  title: "PWA Webpack Demo",
  template: "./src/index.html",
  filename: "./index.html",  
});

const workBoxPlugin_Generate = new WorkboxPlugin.GenerateSW({
  // these options encourage the ServiceWorkers to get in there fast
  // and not allow any straggling "old" SWs to hang around
  clientsClaim: true,
  skipWaiting: true,
});

const processEnvPlugin = new webpack.DefinePlugin({
  "process.env.PUBLIC_URL": JSON.stringify(process.env.PUBLIC_URL),
});

module.exports = {
  entry: ["./src/index.tsx",],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    // NEW
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  }, // NEW Ends
  plugins: [htmlWebPackPlugin, workBoxPlugin_Generate, processEnvPlugin],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      // css rules
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
