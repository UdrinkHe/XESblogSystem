import { mapGetters } from 'vuex';

export default {
    //在vue实例中获取用户信息(对象,uid是数据库auth表id)： this.$userInfo.user.call(this)
    ...mapGetters('auth', ['user'])
    
}