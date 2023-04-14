<template>
  <div class="InputPart">
    <h2>请填写表单</h2>
    <h4>您的照片将用作提取您的面部特征, 之后您就可以通过本系统认证了。</h4>

    <el-form :model="form" class="form" label-width="80px" ref="Dataform">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="选择方式" prop="type">
        <el-radio-group v-model="type">
          <el-radio label="图片"></el-radio>
          <el-radio label="视频"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item  v-show="type == '图片'">
        <el-button @click="TakePhotoVisible = true">立即拍照</el-button>
        <!-- 显示拍摄的图片 -->
        <!-- <canvas class="canvas" ref="canvas" :width="10" :height="10" v-show="TakePhotoDone" ></canvas> -->
      </el-form-item>

      <el-form-item v-show="type == '视频'">
        <el-button>录像上传</el-button>
        <el-button>使用本地视频</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">录入</el-button>
        <el-button @click="resetForm">清空</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="拍照上传" :visible.sync="TakePhotoVisible">
      <TakePhotos @onClose="getImgURL"></TakePhotos>
    </el-dialog>
  </div>
</template>

<script>
import TakePhotos from "@/components/TakePhotos.vue";
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        // 用户提交的表单，包含用户的信息
        name: "",
        imgUrl: "", // base64格式
      },
      type: "", // 选择照片或视频
      TakePhotoVisible: false, // 拍照的对话框是否出现
      info: null,
    };
  },
  components: { TakePhotos },
  methods: {
    // 拍照获取的imgURL
    getImgURL(value) {
      // console.log(value);

      this.$message({
            message: '面部照片保存成功！',
            type: 'success',
            showClose: true
          })

      this.TakePhotoVisible = false;


      let src = value;
      this.imgUrl=src.replace(/^data:image\/(png|jpg);base64,/, "")
      console.log(this.imgUrl);
      // this.TakePhotoVisible = false;
      // this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
      // // 获取图片base64链接
      // this.imgSrc = this.Cancas.toDataURL('image/png');
      // console.log(this.imgSrc)
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, { type: mime })
        },
        
    // 提交数据 axios
    submit() {

      if(this.form.name == ""){
        this.$message({
          message: '请填写您的姓名！',
          type: 'warning',
          showClose: true
        })
        return false
      }

      if(this.form.imgUrl == ""){
        this.$message({
            message: '请拍摄您的面部照片！',
            type: 'warning',
            showClose: true
          })

        return false
      }

      axios.post("http://localhost:8000/PostUserData", {
        username: this.form.name,
        faceImg: this.imgUrl,
      })
        .then(function (response) {
          console.log(response);
          
          this.$message({
            message: '用户信息录入成功！',
            type: 'success',
            showClose: true
          })
        })
        .catch(function (error) {
          console.log(error);

          
          this.$message({
            message: '录入失败了，请再试一次。',
            type: 'error',
            showClose: true
          })
        });
        
    },
    // 清空表单
    resetForm(){
      this.$refs.Dataform.resetFields();

      this.$message({
          message: '表单已清空数据！',
          type: 'success',
          showClose: true
      })
    }
  },
};
</script>

<style scoped>
.InputPart {
  width: 90%;
  margin: 0 auto;
  max-width: 800px;
  /* justify-content: center; */
  align-content: center;
}

.el-form {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-form-item {
  margin: 10px 10px;
  padding: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-button{
  margin-bottom: 10px;
}
</style>
