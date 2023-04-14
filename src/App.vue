<template>
  <div id="app">
    <!-- 使用布局容器 -->
    <el-container>
      <el-header height="100px">【南华大学夸夸队】安全的人脸识别认证</el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="150px">
          <el-menu
            class="el-menu-vertical-demo"
          >
            <router-link active-class="active" to="/input">
              <el-menu-item>
                <i class="el-icon-menu"></i>录入信息
              </el-menu-item>
            </router-link>
            <router-link active-class="active" to="/recog">
              <el-menu-item>
                <i class="el-icon-menu"></i>人脸识别
              </el-menu-item>
            </router-link>
            <router-link active-class="active" to="/compare">
              <el-menu-item>
                <i class="el-icon-menu"></i>照片对比
              </el-menu-item>
            </router-link>
          </el-menu>
            
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <router-view class="page"></router-view>
        </el-main>
      </el-container>
    </el-container>

    <vue-canvas-nest :config="config" :el="'.el-main'"></vue-canvas-nest>
  </div>
</template>

<script>
import vueCanvasNest from "vue-canvas-nest";

export default {
  name: "App",
  data(){
    return {
      isCollapse: true,
      config:{
        color: "0, 0, 80",
        opacity: 0.5,
        zIndex: 2,
        count: 50,
      }
    }
  },
  components: {vueCanvasNest},
  
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 100px;
  font-size: larger;
}

.el-aside {
  background-color: #e7e7e7;
  color: #333;
}

.el-main {
  background-color: #ffffff;
  color: #333;
}

.page{
  position: relative;
  z-index: 99
}

a{
  /* 去掉下划线 */
  text-decoration: none; 
}

.router-link-active {
  text-decoration: none;
}

vue-canvas-nest{
  border: 0;
}
</style>
