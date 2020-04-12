const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const flexbugFixes = require('postcss-flexbugs-fixes');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const presetEnv = require('postcss-preset-env');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = (env) => {
  const isDevelopment = env.development;

  // eslint-disable-next-line no-console
  console.log('NODE_ENV:', isDevelopment ? 'development' : 'production');

  const config = {};

  config.entry = './src/index.js';

  config.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment
      ? '[name].bundle.js'
      : '[name].[contentHash].bundle.js',
  };

  config.devtool = isDevelopment
    ? 'cheap-module-eval-source-map'
    : 'source-map';

  config.mode = isDevelopment ? 'development' : 'production';

  config.module = {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          // Creates `style` nodes from JS strings
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: { importLoaders: 2, sourceMap: true },
          },
          // Compiles scss/sass to css
          { loader: 'sass-loader', options: { sourceMap: true } },
          // process CSS with PostCSS
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer,
                flexbugFixes,
                presetEnv,
                postcssNormalize(),
              ],
            },
          },
        ],
      },
      // Inline font files.
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      },
      // Copy image files to build folder.
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  };

  config.plugins = [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new HtmlWebpackPlugin({
      title: 'Webpack boilerplate',
      favicon: './src/favicon.ico',
      template: './src/index.html',
    }),
  ];

  config.resolve = {
    extensions: ['.js', '.jsx'],
  };

  if (isDevelopment) {
    config.plugins.push(
      new ErrorOverlayPlugin(),
      new HotModuleReplacementPlugin(),
    );

    config.devServer = {
      historyApiFallback: true,
      contentBase: './dist',
      open: true,
      compress: true,
      hot: true,
      port: 3000,
    };
  }

  if (env.production) {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({ sourceMap: true }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            // split react and react-dom into a separate chunk
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    };

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id][contenthash].css',
      }),
    );
  }

  return config;
};
