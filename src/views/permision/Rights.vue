<template>
  <div class="rights">
    <!-- 头部  面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column prop="authName" label="权限名"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <div>
              <el-tag v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-backtop target="#app" :bottom="100">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        UP
      </div>
    </el-backtop>
  </div>
</template>

<script>
import { getRightsList } from '../../api/axios.js'
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await getRightsList('list')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      this.$message.success('获取用户列表成功')
    }
  }
}
</script>