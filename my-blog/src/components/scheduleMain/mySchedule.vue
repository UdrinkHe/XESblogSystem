<template>
<div id="mySchedule" class="p20">
    <div class="nowAndHistorySchedule flex-display">
        <div :class="{isChoose:nowAndHistoryChoose[0]}" @click="changeNowAndHistoryChoose(0)">今日日程</div>
        <span>|</span>
        <div :class="{isChoose:nowAndHistoryChoose[1]}" @click="changeNowAndHistoryChoose(1)">日程管理</div>
    </div>
    <div v-show="isTodayShow">
        <div class="scheduleInfoToday" v-if="todaySchedule">
            <div class="titleAndDate">
                {{this.todaySchedule.name}}
                <span class="currentTime">{{ currentTime }}</span>
            </div>
            <div>日期：{{this.todaySchedule.dateStr}}</div>
            <div class="hourlyTaskContent">
                <template v-for="(item,index) in todayScheduleHourlyTask">
                    <div 
                        :class="['schedulehourlyTaskMain', item.statusClass]" 
                        :key="item.id+index"
                    >
                        <div>
                            {{index+1+'.'}}{{item.name}}
                        </div>
                        <div>{{item.start}}-{{item.end}}</div>
                    </div>
                    <div class="hourlyTaskDescription" :key="item.id+index+3">
                        <span>备注:</span>{{item.hourlyTaskDescription}}
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div v-show="!isTodayShow">
        <div class="filter"><!--筛选器-->
            <el-button @click="openEdit('add')"><i class="el-icon-plus"></i>添加</el-button>
        </div>
        <div class="myScheduleMain"><!--展示-->
            <el-card v-for="itema in scheduleInfo_show" :key="itema.uid" class="schedule-card">
                <div slot="header" class="card-header">
                    <span class="title">{{itema.name}}</span>
                        <div class="button-group">
                        <el-button @click="showhourlyTaskContent(itema.uid)" :icon="itema.visible ? 'el-icon-close' : 'el-icon-view'" circle></el-button>
                        <el-button @click="openEdit('update',itema.uid)" icon="el-icon-edit-outline" circle></el-button>
                        <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='取消'
                            icon="el-icon-warning"
                            @confirm="deleteOneDaySchedule(itema.uid)"
                            title="确定要删除这条日程记录吗？">
                            <el-button slot="reference" icon="el-icon-delete" circle></el-button>
                        </el-popconfirm>
                    </div>
                </div>
                <div class="card-content">
                    <p class="date">日期：{{itema.dateStr}}</p>
                    <el-collapse-transition>
                        <div v-show="itema.visible" class="hourly-task-list">
                            <el-timeline>
                                <el-timeline-item
                                    v-for="(item, index) in itema.hourlyTask"
                                    :key="itema.uid+(item.uid?item.uid:item._id)"
                                    :timestamp="item.start + ' - ' + item.end">
                                    <h3>{{index+1}}. {{item.name}}</h3>
                                    <p class="description">备注: {{item.hourlyTaskDescription}}</p>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-collapse-transition>
                </div>
            </el-card>
        </div>
        <div class="pageSelect fit-content-centerBox"><!--分页-->
            <myPagination :nowPage="pageInfo.nowPage" :pageSize="pageInfo.pageSize" :dataLength="pageInfo.totalLength" @refresh="page_refresh"></myPagination>
        </div>
    </div>
    <div class="maskLayer" v-show="isEditorOpen"></div><!--遮罩层-->
    <div class="editorBlock" v-show="isEditorOpen"><!--编辑与添加模块-->
        <div class="addOnehourlyTask">
            <el-button @click = "addOnehourlyTask()">
                <i class="el-icon-plus"></i>
                <span>添加时段</span>
            </el-button>
        </div>
        <div class="edTitile" v-if="editorType == 'update'">日程修改</div>
        <div class="edTitile" v-else-if="editorType == 'add'" >日程添加</div>
        <div class="titleEditor">
            <div class="nameEditor">
                <el-input placeholder="请输入日程名" v-model="editorData.name"></el-input>
            </div>
            <div>
                <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    v-model="editorData.dateStr">
                </el-date-picker>
            </div>
        </div>
        <div class="hourlyTaskEditor" v-if="editorData.hourlyTask.length?true:false"><!--只有当编辑栏的hourlyTask数组有实例时才可以显示-->
            <template v-for="(item,index) in editorData.hourlyTask">
                <div class="onehourlyTaskAddBlock" :key="editorData.uid+(item.uid?item.uid:item._id)">
                    <div>
                        <el-input v-model="item.name" placeholder="请输入时段任务名"></el-input>
                    </div>
                    <div>
                        <span>开始时段：</span>
                        <div>
                            <el-time-picker
                                v-model="item.start" format="HH:mm" value-format="HH:mm" @change="timeChecking('start',index)">
                            </el-time-picker>
                            <span class="supposeText">{{editorRelative.supposeStart[index]}}</span>
                        </div>
                        <span>结束时段：</span>
                        <div>
                            <el-time-picker
                            v-model="item.end" format="HH:mm" value-format="HH:mm" :disabled="!item.start" @change="timeChecking('end',index)">
                            </el-time-picker>
                            <span class="supposeText">{{editorRelative.supposeEnd[index]}}</span>
                        </div>
                    </div>
                    <div class="descriptionEditor">
                        备注：
                        <div>
                            <el-input type="textarea" v-model="item.hourlyTaskDescription"></el-input>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="eitorButtonGroup">
            <div>
                <el-button type="warning" @click="closeEdit()">取消</el-button>
            </div>
            <div>
                <el-button type="success" v-if="editorType=='add'" @click="queryEdit('add')">添加</el-button>
                <el-button type="success" v-else-if="editorType=='update'" @click="queryEdit('update')">修改</el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import DateCounter from '@/js/date/myDateCount';
