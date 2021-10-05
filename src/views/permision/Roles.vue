<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['border-bottom']"
              v-for="item1 in scope.row.children"
              :key="item1.id"
              class="vcenter"
            >
              <!-- 1级菜单展开列 -->
              <el-col :span="5">
                <el-tag @close="removePermi(scope.row, item1.id)" closable>{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 2 3级菜单展开列-->
              <el-col :span="19">
                <el-row
                  :class="['border-bottom']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <!-- 二级菜单展开列 -->
                  <el-col :span="6">
                    <el-tag
                      @close="removePermi(scope.row, item2.id)"
                      closable
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单展开列 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removePermi(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="280px">
          <!-- 行操作 -->
          <template v-slot="scope">
            <div>
              <el-button type="primary" @click="editRole(scope.row.id)"
                >编辑</el-button
              >
              <el-button type="danger">删除</el-button>
              <el-button type="warning" @click="openSetRightsView(scope.row)"
                >分配权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="40%"
      @close="resetCheckedKey"
    >
      <!-- 权限列表树形控件 -->
      <el-tree
        node-key="id"
        default-expand-all
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        :data="rightsList"
        :props="defaultProps"
        ref="rightsTree"
      ></el-tree>
      <!-- 权限列表按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* 分别引入axios请求封装体 */
import {
  getRoles,
  deleteRoleRight,
  getRightsList,
  setRoleRight
} from '../../api/axios.js'
export default {
  name: 'Roles',
  data() {
    return {
      /* 角色列表 children中包含该角色的权限*/
      rolesList: [],
      /* 控制对话框状态 */
      setRightsDialogVisible: false,
      /* 所有权限列表 */
      rightsList: [],
      /* 树形控件需要的配置 */
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      /* 分配权限列表中该角色拥有的权限  */
      defaultCheckedKeys: [],
      editingRoleId: ''
    }
  },
  methods: {
    /* 获取角色列表，包括该角色的一二三级权限列表 */
    async getRolesList() {
      const { data: res } = await getRoles()
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
      this.$message.success('获取角色列表成功')
    },
    /* 移除某一角色的某一权限，标签关闭的回调 */
    async removePermi(role, rightId) {
      const result = await this.$confirm(
        '此操作将移除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (result !== 'confirm') return this.$message.info('取消删除')

      const { data: res } = await deleteRoleRight(role.id, rightId)
      if (res.meta.status !== 200) return this.$message.error('移除失败')

      this.$message.success('移除成功')

      role.children = res.data
    },
    /* 打开分配权限对话框，并获取全部权限列表，设置默认选中的权限，分配权限按钮的回调 */
    async openSetRightsView(role) {
      const { data: res } = await getRightsList('tree')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      this.editingRoleId = role.id
      this.getDefaultCheckedKeys(role, this.defaultCheckedKeys)
      this.setRightsDialogVisible = true
    },
    /* 关闭对话框后清空check数据 */
    resetCheckedKey() {
      this.defaultCheckedKeys = []
    },

    /* 递归获取三级菜单的id */
    getDefaultCheckedKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getDefaultCheckedKeys(item, arr))
    },
    /* 分配权限对话框确认按钮回调 */
    async submitSetRights() {
      const keys = [
        /* 获取半选中的节点的key 即id  */
        ...this.$refs.rightsTree.getHalfCheckedKeys(),
        /* 获取全选中的节点的key 即id  */
        ...this.$refs.rightsTree.getCheckedKeys()
      ]
      /* 将数组元素转化为以,分隔的字符串 */
      const keysStr = keys.join(',')
      const { data: res } = await setRoleRight(this.editingRoleId, keysStr)
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.getRolesList()
      this.setRightsDialogVisible = false
      this.$message.success('分配权限成功')
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 6px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>