<template>
  <div id = "app">
      <div class="bgContainer"></div>
      <topNavigation v-if="showNavigation"></topNavigation>
      <div class="mainContainer">
        <router-view v-if="hasUserInfo || toAuth"></router-view>
      </div>
  </div>
</template>

<script>
import topNavigation from '@/components/normalComponents/topNavigation.vue';
export default {
  name: 'App',
  components: {
    topNavigation
  },
  computed: {
    showNavigation() {
      return this.$route.path !== '/auth'
    },
    toAuth(){
      return this.$route.path === '/auth'
    },
    hasUserInfo(){
      return this.$store.getters['auth/user']
    }
  },
  methods:{
    async getUserInfo(){
      console.log('入口')
      console.log(this.$store.getters['auth/isAuthenticated'])
      console.log(this.$store.getters['auth/user'])
      if (this.$store.getters['auth/isAuthenticated'] && !this.$store.getters['auth/user']) {//有token但是没有user
        console.log('没有用户信息，我去获取一个')
        await this.$store.dispatch('auth/fetchUser');//获取用户信息
      }
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss">
.bgContainer {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: #e0ffff;
  z-index: -1;
}
.mainContainer {
  width: 100%;
  margin-top: 10px;
  min-width: 1000px;
}
</style>
