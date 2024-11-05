<template>
    <div id="viewPage" class="flex-display">
        <div class="viewPageSideBar">
            <div class="contentNav p10"><!--内容导航-->
                <h3>内容导航</h3>
                <div class="p10">
                    <template v-for="item in navList">
                        <div class="cnav-item" :style="`text-indent:${item.textSpace - 1}em`"
                            @click="jumpToTag(item.id)" :key="item.id">{{ item.text }}</div>
                    </template>
                </div>
            </div>
        </div>
        <div class="postShow" ref="mdFather">
            <div class="postHeader">
                <h1 class="postTitle">{{ title }}</h1> <!-- 添加标题 -->
                <div class="postMeta">
                    <span :title="`创建时间${formatDate(createTime)}`"><i class="el-icon-time"></i> 更新时间：{{
                        formatDate(updateTime)
                        }}</span> <!-- 文章更新时间 -->
                    <span>
                        <i v-if="isCollection" class="el-icon-star-on" @click="collection_click(false)"
                            style="cursor: pointer;"></i>
                        <i v-else class="el-icon-star-off" @click="collection_click(true)" style="cursor: pointer;"></i>
                        收藏：{{ collectionCount }}
                    </span> <!-- 收藏量 -->
                    <span><i v-if="viewCount" class="el-icon-view"></i> 阅读：{{ viewCount }}</span> <!-- 阅读量 -->
                    <span><i v-if="likeCount" class="el-icon-thumb"></i> 点赞：{{ likeCount }}</span> <!-- 点赞量 -->
                </div>
                <div class="postTags">
                    <el-tag v-for="tag in tags" :key="tag" class="tag" type="primary">{{ tag }}</el-tag>
                    <!-- 使用 Element UI 标签 -->
                </div>
            </div>
            <mavonEditor v-model="content" :toolbarsFlag="false" :subfield="false" :defaultOpen="'preview'"
                @change="onEditorReady" />
        </div>
        <div class="viewPageSideBar">
        </div>
        <div class="abusolute-center collectionEditor p20" v-if="collectionEditorShow">
            <div>
                <h1>收藏文章</h1>
            </div>
            <div class="flex-display-center mt10 location-input">
                <span>收藏位置</span>
                <el-input v-model="folderNameStr" placeholder="根文件夹/.../目标文件夹"></el-input>
            </div>
            <div class="flex-display-center mt10">
                <el-button type="primary" @click="handleCollection">确定</el-button>
                <el-button type="danger" @click="handleCancelCollection">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import DateCounter from '@/js/date/myDateCount'
