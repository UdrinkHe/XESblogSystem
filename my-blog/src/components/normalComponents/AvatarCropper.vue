<template>
  <div id="AvatarCropper" >
    <h1>上传头像</h1>
    <div class="flex-display">
      <div class="cropper-container">
        <vue-cropper
              ref="cropper"
              :img="image"
              :outputSize="option.outputSize"
              :outputType="option.outputType"
              :info="option.info"
              :canScale="option.canScale"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixed="option.fixed"
              :fixedNumber="option.fixedNumber"
              :full="option.full"
              :fixedBox="option.fixedBox"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :centerBox="option.centerBox"
              :height="option.height"
              :infoTrue="option.infoTrue"
              :maxImgSize="option.maxImgSize"
              :enlarge="option.enlarge"
              :mode="option.mode"
              :limitMinSize="option.limitMinSize"
              @realTime="realTime"
              @imgLoad="imgLoad"
              >
          </vue-cropper>
      </div>
      <!-- 裁剪头像 -->
      <div class="cropperShow">
        <img :src="showCropper">
      </div>
    </div>
    <div class="flex-display btn-Group">
      <el-button type="primary" @click="uploadCroppedImage">上传头像</el-button>
      <el-button type="primary" @click="cancelCropper">取消</el-button>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import 'cropperjs/dist/cropper.css';

export default {
  name: 'AvatarCropper',
  components: {
    VueCropper,
  },
  props: {
    image: {
      type: String,
      required: true,
    },
    limitInfo: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      option:{           //裁剪图片的地址
        outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg',  //裁剪生成图片的格式（jpeg || png || webp）
        info: true,          //图片大小信息
        canScale: false,      //图片是否允许滚轮缩放
        autoCrop: true,      //是否默认生成截图框
        autoCropWidth: 400,  //默认生成截图框宽度
        autoCropHeight: 400, //默认生成截图框高度
        limitMinSize : [null,null],
        fixed: true,         //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        full: false,         //false按原比例裁切图片，不失真
        fixedBox: false,      //固定截图框大小，不允许改变
        canMove: false,      //上传图片是否可以移动
        canMoveBox: true,    //截图框能否拖动
        original: false,     //上传图片按照原始比例渲染
        centerBox: true,    //截图框是否被限制在图片里面
        height: true,        //是否按照设备的dpr 输出等比例图片
        infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 400,    //限制图片最大宽度和高度
        enlarge: 1,          //图片根据截图框输出比例倍数
        mode: 'contain'  //图片默认渲染方式
      },
      realTimer : null,
      showCropper : "",
    }
  },
  methods: {
    realTime() {   
      clearTimeout(this.realTimer)
      this.realTimer = setTimeout(() => {
        this.getCroppedImage()
      }, 200)
  
    },
    imgLoad() {
      //根据图片的宽高，限制裁剪框大小
      if(this.limitInfo.heigh > this.limitInfo.width){
        this.option.limitMinSize[0] = this.limitInfo.width / 3;
        this.option.limitMinSize[1] = this.limitInfo.width / 3;
      }
      else{
        this.option.limitMinSize[0] = this.limitInfo.height / 3;
        this.option.limitMinSize[1] = this.limitInfo.height / 3;
      }
    },
    getCroppedImage() {
      this.$refs.cropper.getCropData(data => {
        this.showCropper = data
      })
    },
    cancelCropper(){
      this.$emit('cancelCropper')
    },
    uploadCroppedImage(){
      this.$refs.cropper.getCropData((data) => {
        this.$emit('uploadAvatar', data)
      })
    }
  }
};
</script>

<style scoped>
#AvatarCropper{
 width: 850px;
 background-color: antiquewhite;
 >h1{
  font-size: 2em;
 }
}
.cropper-container {
  width: 400px;
  height: 400px; /* 根据需要调整高度 */
}
.cropperShow{
  width: 400px;
  height: 400px;
  background: #fff;
  position: relative;
  >img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 300px;
    border-radius: 50%;
  }
}
.btn-Group{
  margin-top: 20px;
  justify-content: center;
}
</style>
