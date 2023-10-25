import { Configuration } from 'webpack';
//引入webpack
import { merge } from 'webpack-merge';
//引入webpack merge
import prodConfig from './webpack.prod';
//引入我们生成的配置文件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
//该插件可以在打包时对我们的文件大小进行分析
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//改插件可以打包完对我们的js包大小做出图示
const smp = new SpeedMeasurePlugin();

const analyConfig: Configuration = smp.wrap(
  merge(prodConfig, {
    plugins: [new BundleAnalyzerPlugin()]
  })
);

export default analyConfig;
