<template>
  <div class="ComparePart">
    <el-row>
      <el-col :span="12" class="col">
        <h1>图片1</h1>
        <canvas
          id="canvasOne"
          ref="canvasOne"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
        <el-button
          @click="
            getImg(1);
            id = 1;
          "
          >上传图片1</el-button
        >
      </el-col>
      <el-col :span="12" class="col">
        <h1>图片2</h1>
        <canvas
          id="canvasTwo"
          ref="canvasTwo"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
        <el-button
          @click="
            getImg(2);
            id = 2;
          "
          >上传图片2</el-button
        >
      </el-col>

      <input
        type="file"
        ref="FileInput"
        @change="readFile($event, id)"
        hidden
      />
    </el-row>
    <el-row>
      <el-button @click="compare">进行对比</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ComparePart",
  data() {
    return {
      base64one: "",
      base64two: "",
      canvasWidth: 300,
      canvasHeight: 300,
      id: "", // 标识要上传的图片是第一个还是第二个图片
      socket: null, // websocket对象
      result: "", // （预留）保存后端传递的结果
      onLoading: false, // 按钮的加载效果
    };
  },
  methods: {
    drawToCanvas(base64, id) {
      let canvas;
      if (id == 1) {
        this.base64one = base64;
        console.log(1, this.base64one);
        canvas = this.$refs.canvasOne;
      } else if (id == 2) {
        this.base64two = base64;
        console.log(2, this.base64two);
        canvas = this.$refs.canvasTwo;
      }
      console.log(canvas);
      var context = canvas.getContext("2d");
      var img = new Image();
      img.src = base64;
      img.onload = function () {
        context.drawImage(img, 0, 0, 300, 300);
      };
    },
    readFile(e, id) {
      var file = e.target.files[0]; // 获取input输入的图片
      // console.log(file)
      if (!/image\/\w+/.test(file.type)) {
        //判断是否图片
        alert("请确保文件为图像类型");
        return false;
      }
      const vc = this; // 函数的this是组件实例对象
      var reader = new FileReader();
      reader.readAsDataURL(file); // 读取图片，读取完成触发下面的回调函数drawToCanvas
      reader.onload = function () {
        // result就是图片的base64
        // reader.onload的this是reader,读取文件结束reader的result属性就是读取的结果
        // console.log(this.result)
        vc.drawToCanvas(this.result, id);
      };
    },
    // 点击按钮可以选择本地图片
    getImg() {
      // id用于区分是第一张图片还是第二张图片
      // 获取input元素
      let inputObj = this.$refs.FileInput;
      inputObj.click();
    },

    // 提交两个图片给后端进行对比
    compare() {
      if (this.base64one == "" || this.base64two == "") {
        alert("您还没有上传照片呢!");
        return false;
      }

      let imgList = [this.base64one, this.base64two];
      let app = this;
      // this.socket.send(imgList) // 这里是设想以一个数组形式传递过去
      axios
        .post("http://localhost:8000/CompareImg", { imgList: imgList })
        .then(function (res) {
          app.showResult(res.data);
          console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 和识别部分一样使用socket,没改动，谭总改一下
    showResult(value) {
      if (value == 1) {
        this.$alert("是同一个人");
      } else if (value == 0) {
        this.$alert("不是同一个人");
      } else if (value == -1) {
        this.$alert("图片不合法");
      }
    },
  },
};
</script>

<style scoped>
.ComparePart {
  width: 100%;
  max-width: 800px;
  margin: 50px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 50px;
}

.el-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-button {
  width: 100px;
  margin-top: 50px;
  margin-bottom: 20px;
}

canvas {
  border: 5px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