import myPagination from '../normalComponents/myPagination.vue';
import {mapMutations,mapGetters} from 'vuex'   
export default {
name: 'mySchedule',
components: {
    myPagination
},
data() {
    return {
        pageInfo:{
            nowPage : 1,
            pageSize : 10,
            totalLength : 0
        },
        nowDateStr : null,
        nowAndHistoryChoose : [true,false],
        nowAndHistoryChoose_nowIndex:0,
        isTodayShow : true,//显示今天还是历史记录
        isEditorOpen : false,//是否打开数据编辑（添加或者修改）
        editorType:'add',//添加或者修改
        editorId : null,//被修改数据的编号
        editorRelative:{//编辑相关参数辅助
            hourlyTaskItemAdd : [] ,//绑定每个时段的具体事项添加
            supposeStart : [], //推荐的起始和结束时间，在编辑hourlyTask的时间段出现错误时提示
            supposeEnd : [] 
        },
        editorData : {//编辑器数据
                name : '',//日程名    E
                dateStr : null,//日程日期   E
                hourlyTask : [ 
                ]
        },
        todaySchedule:null,
        scheduleInfo_show:[   //显示在日程管理页面的数据
        ],
        //数据库数据
        scheduleInfo_data:[   //数据库返回的数据
            // {
            //     id : 0,//id根据创建时间+随机数生成
            //     name : '活力满满的一天',//日程名    E
            //     dateStr : '2024-9-27',//日程日期   E
            //     //status //日程状态 -1未开始 0进行中 1已经完成 
            //     visible : false,//可见hourlyTask内容 
            //     hourlyTask : [ //每个时间段需要做的事情 E
            //         {
            //             id : 0, 
            //             name : '学习',//时段名 E
            //             start : '21:30',//开始时间 E
            //             end : '22:00',//结束时间 E
            //             //status //时段状态 
            //             hourlyTaskDescription : '好好学习把！', //E
            //         }
            //     ]
            // }
        ],
        currentTime: ''
    }
},
computed: {
   todayScheduleHourlyTask(){
    return this.todaySchedule.hourlyTask.map(task => ({
        ...task,
        statusClass: this.currentTime < task.start ? 'not-started' : this.currentTime <= task.end ? 'in-progress' : 'completed'
    }))
   }
},
mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
},
methods: {
    ...mapMutations('idCount',['setIdCount']),
    ...mapGetters('idCount',['idCount']),
    ...mapGetters('auth',['user']),
    getScheduleData() { //获取日程数据
        this.$axios.post('api/user/schedule/read', { userId: this.user().uid }).then((res) => {
            res.data.forEach(item => {
                item.visible = false
            });
            this.scheduleInfo_data.splice(0, this.scheduleInfo_data.length, ...res.data)
            this.pageInfo.totalLength = this.scheduleInfo_data.length
            this.page_refresh()
            this.$message.success('日程加载成功');
        }).catch((err) => {
            console.log(err);
            this.$message.error('加载日程失败');
        });
    },
    //数据验证
    timeChecking(type,index) { //type：开始时间/结束时间 index:是哪个hourlyTask的时段 
        this.editorRelative.supposeStart[index] = null
        this.editorRelative.supposeEnd[index] = null
        let nowStartStr = this.editorData.hourlyTask[index].start.split(':')
        let nowStartMin = (nowStartStr[0][0] == '0'?parseInt(nowStartStr[0][1])*60:parseInt(nowStartStr[0])*60)+(nowStartStr[1][0] == '0'?parseInt(nowStartStr[1][1]):parseInt(nowStartStr[1]))
        
        let nowEndMin = null //如果是添加的start ，end可能是空的
        if(this.editorData.hourlyTask[index].end){
            let nowEndStr = this.editorData.hourlyTask[index].end.split(':')
            nowEndMin = (nowEndStr[0][0] == '0'?parseInt(nowEndStr[0][1])*60:parseInt(nowEndStr[0])*60)+(nowEndStr[1][0] == '0'?parseInt(nowEndStr[1][1]):parseInt(nowEndStr[1]))
        }  
        if(nowEndMin&&nowEndMin <= nowStartMin){//结束时间不为空时需要比较
            this.$message.error('结束时间必须大于开始时间！')
            this.editorData.hourlyTask[index].end = null
            return null
        }
        //把"小时:分钟"转换为分钟的形式
        let timeHasUse = []
        for(let i = 0;i < this.editorData.hourlyTask.length;i++)
        {
            if(i != index&&this.editorData.hourlyTask[i].start&&this.editorData.hourlyTask[i].end){//数据是已经存好的时段（不能为空）并且不包含正在添加的
                let [startStr,endStr] = [this.editorData.hourlyTask[i].start.split(":"),this.editorData.hourlyTask[i].end.split(":")]
                let startMin = (startStr[0][0] == '0'?parseInt(startStr[0][1])*60:parseInt(startStr[0])*60)+(startStr[1][0] == '0'?parseInt(startStr[1][1]):parseInt(startStr[1]))
                let endMin = (endStr[0][0] == '0'?parseInt(endStr[0][1])*60:parseInt(endStr[0])*60)+(endStr[1][0] == '0'?parseInt(endStr[1][1]):parseInt(endStr[1]))
                timeHasUse.push({startMin,endMin})
            }
        }
        //检测start，end的输入值和原先数列是否冲突
        if(timeHasUse.length)
        {   
            let isTag = true //通过数据检测
            let closestEnd = -1
            let closestStart = 1441
            if(type == 'start'){
               //先检测start是否在已有时间段中间,同时找出最接近的结束时间，起始时间不能小于它
               for(let item of timeHasUse){
                if(item.startMin == nowStartMin){
                    this.$message.error('起始时间与已有时段的起始时间相同！')
                    isTag = false
                }
                if(item.startMin < nowStartMin && item.endMin > nowStartMin)
                {
                    this.$message.error('起始时间不能在已有时段中间')
                    isTag = false
                }
                if(nowEndMin && nowEndMin > item.endMin){
                    closestEnd = item.endMin
                }
               }
               //循环完没问题就检测start 是否在 closetEnd ———— endMin范围
               if(nowStartMin < closestEnd)
               {   
                    if(isTag){
                        this.$message.error('与其他时间段相交！')
                    }
                   let supposeTime = Math.floor(closestEnd/60) +'时'+ (closestEnd % 60)+'分'
                   this.editorRelative.supposeStart[index] = '建议起始时间:>='+supposeTime
                   isTag = false 
               }
               if(!isTag){
                    this.editorData.hourlyTask[index].start = null
               }
            }
            else if(type == 'end'){
                for(let item of timeHasUse){
                    if(item.endMin == nowEndMin){
                        this.$message.error('结束时间与已有时段的结束时间相同！')
                        isTag = false
                    }
                    if(item.startMin < nowEndMin && item.endMin > nowEndMin)
                    {
                        this.$message.error('结束时间不能在已有时段中间')
                        isTag = false
                    }
                    if(nowStartMin && nowStartMin < item.startMin){
                        closestStart = item.startMin
                    }
                }
                if(nowEndMin > closestStart){
                   if(isTag){
                    this.$message.error('与其他时间段相交！')
                   } 
                   let supposeTime = Math.floor(closestStart/60) +'时'+ (closestStart % 60)+'分'
                   this.editorRelative.supposeEnd[index] = '建议结束时间:<='+supposeTime
                   isTag = false
               }
               if(!isTag){
                this.editorData.hourlyTask[index].end = null
               }
            }
        }
        
    },
    //页面操作
    changeNowAndHistoryChoose(index) { //页面切换
        if(this.nowAndHistoryChoose_nowIndex != index){
            this.nowAndHistoryChoose.splice(this.nowAndHistoryChoose_nowIndex,1,false)
            this.nowAndHistoryChoose.splice(index,1,true)
            this.nowAndHistoryChoose_nowIndex = index
            this.isTodayShow = !this.isTodayShow
            if(index == 1){//日程管理
                this.$axios.post('api/user/schedule/read',{userId:this.user().uid}).then((res)=>{
                    res.data.forEach(item => {
                        item.visible = false
                    });
                    this.scheduleInfo_data.splice(0,this.scheduleInfo_data.length,...res.data)
                    this.pageInfo.totalLength = this.scheduleInfo_data.length
                    this.page_refresh()
                }).catch((err)=>{
                    console.log('发生了错误：')
                    console.log(err)
                })
            }
        }
    },
    showhourlyTaskContent(uid) {//显示hourlyTasklist的内容
        for(let i = 0;i < this.scheduleInfo_show.length;i++) {
            if(this.scheduleInfo_show[i].uid === uid){
                this.scheduleInfo_show[i].visible = !this.scheduleInfo_show[i].visible
                let newItem = JSON.parse(JSON.stringify(this.scheduleInfo_show[i]))
                this.scheduleInfo_show.splice(i,1,newItem)
            }
        }
    },
    deleteOneDaySchedule(uid){  //确定删除一天的日程
        this.$axios.post('api/user/schedule/delete',{uid,userId:this.user().uid}).then(()=>{
            this.getScheduleData()
        })
    },
    openEdit(type,...args){  //打开编辑
        if(type == 'add'){     
            this.editorType = 'add'
            this.setIdCount()
            this.editorData = {
                id : this.idCount() +'s'+ new Date().getTime(),
                name : '',//日程名    E
                dateStr : null,//日程日期   E
                hourlyTask : [ 
                ]
            }
        }
        else if(type == 'update')
        {   
            for(let item of this.scheduleInfo_show){
                if(item.uid == args[0]){
                    this.editorData = JSON.parse(JSON.stringify(item))
                    break
                }
            }
            this.editorType = 'update'
            this.editorId = args[0]
        }
        this.isEditorOpen = true
    },
    closeEdit(){ //关闭编辑
        this.isEditorOpen = false
    },
    queryEdit(type){ //确认数据编辑
        if(type == 'add'){
            //确认添加的时候先按时间排序hourlyTask
            let sortEditor = JSON.parse(JSON.stringify(this.editorData.hourlyTask))
            sortEditor.sort( (itemA,itemB) => {
                let Astart = DateCounter.getHourStrToMinNumber(itemA.start)
                let Bend = DateCounter.getHourStrToMinNumber(itemB.end)
                if(Astart >= Bend){
                    return 1
                }
                else{
                    return -1
                }
            })
            this.editorData.hourlyTask = sortEditor
            this.editorData.visible = false
            //将新增数据添加到数据库
            let {id:uid,hourlyTask,name,dateStr} = this.editorData
            this.$axios.post('api/user/schedule/create',{uid,hourlyTask,name,dateStr,userId:this.user().uid}).then(()=>{
                this.getScheduleData()
            })
        }
        else if(type == 'update'){
            for(let index in this.scheduleInfo_show){
                if(this.scheduleInfo_show[index].uid == this.editorId){
                    this.$axios.post('api/user/schedule/update',this.editorData).then(()=>{
                       this.getScheduleData()
                    })
                    break
                }
            }
            
        }
        this.isEditorOpen = false
    },
    addOnehourlyTask(){ //给编辑的日程添加一个时段任务
        let canAdd = true
        if(this.editorData.hourlyTask.length != 0){ //时段任务不为0时需要判断上一个时段的时间是否填写完了
            for(let i = 0;i < this.editorData.hourlyTask.length; i++){
                if(this.editorData.hourlyTask[i].name == ''||this.editorData.hourlyTask[i].start == null||this.editorData.hourlyTask[i].end == null){
                    this.$message.error('请确保已有的时段任务中信息填写完整！')
                    canAdd = false
                    break;
                }
            }
        }
        if(canAdd){
            this.setIdCount()
            this.editorData.hourlyTask.push({
                        _id : this.idCount() +'s'+ new Date().getTime(),
                        uid : null, 
                        name : '',//时段任务 E
                        start : null,//开始时间 E
                        end : null,//结束时间 E
                        hourlyTaskDescription : '', //E
                    })
            this.editorRelative.hourlyTaskItemAdd.push('')
            this.editorRelative.supposeEnd.push(null)
            this.editorRelative.supposeStart.push(null)
        }
     
    },
    addOnehourlyTaskItem(index){//添加一条具体事项
        this.setIdCount()
        this.editorData.hourlyTask[index].hourlyTaskItem.push({
            id : this.idCount() +'s'+ new Date().getTime(),
            name : this.editorRelative.hourlyTaskItemAdd[index]
        })
        this.editorRelative.hourlyTaskItemAdd[index] = ''
    },
    getOneDaySchedule(nowStr){//根据形如"2024-1-1"形式的字符串获取某一天的详细行程
        //数据库查询
        this.$axios.post('api/user/schedule/read',{whichDate : nowStr,userId:this.user().uid}).then(res => {
            if(res.data&&!res.data.length){
                this.$message.error('今天还没有创建日程')
            }
            else{
                this.todaySchedule = res.data[0]
                this.$message({
                    type : "success",
                    message : '今日日程加载成功'
                })
            }
        }).catch(()=>{
            this.$message.error('加载今日日程失败')
        })
    },
    page_refresh(...args){
        this.dataLoading = true
        if(args.length !== 0){
            if(args[0] === 'currentChange'){
                this.pageInfo.nowPage = args[1]
            }
            else if(args[0] === 'sizeChange'){
                this.pageInfo.pageSize = args[1] 
            }
        }
        let pageShow = this.scheduleInfo_data.slice((this.pageInfo.nowPage - 1)*this.pageInfo.pageSize , this.pageInfo.nowPage*this.pageInfo.pageSize)
        this.scheduleInfo_show.splice(0,this.scheduleInfo_show.length,...JSON.parse(JSON.stringify(pageShow)))
        this.dataLoading  = false
    },
    updateTime() {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString('zh-CN', { hour12: false });
    }
},
created(){
    //获得今天的日期字符，然后去获取今天的数据
    (()=>{
        let date = new Date()
        this.nowDateStr = date.getFullYear() + '-' + ((date.getMonth() +1 ) >=10?date.getMonth()+1:('0'+(date.getMonth()+1))) + '-' + (date.getDate() >=10?date.getDate():('0'+date.getDate()))
        this.getOneDaySchedule(this.nowDateStr,'today')
    })()
},
}
</script>

