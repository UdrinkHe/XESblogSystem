<template>
    <div id="viewPage">
        <div class="postShow">
            <div class="postHeader">
                <h1 class="postTitle">{{ title }}</h1> <!-- 添加标题 -->
                <div class="postMeta">
                    <span :title="`创建时间${formatDate(createTime)}`"><i class="el-icon-time"></i> 更新时间：{{ formatDate(updateTime) }}</span> <!-- 文章更新时间 -->
                    <span><i class="el-icon-star-on"></i> 收藏：{{ collectionCount }}</span> <!-- 收藏量 -->
                    <span><i class="el-icon-view"></i> 阅读：{{ viewCount }}</span> <!-- 阅读量 -->
                    <span><i class="el-icon-thumb"></i> 点赞：{{ likeCount }}</span> <!-- 点赞量 -->
                </div>
                <div class="postTags">
                    <el-tag
                        v-for="tag in tags"
                        :key="tag"
                        class="tag"
                        type="primary"
                    >{{ tag }}</el-tag> <!-- 使用 Element UI 标签 -->
                </div>
            </div>
            <mavonEditor v-model="content" :toolbarsFlag="false" :subfield="false" :defaultOpen="'preview'"/>
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
                console.log(res.data);
                this.content = res.data.post.content;
                this.title = res.data.post.title; // 获取标题
                this.createTime = res.data.post.createdAt; // 获取创建时间
                this.updateTime = res.data.post.updatedAt; // 获取更新时间
                this.collectionCount = res.data.post.collection; // 获取收藏量
                this.viewCount = res.data.post.viewCount; // 获取阅读量
                this.likeCount = res.data.post.appraise; // 获取点赞量
                this.tags = res.data.post.tag; // 获取文章标签
            }
        }).catch(err => {
            console.log(err);
        });
    },
    data(){
        return {
            articleId: this.$route.query.articleId,
            content: '',
            title: '', // 新增标题
            updateTime: '', // 新增更新时间
            collectionCount: 0, // 新增收藏量
            viewCount: 0, // 新增阅读量
            likeCount: 0, // 新增点赞量
            tags: [] // 新增文章标签
        }
    },
    methods: {
        formatDate(date) {
            return DateCounter.formatDate(date)
        },
    }
}
</script>

<style lang="scss">
.postShow {
    width: 70vw;
    margin: 0 auto;
    min-width: 1000px;
    background: linear-gradient(to bottom, #f9f9f9, #eaeaea); /* 添加渐变背景 */
    border-radius: 8px; /* 圆角 */
    padding: 20px; /* 内边距 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
.postTitle {
    font-size: 2em; /* 设置标题字号 */
    margin-bottom: 10px; /* 添加底部间距 */
}
.postMeta {
    margin-bottom: 10px; /* 添加底部间距 */
    display: flex;
    gap: 15px; /* 添加间距 */
    align-items: center; /* 垂直居中 */
    background: #f0f4f8; /* 添加背景色 */
    padding: 10px; /* 内边距 */
    border-radius: 5px; /* 圆角 */
}
.postTags {
    margin-bottom: 20px; /* 添加底部间距 */
}
.postMeta span {
    display: flex;
    align-items: center; /* 垂直居中 */
}
.postMeta i {
    margin-right: 5px; /* 图标与文本之间的间距 */
}
.tag {
    margin-right: 5px; /* 标签之间的间距 */
    font-size: 14px; /* 标签字体大小 */
    border-radius: 12px; /* 标签圆角 */
}
.el-tag {
    background-color: #e0f7fa; /* 标签背景色 */
    color: #00796b; /* 标签字体颜色 */
    border: 1px solid #00796b; /* 标签边框颜色 */
}
.el-tag:hover {
    background-color: #b2ebf2; /* 标签悬停背景色 */
}
</style>
