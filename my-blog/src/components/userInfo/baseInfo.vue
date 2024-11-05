<template>
    <div id="base-info">
        <div class="top-info">
            <div class="baseInfoTop">
                <div class="profileContainer" @click="openFileInput">
                    <div>
                        <i class="el-icon-plus"></i>
                    </div>
                    <img :src="profileUrl">
                </div>
            </div>
            <div class="top-info-right">
                <h1>{{this.userInfo.name}}</h1>
            </div>
        </div>
        <div class="baseInfoMiddle  ">
            <h1>基本信息</h1>
            <hr/>
            <div class="baseInfoItemContainer">
                <div class="baseInfoItem">
                    <span>用户名</span>
                    <span class="infoShow">{{this.userInfo.name}}</span>
                </div>
                <div class="baseInfoItem">
                    <span>性别</span>
                    <span v-if="editorForm._sex" class="infoShow">{{this.userInfo.sex}}</span>
                    <el-input v-else v-model="editorForm.sex" placeholder="请输入性别"></el-input>
                    <span class="eidtorBtn" @click="editInfo('sex')" v-if="editorForm._sex"><i class="el-icon-edit"></i>编辑</span>
                    <template v-else>
                        <span class="compeleteBtn">
                            <i class="el-icon-close"></i>取消
                        </span>
                        <span class="compeleteBtn">
                            <i class="el-icon-check"></i>完成
                        </span>
                    </template>
                </div>
                <div class="baseInfoItem">
                    <span>地区</span>
                    <span v-if="editorForm._region" class="infoShow">{{this.userInfo.region}}</span>
                    <span class="eidtorBtn" @click="editInfo('region')" v-if="editorForm._region"><i class="el-icon-edit"></i>编辑</span>
                </div>
                <div class="baseInfoItem">
                    <span>生日</span>
                    <span v-if="editorForm._birthDay" class="infoShow">{{this.userInfo.birthDay}}</span>
                    <span class="eidtorBtn" @click="editInfo('birthDay')"><i class="el-icon-edit" ></i>编辑</span>
                </div>
                <div class="baseInfoItem">
                    <span>自我介绍</span> <span class="eidtorBtn" @click="editInfo('selfIntroduction')"><i class="el-icon-edit"></i>编辑</span>
                    <div v-if="editorForm._selfIntroduction" class="infoShow">{{this.userInfo.selfIntroduction?this.userInfo.selfIntroduction:"暂无"}}</div>
                </div>
            </div>
        </div>
        <input  ref="fileInput" style="visibility: hidden; position: absolute; top: 0; left: 0; width: 0; height: 0;" type="file" @change="onFileChange" accept="image/*" />
        <div class="avatar-cropper-container" v-if="showCropper">
            <avatar-cropper
            :image="imageToCrop"
            :limitInfo = 'limitInfo'
            @cancelCropper="closeCropper"
            @uploadAvatar="uploadAvatar"/>
        </div>
    </div>
</template>

