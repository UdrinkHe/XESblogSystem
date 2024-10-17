<template>
<div id="scheduleBlock"><!--日程表工具-->
        <div>
            <div :class="{'isChoose' : whichIsChoose[0]}" @click="getListChoose(0,'/scheduleBlock/mySchedule')">我的日程</div>
            <div :class="{'isChoose' : whichIsChoose[1]}" @click="getListChoose(1,'/scheduleBlock/todoList')">待办事项</div>
            <div :class="{'isChoose' : whichIsChoose[2]}" @click="getListChoose(2,'/scheduleBlock/scheduleStatistic')">统计数据</div>
        </div>
        <div>
            <router-view name="scheduleMain"></router-view>
        </div>
</div>
</template>

<script>

export default {
name: 'scheduleBlock',
components: {
},
data() {
    return {
        whichIsChoose : [true,false,false],
        nowChoose : 0
    }
},
methods: {
    getListChoose(index,str) {
        if(index != this.nowChoose){
            this.whichIsChoose.splice(this.nowChoose,1,false)
            this.whichIsChoose.splice(index,1,true)
            this.nowChoose = index
            this.$router.push(str)
        }
    }
},
created(){
    //刷新网页的时候要根据子路由判断isChoose的初始值,不然会出现路由复选的bug
    switch(this.$route.path){
        case '/scheduleBlock/todoList' :
            this.whichIsChoose.splice(0,1)
            this.whichIsChoose.splice(1,0,true)
            this.nowChoose = 1
            break
        case '/scheduleBlock/scheduleStatistic' :
            this.whichIsChoose.splice(0,1)
            this.whichIsChoose.splice(2,0,true)
            this.nowChoose = 2
            break
    }
}
}
</script>

<style lan="sass" scoped>
#scheduleBlock{
    position: relative;
    display: flex;
    width: 85vw;
    padding-left: 15px;
    padding-right: 15px;
    min-width: 850px;
    max-width: 1200px;    
    margin: 0 auto;
    justify-content: space-between;
    >div:nth-of-type(1) {/*分栏 */
        width: 180px;
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
    >div:nth-of-type(2) {
        flex-grow: 1;
        margin-left: 30px;
        background-color: #ffffff;
    }
}
</style>