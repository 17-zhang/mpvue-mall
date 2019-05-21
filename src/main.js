import Vue from 'vue'
import App from './App'

// 全局处理重复页面跳转详情初始化，和详情跳转详情返回的bug
import MyPlugin from './mixins'
Vue.use(MyPlugin);
// 引入store
import store from './store/index'
// 把store挂载到全局
Vue.prototype.$store = store;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
     // 这个字段走 app.json
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        "pages": [
            "^pages/index/main",
            "pages/search/main",
            "pages/goodsDetail/main"
        ],
        "window": {
            "backgroundTextStyle": "light",
            "navigationBarBackgroundColor": "#fff",
            "navigationBarTitleText": "张毅琦",
            "navigationBarTextStyle": "black"
        },
        "tabBar": {
            "backgroundColor": "#fafafa",
            "borderStyle": "white",
            "selectedColor": "#b4282d",
            "color": "#666",
            "list": [{
                "pagePath": "pages/index/main",
                "iconPath": "static/images/ic_menu_choice_nor.png"
            }]
        }
    }
}