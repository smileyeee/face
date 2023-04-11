<template>
  <div class="InputPart">
    <el-form class="form" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="选择方式" prop="type">
        <el-radio-group v-model="type">
          <el-radio label="图片"></el-radio>
          <el-radio label="视频"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上传图片" v-show="type == '图片'">
        <el-button @click="TakePhotoVisible = true">立即拍照</el-button>
        <!-- 显示拍摄的图片 -->
        <canvas class="canvas" :width="100" :height="100"></canvas>
      </el-form-item>

      <el-form-item label="上传视频" v-show="type == '视频'">
        <el-button>录像上传</el-button>
        <el-button>使用本地视频</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">录入</el-button>
        <el-button>清空</el-button>
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
      axios.post("http://localhost:8000/PostUserData", {
        username: this.form.name,
        faceImg: this.imgUrl,
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        
    },
  },
};
</script>

<style>
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
</style>
