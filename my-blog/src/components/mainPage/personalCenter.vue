<template>
<div id = "personalCenter"><!--个人中心页面-->
    <div class="personalCenterNav">
        <myLeftNav :navData="navData"></myLeftNav>
    </div>
    <div class="personalCenterMain">
            <router-view></router-view>
     </div>
</div>
</template>

<script>
import myLeftNav from '../normalComponents/myLeftNav.vue'
export default {
name: 'personalCenter',
components: {
    myLeftNav
},
data() {
    return {
        navData: [
            {
                name: '基本信息',
                path: '/personalCenter/baseInfo'
            },
            {
                name: '账号绑定',
                path: '/personalCenter/accountBinding'
            }
        ]
    }
}
}
</script>

<style>
    #personalCenter {
        display: flex;
        position: relative;
        width: 85%;
        margin: 0 auto;
    }
    .personalCenterMain{
        flex: 1;
    }
    .personalCenterNav {
        position: sticky;
        top: 0;
        width: 200px;
        height: 150px;
        background-color:#ffffff;
        text-align: center;
        >div {
            font-size: 1.1em;
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            &:hover {
                background-color: #EBEEF5;
            }
        }
        >.isChoose {
                background-color: #EBEEF5;
        }
    }
</style>