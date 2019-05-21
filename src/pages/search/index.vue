<!-- 搜索 -->
<template>
    <div class="search">
        <!-- 搜索头部 -->
        <div class="head">
            <div>
                <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="" />
                <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @comfirm="searchWords" placeholder="商品搜索">
                <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
            </div>
            <div @click="cancel">取消</div>
        </div>
        <!-- 搜索提示 -->
        <div class="searchtips" v-if="words">
            <div @click="searchWords" v-if="tipsData.length!=0" :data-value="item.name" v-for="(item,index) in tipsData" :key="index">
                {{ item.name }}
            </div>
            <div v-if="tipsData.length==0" class="nogoods">
                数据库暂无此类商品...
            </div>
        </div>
        <!-- 历史记录 -->
        <div class="history" v-if="historyData.length!=0">
            <div class="t">
                <div>历史记录</div>
                <div @click="clearHistory"></div>
            </div>
            <div class="cont">
                <div @click="searchWords" :data-value="item.keyword" v-for="(item, index) in historyData" :key="index">
                    {{ item.keyword }}
                </div>
            </div>
        </div>
        <!-- 商品详细页 -->
        <div v-if="listData.length!=0" class="goodsList">
            <div class="sortnav">
                <div @click="changeTab(0)" :class="[0 == nowIndex ? 'active' : '']">综合</div>
                <div @click="changeTab(1)" class="price" :class="[1 == nowIndex ? 'active': '', order == 'desc' ? 'desc': 'asc']">价格</div>
                <div @click="changeTab(2)" :class="[2 == nowIndex ? 'active': '']">分类</div>
            </div>
            <div class="sortlist">
                <div @click="goodsDetail(item.id)" v-for="(item, index) in listData" :key="index" :class="[(listData.length)%2==0?'active':'none']" class="item">
                    <img :src="item.list_pic_url" alt="">
                    <p class="name">{{ item.name }}</p>
                    <p class="price">¥{{ item.retail_price }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { post, get } from "../../utils"
export default {
    created() {},
    mounted() {
        // 从本地缓存中同步获取数据
        this.openid = wx.getStorageSync("openid") || "";
        this.getHotData();
    },
    data() {
        return {
            nowIndex: 0,
            words: '',
            historyData: [],
            hotData: [],
            tipsData: [],
            listData: [],
            openid: '',
            order: '',
            isHot: '',
            isNew: ''
        }
    },
    components: {},
    methods: {
        // 跳转到商品页
        goodsDetail(id) {
            wx.navigateTo({
                url: "/pages/goods/main?id=" + id
            })
        },
        // 返回上一级
        cancel() {
            wx.navigateBack({
                delta: 1 //返回的页面数，如果delta大于现有页数，则返回首页
            })
        },
        // 清除input数据
        clearInput() {
            this.words = "";
            this.listData = [];
            this.tipsData = [];
        },
        // input添加焦点
        inputFocus() {
            // 商品清空
            this.listData = [];
            // 展示搜索提示信息
            this.tipsearch();
        },
        // 搜索提示
        async tipsearch(e) {
            const data = await get("/search/helperaction", {
                keyword: this.words
            });
            this.tipsData = data.keyword;
        },
        async getlistData() {
            // 获取商品列表
            const data = await get("/search/helperaction", {
                keyword: this.words,
                order: this.order
            });
            this.listData = data.keyword;
            this.tipsData = [];
        },
        changeTab(index) {
            this.nowIndex =  index;
            if (index == 1) {
                this.order = this.order = "asc" ? "desc" : "asc";
            } else {
                this.order = "";
            }
            this.getlistData();
        },
        async clearHistory() {
            const data = await post("/search/clearhistoryAction", {
                openId: this.openid
            });
            console.log(data);
            if (data) {
                this.historyData = [];
            }
        },
        // 搜索词
        async searchWords(e) {
            var value = e.currentTarget.dataset.value;
            this.words = value || this.words;
            const data = await post("/search/addhistoryaction", {
                openId: this.openid,
                keyword: value || this.words 
            });
            console.log(data)
            // 获取历史数据
            this.getHotData();
            // 获取商品列表
            this.getlistData();
        },
        // 获取历史数据
        async getHotData(first) {
            const data = await get("/search/indexaction?openId=" + this.openid);
            this.hotData = data.hotKeywordList;
            this.historyData = data.historyData;
        },
        async topicDetail(id) {
            wx.navigateTo({
                url: "/pages/topicdetail/main?id=" + id
            })
        }
    },
    computed: {}
}
</script>
<style lang='scss' scoped>
@import "./style";
</style>