<!-- 首页 -->
<template>
    <div class="index">
        <!-- 搜索栏 -->
        <div class="search">
            <div @click="toMappage">{{ cityName }}</div>
            <div @click="toSearch">
                <input type="text" placeholder="搜索商品">
                <span class="icon"></span>
            </div>
        </div>
        <!-- 轮播 -->
        <div class="swiper">
            <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
                <block v-for="(item, index) in banner" :key="index">
                    <swiper-item class="swiper-item">
                        <image :src="item.image_url" class="slide-image" />>
                    </swiper-item>
                </block>
            </swiper>
        </div>
        <!-- 导航栏 -->
        <div class="channel">
            <div @click="categoryList(item.id)" v-for="(item, index) in channel" :key="index">
                <img :src="item.icon_url" alt="">
                <p>{{ item.name }}</p>
            </div>
        </div>
        <!-- 品牌制造商直供 -->
        <div class="brand">
            <div @click="tobrandList" class="head">品牌制造商直供</div>
            <div class="content">
                <div @click="branddetail(item.id)" v-for="(item, index) in brandList" :key="index">
                    <div>
                        <p>{{ item.name }}</p>
                        <p>{{ item.floor_price }}元起</p>
                    </div>
                    <img :src="item.new_pic_url" alt="">
                </div>
            </div>
        </div>
        <!-- 新品首发 -->
        <div class="newgoods">
            <div @click="goodsList('new')" class="newgoods-top">
                <div class="top">
                    <p>新品首发</p>
                    <p>查看全部</p>
                </div>
                <div class="list">
                    <ul>
                        <scroll-view class="scroll-view" :scroll-x="true">
                            <li @click="goodsDetail(item.id)" v-for="(item, index) in newGoods" :key="index">
                                <img :src="item.list_pic_url" alt="">
                                <p>{{ item.name }}</p>
                                <p>{{ item.goods_brief }}</p>
                                <p>￥{{ item.retail_price }}</p>
                            </li>
                        </scroll-view>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 人气推荐 -->
        <div class="newgoods hotgoods">
            <div @click="goodsList('hot')" class="newgoods-top">
                <div class="top">
                    <p>人气推荐 <span>好物精选</span></p>
                    <p>查看全部</p>
                </div>
            </div>
            <div class="list">
                <ul>
                    <scroll-view class="scroll-view" :scroll-x="true">
                        <li @click="goodsDetail(item.id)" v-for="(item, index) in hotGoods" :key="index">
                            <img :src="item.list_pic_url" alt="">
                            <p>{{ item.name }}</p>
                            <p>{{ item.goods_brief }}</p>
                            <p>￥{{ item.retail_price }}</p>
                        </li>
                    </scroll-view>
                </ul>
            </div>
        </div>
        <!-- 专题精选 -->
        <div class="topicList">
            <div @click="toptopic" class="topicList-top">
                专题精选
                <span class="icon"></span>
            </div>
            <div class="list">
                <ul>
                    <scroll-view class="scroll-view" :scroll-x="true">
                        <li @click="topicdetail(item.id)" v-for="(item, index) in topicList" :key="index">
                            <img :src="item.item_pic_url" alt="">
                            <div class="btom">
                                <div>
                                    <p>{{ item.title }}</p>
                                    <p>{{ item.subtitle }}</p>
                                </div>
                                <div>
                                    {{ item.price_info }}元起
                                </div>
                            </div>
                        </li>
                    </scroll-view>
                </ul>
            </div>
        </div>
        <!-- 居家好物 -->
        <div class="newcategory">
            <div class="list" v-for="(item, index) in newCategoryList" :key="index">
                <div class="head">{{ item.name }}好物</div>
                <div class="sublist">
                    <div @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in item.goodsList" :key="subindex">
                        <img :src="subitem.list_pic_url" alt="">
                        <p>{{ subitem.name }}</p>
                        <p>￥{{ suitem.retail_price }}</p>
                    </div>
                    <div @click="categoryList(item.id)">
                        <div class="last">
                            <p>{{ item.name }}</p>
                            <span class="icon"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import amapFile from "../../utils/amap-wx"
import { get } from "../../utils"
export default {
    onShow() {},
    computed: {
        ...mapState(["cityName"])
    },
    mounted() {
        this.getCityName();
        this.getData();
    },
    data() {
        return {
            banner: [],
            channel: [],
            brandList: [],
            newGoods: [],
            hotGoods: [],
            topicList: [],
            newCategoryList: []
        }
    },
    components: {},
    methods: {
        ...mapMutations(["update"]),
        // 跳转到定为所在城市界面
        toMappage() {
            var _this = this;
            // 可以通过 wx.getSetting 先查询一下用户是否授权了“scope.record” 这个 scope
            wx.getSetting({
                success(res) {
                    // 
                    if (!res.authSetting["scope.userLo"]) {
                        // 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
                        wx.openSetting({
                            success: res => {
                                _this.getCityName();
                            }
                        });
                    } else {
                        wx.navigateTo({
                            url: "/pages/mappage/main"
                        })
                    }
                }
            })
        },
        // 获取城市列表
        gitCityName() {
            var _this = this;
            // 调用高德地图API
            var myAmapFun = new amapFile.AMapWX({
                key: "e545e7f79a643f23aef187add14e4548"
            });
            myAmapFun.getRegeo({
                success: function (data) {
                    // 成功回调
                    console.log(data);
                    _this.update({ cityName: data[0].regeocodeData.formatted_address });
                },
                fail: function (info) {
                    // 失败回调
                    console.log(info);
                    // 如果用户拒绝授权
                    // 默认北京
                    _this.cityName = "北京市",
                    _this.updata({ cityName: "北京市" });
                }
            })
        },
        // 跳转到搜索界面
        toSearch() {
            wx.navigateTo({
                url: "/pages/search/main"
            })
        },
        // 异步获取首页数据
        async getData() {
            const data = await get("/index/index");
            this.banner = data.banner;
            this.channel = data.channel;
            this.brandList = data.brandList;
            this.newGoods = this.newGoods;
            this.hotGoods = this.hotGoods;
            this.topicList = this.topicList;
            this.newCategoryList = this.newCategoryList;
        },
        // 跳转到商品详细页面
        goodsDetail(id) {
            wx.navigateTo({
                url: "/pages/goods/main?id" + id
            })
        },
        // 跳转到分类列表界面
        categoryList() {
            wx.navigateTo({
                url: "/pages/categorylist/main?id=" + id 
            })
        },
        // 跳转到新品首发和人气推荐商品详细界面
        goodsList(info){
            if (info == "hot") {
                wx.navigateTo({
                    url: "/pages/newgoods/main?isHot=" + 1
                })
            } else {
                wx.navigateTo({
                    url: "/pages/newgoods/main?isNew=" + 1
                })
            }
        },
        // 跳转到专题精选详细
        topicdetail(id) {
            wx.navigateTo({
                url: "/pages/topicdetail/main?id=" + id
            })
        },
        // 跳转到专题精选
        totopic() {
            wx.navigateTo({
                url: "/pages/topic/main"
            })
        },
        // 
        tobrandList() {
            wx.navigateTo({
                url: "/pages/brandlist/main"
            })
        },
        // 
        branddetail(id) {
            wx.navigateTo({
                url: "/pages/branddetail/main?id=" + id
            })
        }
    },
    created() {}
}
</script>
<style lang='scss' scoped>
@import "./style.scss";
</style>