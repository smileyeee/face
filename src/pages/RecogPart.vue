<template>
  <!-- 人脸识别部分的大组件 -->
  <div class="RecogPart">
    <el-row class="box" :gutter="20">
      <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
      <i class="iconfont icon-renlianshibie_o"></i>
    </el-row>
    <el-row slot="footer" :gutter="20">
      <el-button ref="btn" class="btn" @click="startRecog" icon="el-icon-upload2" size="big" type="primary"
        :loading="onLoading">
        {{ onLoading ? '识别中' : '开始识别' }}
      </el-button>

      <el-button @click="showResult(true)">认证成功</el-button>
      <el-button @click="showResult(false)">认证失败</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "RecogPart",
  data() {
    return {
      imgSrc: "",
      thisVideo: null, // 播放器窗口
      videoWidth: 700,
      videoHeight: 600,
      socket: null, // websocket对象
      result: "tzzz", // （预留）一个数据保存后端传递的结果
      onLoading: false, // 按钮的加载效果
      timer:'',
    };
  },
  methods: {
    // 调用摄像头权限
    getCompetence() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.thisVideo = document.getElementById("videoCamera");
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)",
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.thisVideo) {
              _this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream);
            }
            _this.thisVideo.onloadedmetadata = function () {
              _this.thisVideo.play();
            };
          })
          .catch(() => {
            this.$notify({
              title: "警告",
              message: "没有开启摄像头权限或浏览器版本不兼容.",
              type: "warning",
            });
          });
      });
    },
    //关闭摄像头
    stopNavigator() {
      if (this.thisVideo && this.thisVideo !== null) {
        this.thisVideo.srcObject.getTracks()[0].stop();
        this.open = true; //切换成打开摄像头
      }
    },
    // websocket创建
    socketInit() {
      const app = this;
      // 创建socket
      this.socket = new WebSocket("ws://127.0.0.1:8000/face/Test/"); // 地址
      console.log(this.socket);

      // 连接成功后的回调函数
      this.socket.onopen = function () {
        console.log("客户端连接成功");
        // 向服务器发送消息
        // this.socket.send();
      };

      // 从服务器接受到信息时的回调函数
      this.socket.onmessage = function (e) {
        console.log("收到服务器响应", e.data);
        this.result = e.data.data; //
        if(e.data.type==0)
          if (e.data.flag == 1)
          {
            app.showResult(true)
          }
          else {
            app.showResult(false)
          }  
        
        clearInterval(app.timer)
        console.log(app.timer)
      };

      // 连接关闭后的回调函数
      this.socket.onclose = function () {
        console.log("关闭客户端连接");
      };

      // 连接失败后的回调函数
      this.socket.onerror = function () {
        console.log("连接失败了");
      };
    },
    // 获取video当前画面
    getImg() {
      const video = document.getElementById('videoCamera');
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      const img = canvas.toDataURL('image/png', 1)
      return img
    },
    // 识别，一直发送base64给后端，直到后端有回复
    startRecog() {
      this.result = null
      
      if (this.socket == null) {
        this.socketInit()
      }

      this.onLoading = true; // 显示按钮的加载效果
      this.timer= setInterval(this.sendImg,16)

      // let i = 0;
      // console.log(this.result,i)
      // // 一帧一帧不停地发,接收到结果，result就不为空，然后结束this.result != null
      // while (this.result != 'null' && i < 20) {
      //   let img = this.getImg()
      //   let imgBase64 = img.replace(/^data:image\/(png|jpg);base64,/, "") // base64数据
      //   this.socket.send(imgBase64)
      //   // console.log(this.result,i)
      //   //console.log(imgBase64) // 测试了，可以获取到base64
      //   i++
      // }

      this.onLoading = false; // 清除按钮的加载效果
    },
    sendImg()
    {
      let img = this.getImg()
      let imgBase64 = img.replace(/^data:image\/(png|jpg);base64,/, "") // base64数据
      this.socket.send(imgBase64)
    },
    // 处理结果
    showResult(value) {
      if (value == true) {
        // 认证成功
        this.$alert("您好, "+this.result, "认证成功", {
          confirmButtonText: "确定",
          center: true
          
        });
      } else {
        // 认证失败, 可能是因为使用了不安全的图片，也可能是因为没有录入
        this.$alert("可能是因为使用了不安全的图片，也可能是因为没有录入", "认证失败", {
          confirmButtonText: "好吧",
          center: true,
          roundButton: true
        });
      }
    },

  },
  created() {
    this.getCompetence(); // 打开摄像头
    this.socketInit(); // 创建socket
  },
  beforeDestroy() {
    this.stopNavigator();
  },
};
</script>

<style scoped>
.RecogPart {
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  flex-direction: column;
}

.box {
  margin-top: 50px;
  margin-bottom: 100px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-content: center;
}

.footer {
  height: 100px;
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-content: center;
}

.footer .btn {
  margin: 0 300px;
}

.canvas {
  border: 10px solid #e8e8e8;
}

.iconfont{
  font-size: 500px;
  color: rgba(0, 0, 0, 0.2);
}

i{
  position: absolute;
  top: 50%;
  translate: 0 -50%;
}
</style>
