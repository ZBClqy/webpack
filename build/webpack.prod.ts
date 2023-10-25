import { Configuration } from 'webpack';
//引入webpack
import { merge } from 'webpack-merge';
//引入merge合并webpack配置
import baseConfig from './webpack.base';
//引入我们的公共配置
import CopyPlugin from 'copy-webpack-plugin';
//引入我们的这个插件复制我们public地下的一些其他静态文件
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
//可以将css单独抽离成文件的插件
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
//对我们的css文件进行压缩
import TerserPlugin from 'terser-webpack-plugin';
//使用这个插件对我们的js代码进行压缩
import CompressionPlugin from 'compression-webpack-plugin';
//使用这个插件对我们较大的css或者js进行gz压缩
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
//这个插件可以帮助我们打包时移除未使用的css
const globAll = require('glob-all');
//用globAll可以帮助上面的插件指定要检测那些文件
const path = require('path');
//获取node path

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
  //生产模式
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          filter: source => !source.includes('index.html')
        }
      ]
    }),
    //配置copy静态文件插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    //配置单独抽离css插件
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
    }),
    //配置gz压缩插件
    new PurgeCSSPlugin({
      paths: globAll.sync(
        [`${path.join(__dirname, '../src')}/**/*`, path.join(__dirname, '../public/index.html')],
        {
          nodir: true
        }
      )
    })
    //配置检测未使用的css插件
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      //配置css压缩
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log']
          }
        }
      })
      //配置js压缩
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          minChunks: 1,
          chunks: 'initial',
          minSize: 0,
          priority: 1
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'initial',
          minSize: 0
        }
      }
    }
    //配置对引用大的js和依赖分包chunk
  }
});

export default prodConfig;
