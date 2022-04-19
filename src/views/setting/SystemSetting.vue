<template>
  <div class="system-setting">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="form" :model="form">
        <el-form-item label="系统组件视觉大小">
          <el-radio-group v-model="form.eleSize">
            <el-radio-button label="medium">正常</el-radio-button>
            <el-radio-button label="small">小号</el-radio-button>
            <el-radio-button label="mini">超小号</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收起导航菜单">
          <el-switch v-model="form.isCollapse"></el-switch>
        </el-form-item>
        <el-form-item label="主页显示疫情地图">
          <el-switch v-model="form.showMap"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存并应用</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        eleSize: '',
        isCollapse: false,
        showMap: true
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form.eleSize = localStorage.getItem('eleSize')
        ? localStorage.getItem('eleSize')
        : 'medium'
      this.form.isCollapse =
        localStorage.getItem('isCollapse') === 'true' ? true : false
      this.form.showMap =
        localStorage.getItem('showMap') === 'false' ? false : true
    },
    onSubmit() {
      localStorage.setItem('eleSize', this.form.eleSize)
      localStorage.setItem('isCollapse', this.form.isCollapse)
      localStorage.setItem('showMap', this.form.showMap)
      window.location.reload()
    }
  }
}
</script>

<style>
</style>