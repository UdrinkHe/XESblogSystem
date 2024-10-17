<template>
    <div class="myLeftNav">
        <slot name="navContent">
            <template v-for="(item,index) in navData">
                <div :key="item.name"  :class="{'isChoose' : listStatus[index]}" @click="routerPushTo(index,item.path)">
                    {{item.name}}
                </div>
            </template>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'myLeftNav',
    props:['navData'],
    //navData格式：{name: 'xxx', path: '/xxx'}，
    data() {
        return {
            //列表状态变更
            listStatus: null,//需要初始化
        }
    },
    methods: {
        routerPushTo(index,path) {
            console.log('开始跳转')
            console.log(this.listStatus[index])
            if(this.listStatus[index]!==true)//没被选中才操作
            {
                console.log('改变路由')
                for(let i = 0; i < this.listStatus.length; i++)
                {
                    if(this.listStatus[i] === true) this.listStatus.splice(i,1,false)
                }
                this.listStatus.splice(index,1,true)
                this.$router.push(path)
            } 
        }
    },
    created(){
        this.listStatus = new Array(this.navData.length).fill(false)
        //判断当前路由看看哪个被选中
        this.navData.forEach((item,index)=>{
            if(this.$route.path === item.path) this.listStatus[index] = true
        })
    }
}
</script>
<style lang="scss" scoped>
.myLeftNav {
    width: 100%;
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
