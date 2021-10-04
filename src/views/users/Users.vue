<template>
  <div class="users">
    <!-- 头部  面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区 使用element ui卡片 -->
    <el-card class="box-card">
      <!-- 卡片头部按钮区域 -->
      <el-row :gutter="10">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            v-model="keyword"
            @clear="resetTable"
            clearable
            placeholder="请输入内容"
          >
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" @click="queryUser">
            </el-button
          ></el-input>
        </el-col>
        <el-col :span="3">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table stripe border :data="userList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户信息"
              placement="bottom"
            >
              <el-button type="primary" @click="getEditUser(scope.row.id)"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="bottom"
            >
              <el-button type="danger" @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="为用户分配角色"
              placement="bottom"
            >
              <el-button type="warning" @click="handleSetRole(scope.row)"
                >分配角色</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 10, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleCloseDialog('addForm')"
    >
      <!-- 弹出框里嵌入的表单，添加用户 -->
      <el-form
        label-width="80px"
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="addForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="addForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addForm.email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            prefix-icon="el-icon-mobile-phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisibleEdit"
      width="30%"
      @close="handleCloseDialog('editForm')"
    >
      <!-- 弹出框里嵌入的表单，添加用户 -->
      <el-form
        label-width="80px"
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
      >
        <el-form-item label="账号">
          <el-input
            v-model="editForm.username"
            prefix-icon="el-icon-user"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            prefix-icon="el-icon-mobile-phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisibleSetRole"
      width="40%"
      @close="handleSetRoleCloseDialog()"
    >
      <p>当前操作用户：{{ userInfo.username }}</p>
      <p>当前操作用户角色：{{ userInfo.role_name }}</p>
      <el-select v-model="checkedRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSetRole = false">取 消</el-button>
        <el-button type="primary" @click="SetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  setUserState,
  addUser,
  queryUserById,
  editUserSubmit,
  deleteUser,
  getRoles,
  setUserRole
} from '../../api/axios.js'
export default {
  name: 'Users',
  data() {
    /* 手机的正则 */
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      /* 分页以及搜索的参数 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      /* 用户列表 */
      userList: [],
      /* 用户总数 */
      total: 0,
      /* 搜索关键字 */
      keyword: '',
      /* 添加用户信息对话框的状态 */
      dialogVisible: false,
      /* 添加用户的信息 */
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      /* 添加用户的验证 */
      addFormRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: validateMobile, trigger: ['blur', 'change'] }]
      },
      /* 编辑用户对话框状态 */
      dialogVisibleEdit: false,
      /* 编辑用户的信息 */
      editForm: {},
      /* 编辑的验证 */
      editFormRules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: validateMobile, trigger: ['blur', 'change'] }]
      },
      /* 分配角色 用户的信息 */
      userInfo: {},
      /* 分配角色对话框状态 */
      dialogVisibleSetRole: false,
      checkedRoleId: '',
      rolesList: []
    }
  },
  watch: {
    /* 监测分页信息的变化，变化后发出请求 请求数据*/
    queryInfo: {
      deep: true,
      handler() {
        this.getUser()
      }
    }
  },
  /* 组件实例创建成功后发起请求获取用户列表 */
  created() {
    this.getUser()
  },
  methods: {
    async handleDelete(id) {
      /* 成功返回confirm 失败返回cancel */
      const result = await this.$confirm(
        '此操作将永久删除该账号, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await deleteUser(id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUser()
    },
    /* 修改完成的回调 */
    handleEdit() {
      this.$refs['editForm'].validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await editUserSubmit(this.editForm)
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getUser()
          this.dialogVisibleEdit = false
        }
      })
    },
    /* 获取修改用户的信息 */
    async getEditUser(id) {
      const { data: res } = await queryUserById(id)
      if (res.meta.status !== 200) return this.$messge.error('查询失败')
      this.editForm = res.data
      this.dialogVisibleEdit = true
      console.log(res.data)
      console.log(this)
    },
    /* 监听关闭对话框的事件 */
    handleCloseDialog(formName) {
      this.$refs[formName].resetFields()
    },
    /* 添加用户的回调 */
    addUser() {
      this.$refs['addForm'].validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await addUser(this.addForm)
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getUser()
          this.dialogVisible = false
        }
      })
    },
    /* 清空输入框的回调，重置表格数据 */
    resetTable() {
      this.queryInfo.query = ''
    },
    /* 搜索按钮的回调，给query参数赋值，模糊查询 */
    queryUser() {
      this.queryInfo.query = this.keyword
    },
    /* 修改状态 */
    async stateChange(info) {
      const { data: res } = await setUserState(info.id, info.mg_state)
      if (res.meta.status !== 200) return this.$message.error('修改状态失败')
      this.$message({
        type: 'success',
        message: '修改状态成功'
      })
    },
    /* 获取用户列表的信息 */
    async getUser() {
      const { data: res } = await getUsers(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户数据失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    /* 改变分页大小的回调 */
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
    },
    /* 改变当前页的回调 */
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
    },
    async handleSetRole(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await getRoles()
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')

      this.rolesList = res.data

      this.dialogVisibleSetRole = true
    },
    /* 关闭分配角色对话框的回调 */
    handleSetRoleCloseDialog() {
      this.userInfo = {}
      this.checkedRoleId = ''
    },
    /* 提交分配角色的回调 */
    async SetRole() {
      if (this.checkedRoleId == '') return this.$message.error('请选择权限')
      const { data: res } = await setUserRole(
        this.userInfo.id,
        this.checkedRoleId
      )
      if (res.meta.status !== 200) return this.$message.error('设置失败')
      this.$message.success('设置成功')

      this.getUser()
      this.dialogVisibleSetRole = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>