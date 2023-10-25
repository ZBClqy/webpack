import { merge } from 'webpack-merge';
//导入merge合并webpack配置
import { Configuration as WebpackConfiguration } from 'webpack';
//导入webpack
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
//导入webpack-dev-server用于本地开启服务运行前端代码
import baseConfig from './webpack.base';
//导入webpack公共配置
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
//该插件可以避免我们更新代码保存时直接整个页面刷新
const path = require('path');
//导入node path

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
//因为是ts 所以我们声明一个接口来定义我们webpack变量的类型

const host = '127.0.0.1';
//启动服务的域名
const port = '8082';
//启动服务的端口号

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development',
  //配置模式
  devtool: 'eval-cheap-module-source-map',
  //配置我们的错误指定到我们的源代码
  plugins: [new ReactRefreshWebpackPlugin()],
  //配置我们的插件
  devServer: {
    host,
    port,
    open: true,
    compress: false,
    hot: true,
    historyApiFallback: true,
    setupExitSignals: true,
    static: {
      directory: path.join(__dirname, '../public')
    },
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
  //最好配置我们的本地临时服务器
});

export default devConfig;
