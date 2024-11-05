<template>
<div id="scheduleBlock" class="flex-display"><!--日程表工具-->
        <div class="editorNav">
            <myLeftNav :navData="navData"></myLeftNav>
        </div>
        <div class="ml20">
            <router-view name="scheduleMain"></router-view>
        </div>
</div>
</template>

<script>
import myLeftNav from '../normalComponents/myLeftNav.vue'
export default {
name: 'scheduleBlock',
components: {
    myLeftNav
},
data() {
    return {
        navData: [
                {name: '我的日程', path: '/scheduleBlock/mySchedule'},
                {name: '待办事项', path: '/scheduleBlock/todoList'},
                {name: '统计数据', path: '/scheduleBlock/scheduleStatistic'}
            ]
    }
},
methods: {
},
created(){
}
}
</script>

<style lan="sass" scoped>
#scheduleBlock{
    position: relative;
    max-width: 1200px;
    width: 85%;    
    margin: 0 auto;
    .editorNav {
        position: sticky;
        top: 0;
        width: 200px;
        height: 150px;
        background-color:#ffffff;
        text-align: center;
    }
    >div:nth-of-type(2) {
        flex-grow: 1;
        background-color: #ffffff;
    }
}
</style>