import { Configuration } from 'webpack';
//引入webpack
import HtmlWebpackPlugin from 'html-webpack-plugin';
//引入html插件对html进行处理
import * as dotenv from 'dotenv';
//dotenv可以读取指定文件夹中的内容进行返回
import WebpackBar from 'webpackbar';
//打包时显示webpack当前进度的进度条
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
//可以将css单独抽离成文件的插件

const path = require('path');
//引入node的path
const webpack = require('webpack');
//引入webpack
const isDev = process.env.NODE_ENV === 'development';
//查看当前是否是开发模式

const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../env/.env.' + process.env.BASE_ENV)
});
//根据模式读取对应文件中的内容

const styleLoadersArray = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[path][name]__[local]--[hash:5]'
      }
    }
  },
  'postcss-loader'
];
//因为css的loder都需要上面的配置我们将其抽取出来处理

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'),
  //配置我们的入口文件
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    //配置我们js存放的位置
    path: path.join(__dirname, '../dist'),
    //配置出口目录
    clean: true,
    //配置每次打包清空文件
    publicPath: '/',
    //配置公共文件路径
    assetModuleFilename: 'images/[hash][ext][query]'
    //配置这里自定义输出文件名的方式是，将某些资源发送到指定目录
  },
  //配置我们的出口设置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader']
      },
      //ts与tsxloader配置
      {
        test: /\.css$/,
        use: styleLoadersArray
      },
      //cssloader配置
      {
        test: /\.less$/,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      //lessloader配置
      {
        test: /\.(scss|sass)$/,
        use: [...styleLoadersArray, 'sass-loader']
      },
      //sassloader配置
      {
        test: /\.styl$/,
        use: [...styleLoadersArray, 'stylus-loader']
      },
      //stylusloader配置
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]'
        }
      },
      //处理图片loader
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]'
        }
      },
      //处理文字loader
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]'
        }
      },
      //处理媒体文件loader
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  //配置省略扩展以及省略目录
  cache: {
    type: 'filesystem'
  },
  //配置缓存 这里以文件的方式缓存
  plugins: [
    new WebpackBar({
      color: '#85d',
      basic: false,
      profile: false
    }),
    //配置webpack进度条
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    //配置复制html文件
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
    //配置全局环境变量
  ]
};

export default baseConfig;
