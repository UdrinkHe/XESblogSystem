<template>
<div id="todoList">
    <div class="filterBlock"><!--筛选与控制器-->
        <div class="fit-content-centerBox">
            <el-input class="search" placeholder="查询待办事项"  v-model="searchValue"></el-input>
            <el-button @click="getTodoData">搜索</el-button>
        </div>
        <!-- 添加时间筛选器 -->
        <div class="fit-content-centerBox">
            <el-date-picker
                v-model="selectedDate"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择年月"
                @change="getTodoData"
            ></el-date-picker>
        </div>
        <div class="fit-content-centerBox">
            <span :class="{isChoose : typeChoose[0]}" @click="change_page_typeChoose(0)">已完成</span>
            <span :class="{isChoose : typeChoose[1]}" @click="change_page_typeChoose(1)">未完成</span>
            <span :class="{isChoose : typeChoose[2]}" @click="change_page_typeChoose(2)">全选</span>
        </div>
    </div>
    <div class="itemContentBlock"><!--列表-->
        <div class="itemControl_buttonGroup fit-content-centerBox">
            <el-button>刷新</el-button>
            <el-button @click="openEditor('add')">添加</el-button>
        </div>
        <div v-loading="dataLoading">
            <template v-for="(item,index) in todo_show">
                <div class="todoItem" :key="index+''+item.uid">
                    <div class="todoItem-content">
                        <h3 class="todoItem-title">
                            {{item.name}}
                            <el-tag :type="item.isFin ? 'success' : 'info'" size="small">
                                {{ item.isFin ? '已完成' : '未完成' }}
                            </el-tag>
                        </h3>
                        <span class="todoItem-date">截至日期：{{item.dateEnd}}</span>
                        <div class="todoItem-description">{{item.description}}</div>
                        <div class="todoItem-tags">
                            <el-tag v-for="tag in item.label" :key="tag" size="small">{{tag}}</el-tag>
                        </div>
                    </div>
                    <div class="todoItem-actions">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditor('edit', item)">编辑</el-button>
                        <el-popconfirm
                                confirm-button-text='确定'
                                cancel-button-text='不用了'
                                icon="el-icon-info"
                                @confirm = "deleteItem(item.uid)"
                                icon-color="red"
                                title="确定要删除这条日程记录吗？">
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        </el-popconfirm>
                    </div>
                </div>
                <div style="margin-bottom: 10px;" :key="'sup'+index+item.id"></div>
            </template>
        </div>
    </div>
    <div class="fit-content-centerBox"><!--分页---->
       <myPagination :nowPage="nowPage" :pageSize="pageSize" @refresh="page_refresh" :dataLength="totalLength"></myPagination>
    </div>
    <!-- 添加遮罩层 -->
    <div class="mask" v-show="showEditor" @click="closeEditor"></div>

    <!-- 添加编辑器块 -->
    <div class="editorBlock" v-show="showEditor">
        <h3>{{ editorMode === 'add' ? '添加待办事项' : '编辑待办事项' }}</h3>
        <el-input v-model="editorData.name" placeholder="名称"></el-input>
        <el-input
          type="textarea"
          v-model="editorData.description"
          placeholder="描述"
        ></el-input>
        <el-select v-model="editorData.label" multiple placeholder="标签">
          <el-option
            v-for="item in labelOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
          <!-- 输入框用于添加自定义标签 -->
          <el-input
            placeholder="输入自定义标签并按Enter"
            @keyup.enter.native="addCustomLabel"
            v-model="labelInput"
          ></el-input>
        </el-select>
        <el-date-picker
          v-model="editorData.dateEnd"
          type="datetime"
          placeholder="截止日期"
        ></el-date-picker>
        <div class="button-group">
          <el-button @click="saveEditorData">保存</el-button>
          <el-button @click="closeEditor">取消</el-button>
        </div>
    </div>
</div>
</template>