<script>
import AvatarCropper from '@/components/normalComponents/AvatarCropper.vue';
import { mapGetters,mapMutations } from 'vuex';
export default {
    name: 'baseInfo',
    components: {
        AvatarCropper
    },
    computed: {
        ...mapGetters('auth',['profileUrl','user']),
    },
    data() {
        return {
            showCropper: false,
            imageToCrop: '',
            limitInfo: {
                height: null,
                width: null,
            },
            userInfo: {
                name: '',
                sex: '',
                region: '',
                birthDay: '',
                selfIntroduction: '',
            },
            editorForm:{
                sex:'',
                _sex:true,
                region:'',
                _region:true,
                birthDay:'',
                _birthDay:true,
                _selfIntroduction:true,
                selfIntroduction:'',
            }
        }
    },
    methods: {
        ...mapMutations('auth',['SET_PROFILE_URL']),
        openFileInput(){
            this.$refs.fileInput.click();
        },
        closeCropper(){
            this.showCropper = false;
            this.$domStatus.setBgBlack.call(this, false)
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result; // 使用 Base64 数据作为图片源
                    img.onload = () => {
                        const { width, height } = img; // 获取图片的宽高
                        let newWidth = width;
                        let newHeight = height;

                        // 判断宽高是否都小于 400px
                        if (width < 400 && height < 400) {
                            // 如果都小于 400px，保持原比例
                            newWidth = width;
                            newHeight = height;
                            if (width > height) {
                                // 如果宽度大于高度，设置宽度为 400px
                                newWidth = 400;
                                newHeight = (height / width) * 400; // 按比例计算高度
                            } else {
                                // 如果高度大于宽度，设置高度为 400px
                                newHeight = 400;
                                newWidth = (width / height) * 400; // 按比例计算宽度
                            }
                            this.limitInfo.height = newHeight;
                            this.limitInfo.width = newWidth;
                        }
                        else{//其中一个大于400，也要给裁剪框基于400长边的信息
                            if(width > height){
                                this.limitInfo.width = 400;
                                this.limitInfo.height = (height / width) * 400;
                            }
                            else{
                                this.limitInfo.height = 400;
                                this.limitInfo.width = (width / height) * 400;
                            }
                        }
                        // 创建一个 canvas 来调整图片尺寸
                        const canvas = document.createElement('canvas');
                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);
                       
                        // 将调整后的图像转换为 Base64
                        this.imageToCrop = canvas.toDataURL('image/jpeg'); // 或 'image/png'
                        this.showCropper = true; // 显示裁剪器
                        this.$domStatus.setBgBlack.call(this,true)
                    };
                };
                reader.readAsDataURL(file); // 读取文件为 Base64
            }
        },
        uploadAvatar(data) {
            this.showCropper = false;
            this.$domStatus.setBgBlack.call(this, false)
             // 将 Base64 转换为 File 对象
            const base64Data = data.split(',')[1]; // 获取 Base64 数据部分
            const byteCharacters = atob(base64Data); // 解码 Base64
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

             // 创建 Blob 对象
            const blob = new Blob([byteArray], { type: 'image/jpeg' }); // 或 'image/png'
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' }); // 创建 File 对象

            // 上传文件到后端
             const formData = new FormData();
            formData.append('avatar', file);
            formData.append('authId', this.user.uid); // 添加其他需要的字段

            this.$axios.post('/api/user/userInfo/updateUserProfile', formData,{headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        // 这里可以写改写 Vuex 的逻辑
                        console.log(res.data.profileUrl);
                        this.SET_PROFILE_URL(res.data.profileUrl);
                        this.$message.success('头像上传成功');
                    }
        })
        .catch(err => {
            console.error('头像上传失败', err);
        });
        },
        editInfo(key){
            let _key =  '_' + key;
            console.log(key,this.editorForm[key])
            console.log(_key,this.editorForm[_key])
            this.editorForm[key] = '';
            this.editorForm[_key] = false;
        }
    },
    created(){
        this.$axios.post('/api/user/userInfo/read',{option: 'getOne',authId: this.user.uid}).then(res => {
            this.userInfo = res.data.userInfo;
        }).catch(err => {
            console.error('获取用户信息失败', err);
        });
    }
}
</script>

<style lang="scss" scoped>
#base-info{
    width: 100%;
    position: relative;
    margin-left: 20px;
    .top-info{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #ffffff;
        .top-info-right{
            flex: 1;
            height: 100%;
            >h1{
                font-size: 2em;
                font-weight: 600;
            }
        }
    }
    .baseInfoTop{
        padding: 20px;
        >.profileContainer{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            position: relative;
            cursor: pointer;
            >div:nth-of-type(1){
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.5);
                display:none;
                >i{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    color: #ffffff;
                }
            }
            >img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            &:hover{
                background-color:rgba(0, 0, 0, 0.5);
                >div:nth-of-type(1){
                    display: block;
                }
            }
        }
    }
    .baseInfoMiddle{
        background-color: #ffffff;
        margin-top: 10px;
        padding: 20px;
        >h1{
            font-size: 1.5em;
            font-weight: 600;
        }
        .baseInfoItemContainer{
            padding: 20px;
            .baseInfoItem{
                line-height: 1.5rem;
                margin-bottom: 10px;
                >span:nth-of-type(1){
                    font-weight: 600;
                    margin-right: 10px;
                    font-size: 1.3rem;
                }
               .infoShow{
                font-size: 1.125rem;
               }
               >.el-input{
                display: inline-block;
                width: 200px;
               }
                .eidtorBtn , .compeleteBtn{
                    cursor: pointer;
                    margin-left: 10px;
                    color: #007bff;
                }
                .eidtorBtn{
                    display: none;
                }
                &:hover > .eidtorBtn{
                    display: inline-block;
                }
            }
        }
    }
    .avatar-cropper-container{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10001;
    }
}
</style>
