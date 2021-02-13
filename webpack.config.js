const path = require('path')
const HTMLWebpackPlgin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin")
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

function generateHtmlPlugins() {
   let htmlPageNames = fs.readdirSync('src/html/pages').filter(function (x) {
      return x !== '.gitkeep';
   });
   return multipleHtmlPlugins = htmlPageNames.map(item => {
      const parts = item.split('.');
      const name = parts[0];
      const ext = parts[1];
      return new HTMLWebpackPlgin({
         template: `./html/pages/${name}.${ext}`,
         filename: `${name}.html`,
         cache: false,
         minify: isDev ? {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            preserveLineBreaks: true,
            removeComments: true,
            useShortDoctype: false
         } : {
               removeComments: true,
               collapseWhitespace: false,
            }
      })
   });
}
const htmlPlugins = generateHtmlPlugins();

const optimization = () => {
   const config = {
      splitChunks: {
         chunks: 'all',
         // maxSize: 500000,
      }
   }

   if (isProd) {
      config.minimizer = [
         new OptimizeCssAssetWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }

   return config
}

const cssLoaders = extra => {
   const loaders = [
      {
         loader: MiniCssExtractPlugin.loader,
         options: {
            publicPath: (resourcePath, context) => {
               return path.relative(path.dirname(resourcePath), context) + '/';
            },
         }
      },
      'css-loader'
   ]

   if (extra) {
      loaders.push(extra)
   }

   return loaders
}

const babelOptions = preset => {
   const opts = {
      presets: [
         '@babel/preset-env',
      ],
      plugins: [
         '@babel/plugin-proposal-class-properties'
      ]
   }

   if (preset) {
      opts.presets.push(preset)
   }

   return opts
}

const jsLoaders = () => {
   const loaders = [{
      loader: 'babel-loader',
      options: babelOptions()
   }]

   // if (isDev) { 
   //   loaders.push('eslint-loader') // esLint debug on dev
   // }

   return loaders
}

const plugins = () => {
   const base = [
      new HTMLWebpackPlgin({
         template: './index.html',
         filename: 'index.html',
         cache: false,
         minify: isDev ? {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            preserveLineBreaks: true,
            removeComments: true,
            useShortDoctype: false
         } : {
               removeComments: true,
               collapseWhitespace: true,
            }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, 'src/assets'),
               to: path.resolve(__dirname, 'dist'),
               noErrorOnMissing: true
            },
            {
               from: path.resolve(__dirname, 'src/img/static'),
               to: path.resolve(__dirname, 'dist/img'),
               noErrorOnMissing: true,
               globOptions: {
                  dot: true,
                  gitignore: true,
                  ignore: [
                     '**/*.gitkeep',
                  ]
               }
            },
         ]
      }),
      new MiniCssExtractPlugin({
         filename: `./css/${filename('css')}`
      }),
      new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
         'window.jQuery': 'jquery',
      }),

   ].concat(htmlPlugins)

   // if(isProd) {
   // 	base.push(new BundleAnalyzerPlugin()) // analyzer app size
   // }

   return base
}

module.exports = {
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: {
      // swiper: ['@/js/libs/swiper.lib.js'], // enqueue custom scripts
      main: [
         '@babel/polyfill',
         '@/js/libs/velocity.lib.js',
         '@/js/main.js'
      ],
   },
   output: {
      filename: `./js/${filename('js')}`,
      path: path.resolve(__dirname, 'dist'),
      publicPath: ''
   },
   resolve: {
      extensions: ['.js'],
      alias: {
         '@html': path.resolve(__dirname, 'src/html'),
         '@style-models': path.resolve(__dirname, 'src/scss/style-models'),
         '@': path.resolve(__dirname, 'src'),
         '@csslib': path.resolve(__dirname, 'src/css-libs'),
         '@models': path.resolve(__dirname, 'src/js/models'),
      }
   },
   devServer: {
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, 'dist'),
      open: true,
      compress: true,
      port: 3000,
      hot: true,
   },
   optimization: optimization(),
   devtool: isDev ? 'source-map' : false,
   plugins: plugins(),
   // target: 'web', // only for develomplent(enable npm run start)
   module: {
      rules: [
         {
            test: /\.html$/i,
            include: [
               path.resolve(__dirname, 'src/html/includes'),
               path.resolve(__dirname, 'src/html/parts')
            ],
            use: [{
               loader: 'raw-loader',
               options: {
                  esModule: false,
               },
            }],
         },
         {
            test: /\.css$/,
            use: cssLoaders()
         },
         {
            test: /\.s[ac]ss$/,
            use: cssLoaders('sass-loader')
         },
         {
            test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
            use: [{
               loader: 'file-loader',
               options: {
                  name: `./img/${filename('[ext]')}`
               }
            }],
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: jsLoaders()
         },
         {
            test: /\.lib\.js$/,
            loader: 'imports-loader',
            exclude: /node_modules/,
            options: {
               wrapper: {
                  thisArg: 'window',
                  args: {
                     module: true,
                     exports: true,
                     define: true,
                  }
               },
            },
         },
         {
            test: /\.(?:|woff|ttf|otf|eot|woff2|svg)$/,
            use: [{
               loader: 'file-loader',
               options: {
                  name: `./fonts/[name]/${filename('[ext]')}`
               }
            }],
         }
      ]
   }
}