<script>
import myPagination from '../normalComponents/myPagination.vue';
import { mapGetters } from 'vuex';
export default {
name: 'todoList',
components: {
    myPagination
},
data(){
    return {
        nowPage : 1,
        pageSize : 10,
        totalLength : 0,
        searchValue : null,
        dataLoading : true,
        typeChoose : [false,false,true],
        selectedDate: null, // 新增的日期选择器绑定
        todo_show : [],
        todo_data : [],
        showEditor: false,
        editorMode: 'add', // 'add' 或 'edit'
        editorData: {
            name: '',
            description: '',
            isFin : false,
            label: [],
            dateEnd: null
        },
        labelInput: '', // 新增的标签输入框绑定
        labelOptions: ['工作', '学习', '生活'] // 移除“其他”选项
    }
},
methods:{
    ...mapGetters('auth',['user']),
    getTodoData(){
        this.dataLoading = true;
        let requestData = {
            userId: this.user().uid,
            name: this.searchValue,
            dateSelected: this.selectedDate // 添加日期筛选 格式为'yyyy-MM'
        };
        if (this.typeChoose[0]) {
            requestData.isFin = true;
        } else if (this.typeChoose[1]) {
            requestData.isFin = false;
        } else {
            requestData.isFin = null;
        }
        this.$axios.post('api/user/todolist/read', requestData).then((res) => {
            this.todo_data.splice(0, this.todo_data.length, ...res.data);
            this.totalLength = this.todo_data.length;
            if (this.nowPage > 1) {
                if ((this.nowPage - 1) * this.pageSize >= this.totalLength) {
                    this.nowPage = 1;
                }
            }
            this.page_refresh();
            this.$message.success('待办事项加载成功');
        }).catch((err) => {
            console.log(err);
            this.$message.error('加载待办事项失败');
        });
        this.dataLoading = false;
    },
    addCustomLabel() {
        if(!this.labelInput){
            this.$message.error('标签不能为空')
        }
        else {
            if(!this.editorData.label.includes(this.labelInput)){
                this.$message.success('标签添加成功')
                this.editorData.label.push(this.labelInput)
                this.labelInput = ''
            }
            else{
                this.$message.error('标签已存在')
            }
        }
        console.log(this.labelInput)
        // const value = event.target.value.trim();
        // console.log(this.labelInput)
        // if (value && !this.editorData.label.includes(value)) {
        //     this.editorData.label.push(value);
        //     event.target.value = ''; // 清空输入框
        // }
    },
    change_page_typeChoose(index){
        if(this.typeChoose[index] !== true){
            for(let i = 0;i < this.typeChoose.length;i++){
                if(this.typeChoose[i] === true){
                    this.typeChoose.splice(i,1,false)
                }
            }
            this.typeChoose.splice(index,1,true)
        }
        this.getTodoData()
    },
    page_refresh(...args){
        this.dataLoading = true;
        if(args.length !== 0){
            if(args[0] === 'currentChange'){
                this.nowPage = args[1]
            }
            else if(args[0] === 'sizeChange'){
                this.pageSize = args[1] 
            }
        }
        let pageShow = this.todo_data.slice((this.nowPage - 1)*this.pageSize , this.nowPage*this.pageSize)
        this.todo_show.splice(0,this.todo_show.length,...JSON.parse(JSON.stringify(pageShow)))
        this.dataLoading  = false
    },
    openEditor(mode, item) {
        this.editorMode = mode;
        this.showEditor = true;
        if (mode === 'edit' && item) {
            this.editorData = JSON.parse(JSON.stringify(item));
        } else {
            this.editorData = {
                name: '',
                description: '',
                label: [],
                DateEnd: null,
                isFin : false,
            };
        }
    },
    closeEditor() {
        this.showEditor = false;
    },
    saveEditorData() {
        if(this.editorMode === 'add'){
            this.$axios.post('api/user/todolist/create',{...this.editorData,userId:this.user().uid}).then((res)=>{
                console.log(res.data)
                this.getTodoData()
                this.$message.success('待办事项添加成功')
            }).catch((err)=>{
                console.log(err)
                this.$message.error('添加待办事项失败')
            })
        }
        else{
            this.todo_data.forEach((item,index)=>{
                if(item.uid === this.editorData.uid){
                    this.editorData.userId = this.user().uid
                    this.$axios.post('api/user/todolist/update',this.editorData).then(()=>{
                        this.todo_data.splice(index,1,JSON.parse(JSON.stringify(this.editorData)))
                        this.page_refresh()
                        this.$message.success('待办事项更新成功')
                    }).catch((err)=>{
                        console.log(err)
                        this.$message.error('更新待办事项失败')
                    })
                }
            })
        }
        this.closeEditor();
    },
    deleteItem(uid) {
        console.log(uid)
        this.$axios.post('api/user/todolist/delete',{uid}).then(()=>{
            this.todo_data.forEach((item,index)=>{
                if(item.uid === uid){
                    this.todo_data.splice(index,1)
                }
            })
            this.page_refresh()
            this.$message.success('待办事项删除成功')
        }).catch((err)=>{
            console.log(err)
            this.$message.error('删除待办事项失败')
        })
    }
},
created(){
    this.dataLoading = true;
    this.$axios.post('api/user/todolist/read',{userId:this.user().uid}).then((res)=>{
        this.todo_data.splice(0,0,...res.data)
        this.totalLength = this.todo_data.length
        this.page_refresh()
        this.$message.success('待办事项加载成功')
    }).catch((err)=>{
        console.log(err)
        this.$message.error('加载待办事项失败')
    })  
}
}
</script>

<style lang="scss" scoped>
#todoList{
    padding: 20px;
}
.filterBlock{
    box-sizing: border-box;
    .search{
        width: 300px;
    }
    >div:nth-of-type(3){
        margin-top: 10px;
        >span{
            width: 100px;
            cursor: pointer;
            margin-right: 10px;
            &:nth-of-type(1){
                margin-left: 10px;
            }
            &.isChoose{
                border-bottom: 2px red solid;
            }
        }
    }
}
.itemContentBlock{
    .itemControl_buttonGroup{
        float : right;
    }
    >div:nth-of-type(2){
        clear: both;
        width: 100%;
        padding-top: 10px;
        overflow: hidden;
        background-color: #FFFACD;
        .todoItem{
            background-color: #F2F6FC;
            border-radius: 10px;
            padding: 20px;
            width: 80%;
            min-width: 600px;
            margin: 0 auto;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.15);

                .todoItem-actions {
                    opacity: 1;
                }
            }

            .todoItem-content {
                padding-right: 100px; // 为按钮留出空间
            }

            .todoItem-title {
                font-size: 18px;
                margin-bottom: 10px;
                color: #303133;
            }

            .todoItem-date {
                font-size: 14px;
                color: #909399;
                display: block;
                margin-bottom: 10px;
            }

            .todoItem-description {
                font-size: 14px;
                color: #606266;
                margin-bottom: 10px;
                line-height: 1.5;
            }

            .todoItem-tags {
                margin-top: 10px;

                .el-tag {
                    margin-right: 5px;
                }
            }

            .todoItem-actions {
                position: absolute;
                top: 10px;
                right: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;

                .el-button {
                    margin-left: 5px;
                }
            }
        }
    }
}
.mask{
background: rgba(0, 0, 0, 0.7);
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
z-index: 99;
}
.editorBlock{
top: 0;
left: 50%;
position: absolute;
width: 60vw;
min-width: 600px;
max-width: 800px;
transform: translateX(-50%);
background-color: #DCDFE6;
z-index: 10001;
padding: 1em;
}
</style>