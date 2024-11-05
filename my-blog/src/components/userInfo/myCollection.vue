<template>
    <div id="myCollection" class=" p20 flex-display ml20">
        <div class="collectionFolderList">
            <div class="flex-display-end bluePointer">
                <i class="el-icon-plus"></i>
                <span @click="oepnAddEditor">新建收藏夹</span>
            </div>
            <el-menu class="mt10">
                <template v-for="item in myFolderList">
                    <!--如果没有子文件夹，就显示一个el-menu-item-->
                    <el-menu-item v-if="!item.sonFolder" :index="item.id" :key="item.id"
                        @click.native="handleClick(item.id)">
                        <i class="el-icon-folder"></i>
                        <span>{{ item.name }}</span>
                    </el-menu-item>
                    <!--如果有子文件夹，就调用递归,并且给每个递归组件一个key-->
                    <folderRecursion v-else :fatherFolder="item" :key="item.id" />
                </template>
            </el-menu>
        </div>
        <div class="postInFolder p10">
            <div class="postInFolderHeader flex-display-between">
                <div class="postInFolderHeaderLeft">
                    <div class="font-title-3">{{ nowShowFolderName }}</div>
                    <div class="mt10 p10">
                        <span class="font-hint">简介</span>
                        <div class="mt10">{{ nowShowFolderDes }}</div>
                    </div>
                </div>
                <div class="postInFolderHeaderRight">
                    <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='取消'
                            icon="el-icon-warning"
                            @confirm="deleteOneFolder()"
                            title="确定要删除这条收藏夹吗？删除后，该收藏夹中的所有子文件夹和收藏都将被删除!"
                            >
                            <span class="bluePointer" slot="reference">删除收藏夹</span>
                    </el-popconfirm>
                    <span class="bluePointer ml10">批量移入</span>
                </div>
            </div>
            <div class="flex-display-between mt10">
                <div>
                    <span class="bluePointer isChoose">文章</span>
                    <span class="bluePointer ml10">帖子</span>
                    <span class="bluePointer ml10">问答</span>
                </div>
                <div class="flex-display-center">
                    <el-input v-model="searchValue"></el-input>
                    <el-button @click="page_refresh">搜索</el-button>
                </div>
            </div>
            <div class="postList p10 mt10" v-if="postList.length">
                <!--收藏夹文章展示位置-->
                <template v-for="item in postList">
                    <div class="flex-display-between postItem" :key="item.id">
                        <span @click="turnToPost(item.postId)">{{ item.title }}</span>
                        <span @click="handleStar(item.id)"><i class="el-icon-star-on"></i></span>
                    </div>
                </template>
            </div>
            <myPagination class="fit-content-centerBox mt10" :nowPage="nowPage" :pageSize="pageSize" :dataLength="total"
                @refresh="pageChange" />
        </div>
        <div class="collectionAddEditor p20" v-show="isShowAddEditor">
            <h1>新增文件夹</h1>
            <div class="mt10">
                <span>名称</span>
                <el-input v-model="addForm.name"></el-input>
            </div>
            <div class="mt10">
                <span>描述</span>
                <el-input v-model="addForm.description"></el-input>
            </div>
            <div class="flex-display-start mt10" style="height: 2em; line-height: 2em;gap: 10px;    ">
                <span>新增文件夹位置</span>
                <el-select v-model="addForm.hasFather" placeholder="请选择">
                    <el-option label="当前文件夹中" :value="true" ></el-option>
                    <el-option label="最外层文件夹" :value="false"></el-option>
                </el-select>
            </div>
            <div class="flex-display-center mt20">
                <el-button type="primary" @click="handleAddFolder">确定</el-button>
                <el-button type="danger" @click="handleCancelAddFolder">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import folderRecursion from '../normalComponents/folderRecursion.vue';
