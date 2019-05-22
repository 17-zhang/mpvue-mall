<!-- 个人中心 -->
<template>
  <div class="my">
      <div class="myinfo">
          <img @click="toLogin" :src="avator" alt="">
          <div @click="toLogin">
              <p>{{ userInfo.name }}</p>
              <p v-if="userInfo.nickname">点击登录</p>
              <p v-else>微信用户</p>
          </div>
      </div>
      <div class="iconlist">
          <div @click="goTo(item.url)" v-for="(item,index) in listData" :key="index">
              <span class="iconfont" :class="item.icon"></span>
              <span>{{ item.title }}</span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        avator: "http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png",

    };
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {
      toLogin() {
          if(!this.userInfo.avatorUrl) {
              wx.navigateTo({
                  url: "/pages/login/main"
              })
          }
      },
      goTo(url) {
          if(!this.userInfo.avatorUrl) {
              wx.navigateTo({
                  url: "/pages/login/main"
              })
          }
      }
  },
  computed: {}
}
</script>
<style lang='scss' scoped>
</style>