export default {
    name: 'viewPage',
    components: {

    },
    created() {
        this.$axios.post('/api/user/post/read', { id: this.articleId, option: 'getOne' }).then(res => {
            if (res.status === 200) {
                this.content = res.data.post.content;
                this.title = res.data.post.title; // 获取标题
                this.createTime = res.data.post.createdAt; // 获取创建时间
                this.updateTime = res.data.post.updatedAt; // 获取更新时间
                this.collectionCount = res.data.post.collection; // 获取收藏量
                this.viewCount = res.data.post.viewCount; // 获取阅读量
                this.likeCount = res.data.post.appraise; // 获取点赞量
                this.tags = res.data.post.tag; // 获取文章标签
                //判断用户是否收藏了该文章
                this.$axios.post('/api/user/postCollection/post/readOneForAuth', { authId: this.$userInfo.user.call(this).uid, postId: this.articleId }).then(res => {
                    if (res.status === 200) {
                        this.isCollection = true
                        this.collectionId = res.data.id;
                    }
                    else if (res.status === 201) {
                        this.isCollection = false;
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
        });

    },
    data() {
        return {
            articleId: this.$route.query.articleId,
            content: '',
            title: '', // 新增标题
            updateTime: '', // 新增更新时间
            collectionCount: 0, // 新增收藏量
            viewCount: 0, // 新增阅读量
            likeCount: 0, // 新增点赞量
            tags: [], // 新增文章标签
            navList: [],//导航栏
            isCollection: false, //是否收藏
            collectionId: null, //收藏记录id，开始时获取
            collectionEditorShow: false,//收藏编辑器是否显示
            folderNameStr: '',//收藏位置
        }
    },
    methods: {
        formatDate(date) {
            return DateCounter.formatDate(date);
        },
        jumpToTag(idName) {
            document.getElementById(idName).scrollIntoView({
                behavior: 'smooth'
            });
        },
        onEditorReady() {
            console.log('ready')
            this.$nextTick(() => {
                const TextMain = this.$refs.mdFather.querySelector('.v-note-read-content');

                if (TextMain) { // 确保 TextMain 存在
                    const childrenArray = Array.from(TextMain.children); // 将 HTMLCollection 转换为数组


                    for (let i = 0; i < childrenArray.length; i++) {
                        const item = childrenArray[i];
                        const HArray = ['H1', 'H2', 'H3', 'H4'];

                        if (HArray.includes(item.nodeName)) {
                            console.log('包含其中');
                            if (item.children.length > 0) { // 确保有子元素
                                console.log(item.children[0]);
                                console.log(item.innerText);
                                this.navList.push({
                                    text: item.innerText,
                                    id: item.children[0].id,
                                    textSpace: item.nodeName.split('')[1]
                                });
                            }
                        }
                    }
                } else {
                    console.log('TextMain 不存在');
                }
            });
        },
        collection_click(collectionStatus) {//收藏点击事件
            if (collectionStatus) {//收藏
                //打开收藏编辑器
                this.$domStatus.setBgBlack.call(this, true)
                this.collectionEditorShow = true;
                this.folderNameStr = '默认';
            } else {//取消收藏
                this.$axios.post('/api/user/postCollection/post/delete', {
                    id: this.collectionId
                }).then(res=>{
                    if(res.status === 200){
                        this.isCollection = false;
                        this.$message.success('取消收藏成功');
                    }
                }).catch(()=>{
                    this.$message.error('取消收藏失败');
                })
            }
        },
        handleCollection() {//确认收藏
            this.$axios.post('/api/user/postCollection/post/create', {
                authId: this.$userInfo.user.call(this).uid,
                postId: this.articleId,
                folderNameStr: this.folderNameStr
            }).then(res=>{
                if(res.status === 200){
                    this.isCollection = true;
                    this.collectionId = res.data.resultId;
                    this.$message.success('收藏成功');
                    this.$domStatus.setBgBlack.call(this, false)
                    this.collectionEditorShow = false;
                }
                else if(res.status === 201){
                    this.$message.error('没有该文件夹');
                }
            }).catch(() => {
                this.$message.error('收藏失败');
                this.$domStatus.setBgBlack.call(this, false)
                this.collectionEditorShow = false;
            })
        },
        handleCancelCollection() {//关闭收藏
            this.$domStatus.setBgBlack.call(this, false)
            this.collectionEditorShow = false;
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss">
#viewPage {
    width: 80%;
    max-width: 1400px;
    min-width: 1000px;
    height: fit-content;
    margin: 0 auto;
    gap: 10px;
    position: relative;
}

.viewPageSideBar {
    width: 200px;
    height: transparent;
    background: transparent;
}

.contentNav {
    background: #ffffff;
    height: 500px;
    overflow-y: scroll;
    position: sticky;
    top: 10px;
}

.cnav-item {
    overflow: hidden;
    /* 隐藏超出部分 */
    white-space: nowrap;
    /* 不换行 */
    text-overflow: ellipsis;
}

.postShow {
    flex: 1;
    margin: 0 auto;
    background: linear-gradient(to bottom, #f9f9f9, #eaeaea);
    /* 添加渐变背景 */
    border-radius: 8px;
    /* 圆角 */
    padding: 20px;
    /* 内边距 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
}

.postTitle {
    font-size: 2em;
    /* 设置标题字号 */
    margin-bottom: 10px;
    /* 添加底部间距 */
}

.postMeta {
    margin-bottom: 10px;
    /* 添加底部间距 */
    display: flex;
    gap: 15px;
    /* 添加间距 */
    align-items: center;
    /* 垂直居中 */
    background: #f0f4f8;
    /* 添加背景色 */
    padding: 10px;
    /* 内边距 */
    border-radius: 5px;
    /* 圆角 */
}

.postTags {
    margin-bottom: 20px;
    /* 添加底部间距 */
}

.postMeta span {
    display: flex;
    align-items: center;
    /* 垂直居中 */
}

.postMeta i {
    margin-right: 5px;
    /* 图标与文本之间的间距 */
}

.tag {
    margin-right: 5px;
    /* 标签之间的间距 */
    font-size: 14px;
    /* 标签字体大小 */
    border-radius: 12px;
    /* 标签圆角 */
}

.el-tag {
    background-color: #e0f7fa;
    /* 标签背景色 */
    color: #00796b;
    /* 标签字体颜色 */
    border: 1px solid #00796b;
    /* 标签边框颜色 */
}

.el-tag:hover {
    background-color: #b2ebf2;
    /* 标签悬停背景色 */
}
.collectionEditor{
    width: 400px;
    height: 200px;
    z-index: 10001;
    background: #ffffff;
    .location-input{
        gap: 10px;
        height: 50px;
        line-height: 50px;
        span{
            width: 80px;
        }
        .el-input{
            flex: 1;
        }
    }
}
</style>
