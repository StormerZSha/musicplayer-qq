const path=require('path');
const VueLoaderPlugin=require('vue-loader/lib/plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin');
moduel.export={
    entry:'./src/index.js',
    ouput:{
        path:path.resolve(__dirname,"dist"),
        filename:"bunndle.js"
    },
    plugin:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template:'index,html'
        })
    ]
}