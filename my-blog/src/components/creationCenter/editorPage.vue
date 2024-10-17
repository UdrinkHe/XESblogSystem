<template>
    <div id = "editorPage">
      <el-input v-model="title" placeholder="请输入文章标题"></el-input>
      <mavonEditor v-model="content" @save="saveArticle" @imgAdd="addImg" ref="md" @imgDel="delImg"/>
      <div class="tagArray flex-display">
        <el-tag v-for="(item , index) in tagArray" :key="index+''+item" closable @close="handleTagClose(item)">{{item}}</el-tag>
        <el-input v-model="newTag" placeholder="添加标签" @keyup.enter.native="addTag"></el-input>
      </div>
      <div class="buttonGroup">
        <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-warning"
            @confirm="publishArticle"
            title="确定发布这篇文章吗？">                     
        <el-button slot="reference" type="success">发布</el-button>
      </el-popconfirm>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'editorPage',
    components: {
      
    },
    computed: {
    
    },
    data() {
      return {
        content: '',
        title: '',
        tagArray: [],
        newTag: '',
        articleId: '',
        articleStatus: null, //-1为新建,0为草稿,1为发布
        timer: null//防抖
      }
    },
    created() {
      if(this.$route.query.articleId !== 'new'){
        this.articleId = this.$route.query.articleId
        this.$axios.post('/api/user/post/read',{id: this.articleId,option:'getOne'}).then(res => {
        if(res.status === 200){
          console.log(res.data)
          this.content = res.data.post.content
          this.title = res.data.post.title
          this.tagArray = res.data.post.tag
          this.articleStatus = res.data.post.status
        }
      }).catch(err => {
        console.log(err)
      })
      }
      else{
        this.articleStatus = -1
      }
      },
       methods: {
        ...mapGetters('auth', ['user']),
        addTag(){
          if(this.newTag){
            if(this.tagArray.length === 10){
              this.$message.warning('标签数量已达上限:10')
              return
            }
            for(let i = 0; i < this.tagArray.length; i++){
              if(this.tagArray[i] === this.newTag){
                this.$message.warning('标签已存在')
                return
              }
            }
            this.tagArray.push(this.newTag)
            this.newTag = ''
          }
        },
        handleTagClose(tag){
          for(let i = 0; i < this.tagArray.length; i++){
            if(this.tagArray[i] === tag){
              this.tagArray.splice(i, 1)
              break
            }
          }
        },
        saveArticle(){
          //防抖指令
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            if(this.articleStatus === -1){//新文章
              //保存草稿
              this.$axios.post('/api/user/post/create', {
                title: this.title,
                content: this.content,
                tag: this.tagArray,
                userId: this.user().uid,
                status: 0
              }).then(res => {
                if(res.status === 200){
                  this.$message.success('文章草稿箱保存成功')
                  this.articleId = res.data.id
                  this.articleStatus = 0
                }
              }).catch(err => {
                console.log(err)
              })
            }
            else{
              //更新草稿
              this.$axios.post('/api/user/post/update', {
              id: this.articleId,
              title: this.title,
              content: this.content,
              tag: this.tagArray,
              status: 0
            }).then(res => {
              if(res.status === 200){
                this.$message.success('文章草稿箱更新成功')
              }
            }).catch(err => {
              console.log(err)
            })
            }
          }, 500)  
        },
        publishArticle(){
          //检查标题、内容是否完成
          if(!this.title || !this.content || this.tagArray.length === 0){
            this.$message.warning('标题、内容、标签不能为空')
            return
          }
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            if(this.articleStatus === -1)//新文章
            {
            //发布文章
              this.$axios.post('/api/user/post/create', {
                title: this.title,
                content: this.content,
                tag: this.tagArray,
                userId: this.user().uid,
                status: 1
              }).then(res => {
                if(res.status === 200){
                  this.$message.success('发布文章成功')
                  this.articleId = res.data.id
                  this.articleStatus = 1
                }
              }).catch(err => {
                console.log(err)
              })
            }
            else{
              //更新文章
            this.$axios.post('/api/user/post/update', {
              id: this.articleId,
              title: this.title,
              content: this.content,
              tag: this.tagArray,
              status: 1
            }).then(res => {
              if(res.status === 200){
                this.$message.success('文章发布成功')
              }
            }).catch(err => {
              console.log(err)
            })
            }
          }, 500)
        },
        addImg(pos, file){
          const imageFile = new FormData()
          imageFile.append('img', file)
          this.$axios.post('/api/user/post/uploadImage', imageFile,{headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
            if(res.status === 200){
              this.$message.success('图片上传成功')
              this.$refs.md.$img2Url(pos, res.data.url)
              return true
            }
            this.$message.error('图片上传失败')
            return false
          }).catch(err => {
            console.log(err)
          })
        },
        delImg(pos){
          const reg = /[\d\w-]*\.jpg/
          const fileName = pos[0].match(reg)[0]
          this.$axios.post('/api/user/post/deleteImage', {fileName: fileName}).then(res => {
            if(res.status === 200){
              this.$message.success('图片删除成功')
              return true
            }
          }).catch(err => {
            console.log(err)
          })
        }
       }  
  }
  </script>
  
  <style lang="scss">
    .tagArray{
      margin: 20px 0;
      input{
        width: 200px;
      }
    }
    .buttonGroup{
      width: 300px;
      margin: 20px  auto;
      text-align: center;
    }
  </style>
  