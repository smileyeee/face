<template>
  <div class="uploadFile">
    <!-- ul、li标签用于展示从本地添加的预览图片 -->
    <ul v-show="uploadImg.length != 0">
      <li v-for="(item, index) in uploadImg" :key="index" class="addPic">
        <img :src="item" />
      </li>
    </ul>
    <input
      type="file"
      id="file"
      accept="image/*"
      @change="getPicture($event)"
    />
    <button @click="callFile" v-show="showInputImg">+</button>
  </div>
</template>
<script>
export default {
  name: "PickPhoto",
  data() {
    return {
      uploadImg: [],
    };
  },
  computed: {
    showInputImg() {
      return this.uploadImg.length < 3;
    },
  },
  methods: {
    getPicture(e) {
      //预览图片
      let src = window.URL.createObjectURL(e.target.files[0]);
      this.uploadImg.push(src);

      //将图片文件转化成base64格式图片
      var reader = new FileReader();
      reader.onload = () => {
        //e.target.result  就是从本地读取的图片的base64格式,将它上传给服务器即可
        //使用axios的post方法上传即可
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    callFile() {
      //点击添加图片按钮，触发type:"file"的input标签
      let fileDom = document.querySelector("#file");
      fileDom.click();
    },
  },
};
</script>
<style scoped>
input {
  /* 隐藏默认的"打开文件"样式 */
  display: none;
}
.uploadFile {
  display: flex;
  height: 120px;
  line-height: 120px;
  padding: 10px 0;
  border-bottom: 1px solid rgb(235, 235, 235);
  overflow: hidden;
}
.uploadFile ul {
  display: flex;
}
.uploadFile ul li {
  margin-right: 10px;
}
.uploadFile .addPic img {
  height: 100px;
  width: 100px;
}
.uploadFile button {
  height: 100px;
  width: 100px;
  font-size: 50px;
  border: 1px dashed rgb(182, 182, 182);
  color: rgb(182, 182, 182);
  background-color: rgb(243, 243, 243);
}
</style>