import myPagination from '../normalComponents/myPagination.vue';
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'myCollection',
    components: {
        folderRecursion,
        myPagination
    },
    methods: {
        ...mapMutations('post', ['setMyCollectionId']),
        handleClick(id) {
            this.setMyCollectionId(id);
        },
        oepnAddEditor() {
            this.$domStatus.setBgBlack.call(this, true);
            this.isShowAddEditor = true;
        },
        handleCancelAddFolder() {
            this.addForm = {
                name: '',
                description: '',
                hasFather: false
            };
            this.$domStatus.setBgBlack.call(this, false);
            this.isShowAddEditor = false;
        },
        handleAddFolder() {
            if(this.addForm.name === '默认'){
                this.$message.error('文件夹名称不能为默认');
                return;
            }
            this.$axios.post('/api/user/postCollection/create',{
                authId: this.$userInfo.user.call(this).uid,
                name: this.addForm.name,
                description: this.addForm.description,
                fatherId: this.addForm.hasFather ? this.myCollectionId: null
            }).then(res=>{
                if(res.status === 200){
                    this.$message.success('新建文件夹成功');
                    this.$domStatus.setBgBlack.call(this, false);
                    this.isShowAddEditor = false;
                    this.initFolderList();
                }
                else if(res.status === 201){
                    this.$message.error('文件夹已存在');
                }
            }).catch(()=>{
                this.$message.error('新建文件夹失败');
            });
        },
        turnToPost(id) {
            let routeUrl = this.$router.resolve({
                path: '/viewPage',
                query: {
                    articleId: id
                }
            })
            window.open(routeUrl.href, '_blank')
            return
        },
        handleStar(id) {
            this.$axios.post('/api/user/postCollection/post/delete',{id}).then(res=>{
                if(res.status === 200){
                    this.$message.success('取消收藏成功');
                    this.page_refresh();
                }
            }).catch(()=>{
                this.$message.error('取消收藏失败,刷新页面试试');
            });
        },
        initFolderList(){
            this.$axios.post('/api/user/postCollection/read', { authId: this.$userInfo.user.call(this).uid }).then(res => {
                this.myFolderList.splice(0, this.myFolderList.length, ...res.data);
            });
        },
        folder_refresh(id) {//搜索对应的文件夹名字和描述
            this.$axios.post('/api/user/postCollection/read', { folderId: id }).then(res => {
                this.nowShowFolderName = res.data.name;
                this.nowShowFolderDes = res.data.description;
            });
        },
        page_refresh() {
            //根据pageSize、nowPage和ype、searchValue获取文章,目前只有文章
            this.$axios.post('/api/user/postCollection/post/read', { folderId: this.myCollectionId, pageSize: this.pageSize, nowPage: this.nowPage, searchValue: this.searchValue }).then(res => {
                console.log(res.data)
                this.postList.splice(0, this.postList.length, ...res.data.result)
                this.total = res.data.count;
                this.nowPage = res.data.nowPage;
            }).catch(err => {
                console.log(err);
            });
        },
        //处理页面变化
        pageChange(type, newVal) {
            if (type === 'sizeChange') {
                this.pageSize = newVal;
            } else {
                this.nowPage = newVal;
            }
            this.page_refresh();
        },
        deleteOneFolder(){ //删除一个文件夹
            if(this.myCollectionId === this.defaultFolderId){
                this.$message.error('默认收藏夹不能删除');
                return;
            }
            this.$axios.post('/api/user/postCollection/delete', { id: this.myCollectionId,authId: this.$userInfo.user.call(this).uid }).then(res => {
                if(res.status === 200){
                    this.$message.success('删除收藏夹成功');
                    this.initFolderList();
                    this.setMyCollectionId(this.defaultFolderId);
                }
            }).catch(()=>{
                this.$message.error('删除收藏夹失败');
            });
        }
    },
    computed: {
        ...mapGetters('post', ['myCollectionId']),
        nowShowFolderId() {
            return this.myCollectionId;
        }
    },
    watch: {
        nowShowFolderId(newVal) {
            console.log(`我要搜索${newVal}文件夹中的文章`);
            //搜索文件夹的名字和描述
            this.folder_refresh(newVal);
            //根据id获取文章标题id和标题等信息
            this.page_refresh();
        },
    },
    data() {
        return {
            myFolderList: [],
            postList: [
                
            ],
            defaultFolderId: null,//默认收藏夹id，删除操作之后读取默认收藏夹id
            nowPage: 1, //分页信息
            pageSize: 10,
            total: 0, //总条数
            isShowAddEditor: false, //是否显示添加表单
            addForm: {//添加表单
                name: '',
                description: '',
                hasFather: false
            },
            nowShowFolderName: '', //当前文件夹名称
            nowShowFolderDes: '', //当前文件夹描述
            searchValue: '',//搜索栏
        }
    },
    created() {
        //查找所有收藏夹
        this.$axios.post('/api/user/postCollection/read', { authId: this.$userInfo.user.call(this).uid }).then(res => {
            this.myFolderList.push(...res.data);
            for (let i = 0; i < this.myFolderList.length; i++) { //在根文件夹中找到默认，并且赋值给showCollectionId
                if (this.myFolderList[i].fatherId === null && this.myFolderList[i].name === '默认') {
                    this.nowShowFolderName = this.myFolderList[i].name;
                    this.nowShowFolderDes = this.myFolderList[i].description;
                    this.defaultFolderId = this.myFolderList[i].id;//保存默认收藏夹ids
                    this.setMyCollectionId(this.myFolderList[i].id);//vuex中设置当前文件夹id
                    break;
                }
            }
        }).catch((err)=>{
            console.log(err)
        });
    }
}
</script>
<style lang="scss" scoped>
#myCollection {
    position: relative;
    width: 100%;
    background: #f5f5f5;
    gap: 20px;
}

.collectionFolderList {
    width: 200px;
}

.isChoose {
    border-bottom: 2px solid #ff9800;
}

.postInFolder {
    flex: 1;
    background: #ffffff;
}

.postList {
    background: #f5f5f5;
}

.postItem {
    background: #ffffff;
    height: 3em;
    line-height: 3em;
    padding: 0 0.5em;

    i {
        cursor: pointer;
        font-size: 2em;
        vertical-align: middle;
        color: #ff9800;
    }
}

.collectionAddEditor {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background: #ffffff;
    z-index: 10001;
}
</style>
