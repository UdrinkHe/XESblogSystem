<template>
<div id="topNavigation"><!--主页顶部导航栏-->
    <div>
        <div class="leftFucBlock">
            <div>文章</div>
            <div>问答</div>
            <div>话题广场</div>
            <div></div>
        </div>
        <div class="searchBlock">
            <el-input v-model="searchValue" placeholder="搜点什么吧.." @input="changingSearchForResult()"></el-input>
            <el-button>搜索</el-button>
        </div>
        <div class="rightFucBlock">
            <div class="userProfileBlock">
                <div class="userProfile">
                    <img :src="profileUrl">
                </div>
                <div class="userFucList">
                    <div class="baseInfo">
                       <div>{{this.username}}</div>
                       <hr/>
                       <div class="baseSinple flex-display">
                            <div>
                                <div>粉丝</div>
                                <div>100000</div>
                            </div>
                            <div>
                                <div>关注</div>
                                <div>100</div>
                            </div>
                            <div>
                                <div>获赞</div>
                                <div>100</div>
                            </div>
                       </div>
                    </div>

                    <div class="mainFuc">
                        <div @click="routerPushTo('/personalCenter/baseInfo')">
                            <i class="el-icon-user"></i>
                            个人信息
                        </div>
                        <div>
                            <i class="el-icon-setting"></i>
                            设置
                        </div>
                        <div @click="logoutOpen">
                            <i class="el-icon-switch-button"></i>
                            退出登录
                        </div>
                    </div>
                </div>
            </div>
            <div @click="routerPushTo('/messageCenter')">
                消息
                <div class="fucList">
                    <div></div>
                    <div >评论和@</div>
                    <div >新增粉丝</div>
                    <div >赞和收藏</div>
                    <div >私信</div>
                </div>
            </div>
            <div>历史</div>
            <div @click="routerPushTo('/myToolCenter')">
                工具列表
                <div class="fucList">
                    <div></div>
                    <div @click.stop="routerPushTo('/scheduleBlock/mySchedule')">日程表</div>
                </div>
            </div>
            <div @click="routerPushTo('/editorBlock/creationManagement')">创作中心</div>
            <div>
                <el-button @click="routerPushTo('/editorPage')">
                    <i class="el-icon-edit"></i>
                    发布
                </el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
name: 'topNavigation',
components: {
},
data() {
    return {
        searchValue : '',
        messageCenter : ''
    }
},
computed: {
    ...mapGetters('auth',['profileUrl','username'])
},
methods:{
    routerPushTo(str) { //路由跳转
       if(this.$route.path !== str) 
       {
        if(str === '/editorPage')
        {
            let routeUrl = this.$router.resolve({
                path: str,
                query: {
                    articleId: 'new'
                }   
            })
            window.open(routeUrl.href, '_blank')
            return
        }
        this.$router.push(str)
       }
       
    },
    logoutOpen() {
        this.$confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            await this.$store.dispatch('auth/logout')
            this.$router.push('/auth')
        }).catch(() => {
            this.$message.info('已取消退出登录')
        })
    }
}
}
</script>

<style lan="sass" scoped>
#topNavigation {  /*最外层*/
    background: #fffafa;
    width: 100%;
    min-width: 1020px;
    >div:nth-of-type(1) {
        display: flex;
        min-width: 1000px;
        padding: 10px;
        justify-content: space-between;
        .rightFucBlock , .leftFucBlock {/*左右功能模块容器*/
            display: flex;
            justify-content: space-between;
            >div {/*主要功能模块分区*/
                margin-left: 20px;
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                position: relative;
                >button {
                    border-radius: 10px;
                    color: #ffffff;
                    background-color: #4169e1;
                }
                >.fucList {/*功能模块的具体功能列表*/
                    border-radius: 10px;
                    padding-top: 5px;
                    padding-bottom: 10px;
                    position: absolute;
                    background: #ffffff;
                    width: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    display: none;
                    z-index: 2000;
                    box-shadow: 0px 0px 5px #DCDFE6;
                    >div:hover:not(:nth-of-type(1)) {/*子项被选中 */
                        background-color: #F2F6FC;
                    }
                    >div:nth-of-type(1)
                    {
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-bottom: 10px solid cyan;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        top: -10px;
                        left: 45px;
                        z-index: 3;
                    }
                }
                &:hover > .fucList{
                    display: block;
                }
            }
            >div:nth-of-type(1).userProfileBlock{
                position: relative;
                margin-left: 0;
                background-color: transparent;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                >.userProfile{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    position: absolute;
                    >img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    }
                }      
                >.userFucList{
                    position: absolute;
                    top: 60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 250px;
                    background-color: #ffffff;
                    box-shadow: 0px 0px 5px #DCDFE6;
                    border-radius: 10px;
                    text-align: center;
                    display: none;
                    z-index: 2000;
                    >.baseInfo{
                       font-size: 2em;
                       font-weight: 600;
                       >.baseSinple >div{
                        width: 33.3%;
                        }
                    }
                    >.mainFuc{
                        padding: 10px;
                        text-align: left;
                       >div{
                        cursor: pointer;
                        &:hover{
                            background-color: #F2F6FC;
                        }
                       }
                    }
                }
                &:hover > .userProfile{
                    width: 60px;
                    height: 60px;
                    left : 50%;
                    transform: translateX(-50%);
                    top : 10px;
                    z-index: 2001;
                }
                &:hover > .userFucList{
                    display: block;
                }
            }
        }
        >.searchBlock {
            width: 400px;
            display: flex;
            >button {
                height: 40px;
            }
        }
    }
}
</style>