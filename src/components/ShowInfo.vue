<template>
  <div>
    <el-descriptions title="请确认信息正确无误">
      <el-descriptions-item label="用户名">{{person.name}}</el-descriptions-item>
      <el-descriptions-item label="性别">{{person.sex}}</el-descriptions-item>
      <el-descriptions-item label="手机号码">{{person.phone}}</el-descriptions-item>
      <el-descriptions-item>人脸图像（缩略图）</el-descriptions-item>

      <template slot="extra">
        <el-button type="primary" @click='upLoad'>确认并上传</el-button>
      </template>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  props: ["person"],
  methods: {
    upload(){
        
    }
  },

};
</script>

<style>
</style>