<style lang="scss" scoped>
#mySchedule {
    .nowAndHistorySchedule {
        width: 150px;
        margin: 0 auto;
        >div {
            cursor: pointer;
        }
        >.isChoose {
            color: #409EFF;
        }
    }
}

.myScheduleMain {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;

    .schedule-card {
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title {
                font-size: 1.2em;
                font-weight: bold;
                margin-right: 10px;
            }

            .button-group {
                display: flex;
                gap: 10px;
            }
        }

        .card-content {
            .date {
                font-style: italic;
                color: #666;
                margin-bottom: 10px;
            }

            .hourly-task-list {
                margin-top: 15px;

                .description {
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 5px;
                }
            }
        }
    }
}

.maskLayer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.5);
    z-index: 99;
}

.editorBlock {
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
    >.addOnehourlyTask{
        position: absolute;
        font-size: 1em;
        right: 1em;
    }
    >.edTitile{
        font-size: 2em;
        font-weight: 600;
        margin-top: 0;
    }
    >div{
        margin-top: 10px;
    }
    .nameEditor {
        width: 20em;
    }
}

.onehourlyTaskAddBlock {
    margin-top: 20px;
    background-color: #EBEEF5;
    padding: 20px;
    border-radius: 20px;
    >div:nth-of-type(1) {
        width: 20em;
    }
}

span.supposeText {
    color: red;
}

div.eitorButtonGroup{
    display: flex;
    justify-content: center;
}

.scheduleInfoToday {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .titleAndDate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5em;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;

        .currentTime {
            font-size: 0.9em;
            color: #666;
        }
    }

    .hourlyTaskContent {
        margin-top: 15px;

        .schedulehourlyTaskMain {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: #fff;
            border: 1px solid #ddd;

            &.not-started {
                background-color: #f0f0f0;
            }

            &.in-progress {
                background-color: #e0f7fa;
            }

            &.completed {
                background-color: #e8f5e9;
            }
        }

        .hourlyTaskDescription {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
    }
}
</style>