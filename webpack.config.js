const path = require('path');
const webpack = require('webpack');
const postcssNormalize = require('postcss-normalize');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (mode) => {
  console.log('NODE_ENV:', mode);

  // VARIABLES
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  // CONFIGURATION
  const config = {};

  config.devtool = isProduction
    ? 'source-map'
    : 'cheap-module-eval-source-map';

  config.entry = './src/index.tsx';

  config.mode = mode;

  config.module = {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          // Creates `style` nodes from JS strings
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          // Translates CSS into CommonJS
          { loader: 'css-loader', options: { importLoaders: 2 } },
          // Compiles scss/sass to css
          { loader: 'sass-loader', options: { sourceMap: true } },
          // process CSS with PostCSS
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssNormalize(),
                require('autoprefixer'),
                require('postcss-preset-env'),
                require('postcss-flexbugs-fixes'),
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
        test: /\.ts(x?)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader',
        options: {
          // disable type checker - used in fork plugin
          transpileOnly: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  };

  config.output = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  };

  config.plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Webpack boilerplate',
      favicon: './public/favicon.ico',
      template: './public/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({ eslint: true }),
  ];

  config.resolve = {
    extensions: ['.js', '.ts', '.tsx'],
    // alias: {
    //   components: path.resolve(__dirname, './src/components/'),
    //   images: path.resolve(__dirname, './src/images/'),
    // },
  };

  if (isDevelopment) {
    config.plugins.push(
      new ErrorOverlayPlugin(),
      new webpack.HotModuleReplacementPlugin()
    );

    config.devServer = {
      historyApiFallback: true,
      contentBase: './dist',
      open: true,
      compress: true,
      hot: true,
      port: 8080,
    };
  }

  if (isProduction) {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    };

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
        chunkFilename: '[id][contenthash].css',
      })
    );
  }

  return config;
};
