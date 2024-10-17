<template>
    <div id = "creationManagement">
      <div class="articleStatus">
        <div :class="{'isChoose': articleStatus[1] === true}" @click="changeArticleStatus(1)">已发布</div>
        <div :class="{'isChoose': articleStatus[0] === true}" @click="changeArticleStatus(0)">草稿箱</div>
        <div :class="{'isChoose': articleStatus[2] === true}" @click="changeArticleStatus(2)">回收站</div>
      </div>
      <div class="searchFilter">
        <div>
          <el-date-picker
                  v-model="searchOption.date"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择年月"
            ></el-date-picker>
        </div>
        <div>
          <el-input v-model="searchOption.title" placeholder="搜索内容"></el-input>
        </div>
        <div>
          <el-button @click="getArticleList(nowStatus)">搜索</el-button>
        </div>
      </div>
      <div class="articleList" v-loading="loading">
        <template v-for="item in articleList">
          <div class="articleItem" :key="item.id">
            <div>
                <div class="articleTitle">{{item.title}}</div>
                <div class="articleManageBtn">
                  <el-button @click="editArticle(item.id)">编辑</el-button>
                  <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='取消'
                            icon="el-icon-warning"
                            @confirm="deleteArticle(item.id)"
                            title="确定要把文章放进回收站吗？"
                            > 
                  <el-button slot="reference" v-if="nowStatus !== 2">删除</el-button>
                 </el-popconfirm>
                  <el-button @click="previewArticle(item.id)">预览</el-button>
                  <el-button @click="moveArticleToPublish(item.id)" v-if="nowStatus !== 1">发布</el-button>
                  <el-button @click="moveArticleToDraft(item.id)" v-if="nowStatus !== 0">移入草稿</el-button>
                </div>
            </div>
            <div>
              <div class="articleData">
                <span>阅读量：{{item.viewCount}}</span>
                <span>点赞量：{{item.appraise}}</span>
                <!--<span>评论量：{{item.comment}}</span>-->
                <span>收藏量：{{item.collection}}</span>
              </div>
              <div class="articleCreateAt">创建于：{{ formatDate(item.createdAt) }}</div>
            </div>
          </div>
        </template>
      </div>
      <el-pagination
            :current-page="pageInfo.page"
            :page-sizes="[10,20,50]"
            :page-size="pageInfo.size"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.total">
    </el-pagination>
    </div>
  </template>
  
  <script>
  import {mapGetters} from 'vuex'
  import DateCounter from '@/js/date/myDateCount'
  export default {
    name: 'creationManagement',
    components: {
      
    },
    computed: {
      
    },
    data() {
      return {
        articleStatus : [false,true,false],
        loading : false,
        nowStatus : 1,
        searchOption : {
          date : null,
          title : null,
        },
        pageInfo : {  //分页信息
          page : 1,
          size : 10,
          total : 0 //在数据库获取
        },
        articleList : [
            // {
            //   id : 1,
            //   title : '文章标题',
            //   createAt : '2024-01-01',
            //   appraise : 100,
            //   comment : 100,
            //   view : 100,
            //   collect : 100
            // }
          ]
      }
    },
    mounted() {

       },
    methods : {
      ...mapGetters('auth',['user']),
      handleSizeChange(size){
        this.pageInfo.size = size;
        this.getArticleList(this.nowStatus)
      },
      handleCurrentChange(page){
        this.pageInfo.page = page;
        this.getArticleList(this.nowStatus)
      },
      getArticleList(index){
        this.loading = true;
        this.$axios.post('/api/user/post/read',{userId: this.user().uid,title:this.searchOption.title,
          date:this.searchOption.date,option: 'getList',status: index,page:this.pageInfo.page,pageSize:this.pageInfo.size}).then(res => {
          if(res.status === 200){
            this.articleList.splice(0,this.articleList.length,...res.data.post);
            console.log(res.data.post)
            this.pageInfo.total = res.data.pageInfo.totalNum;
            this.pageInfo.page = res.data.pageInfo.page;
            this.pageInfo.size = res.data.pageInfo.pageSize;
            console.log(res.data.pageInfo)
            this.$message.success('获取文章列表成功')
            this.loading = false;
          }
        }).catch(err => {
          console.log(err)
          this.loading = false;
          return
        })
      },
      changeArticleStatus(index){
        if(this.articleStatus[index] === true){
          return;
        }
        this.getArticleList(index)
        for(let i = 0; i < this.articleStatus.length; i++){
          if(this.articleStatus[i] === true){
            this.articleStatus.splice(i,1,false)
          }
        }
        this.articleStatus.splice(index,1,true)
        this.nowStatus = index;
      },
      editArticle(id){
        this.$router.push({
          path:`/editorPage`,
          query:{
            articleId: id
          }
        })
      },
      moveArticleToPublish(id){
        this.$axios.post('/api/user/post/update',{
          id:id,
          status: 1
        }).then(res => {
          if(res.status === 200){
            this.$message.success('移动文章到发布成功')
            this.getArticleList(this.nowStatus)
          }
        }).catch(err => {
          console.log(err)
          return
        })
      },
      moveArticleToDraft(id){
        console.log(id)
        this.$axios.post('/api/user/post/update',{
          id:id,
          status: 0
        }).then(res => {
          if(res.status === 200){
            this.$message.success('移动文章到草稿箱成功')
            this.getArticleList(this.nowStatus)
          }
        }).catch(err => {
          console.log(err)
          return
        })

      },
      deleteArticle(id){
        this.$axios.post('/api/user/post/update',{
          id:id,
          status: 2
        }).then(res => {
          if(res.status === 200){
            this.$message.success('文章已放入回收站')
            this.getArticleList(this.nowStatus)
          }
        }).catch(err => {
          console.log(err)
          return
        })  
      },
      formatDate(date) {
        return DateCounter.formatDate(date)
      },
      previewArticle(id){
        let routeUrl = this.$router.resolve({
                path: '/viewPage',
                query: {
                    articleId: id
                }   
            })
        window.open(routeUrl.href, '_blank')
        return
      }

    },
    created(){
      this.getArticleList(this.nowStatus)
    }
  }
  </script>
  
  <style lang="scss">
  #creationManagement {
    padding: 10px;
    background: #f5f5f5;
  }
  .articleStatus {
    display: flex;
    justify-content: space-around;
    width: 200px;
    >div{
      cursor: pointer;
      &.isChoose{
        color: #409eff;
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .searchFilter {
    width: 500px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .articleItem >div{
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    >div{
      display: flex;
      justify-content: space-between;
    }
    >div:nth-of-type(1){
      height: 2em;
      line-height: 2em;
    }
    .articleTitle{
      font-size: 1.2em;
      font-weight: bold;
    }
  }
  </style>
  
