<template>
  <!-- 商品分类页 -->
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateView"
            >添加商品分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类树形表格区域 -->
      <zk-table
        :show-row-hover="false"
        class="treeTable"
        :data="cataList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 有效状态列 -->
        <template v-slot:isOk="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
            class="el-icon-success"
          ></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>
        <!-- 列表级别列 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template v-slot:option="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </zk-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      @close="resetAddform"
      title="添加分类"
      :visible.sync="dialogVisibleAdd"
      width="50%"
    >
      <el-form
        ref="addCateForm"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器选择分类 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更新分类的对话框 -->
    <el-dialog
      @close="resetform('editCateForm')"
      title="更新分类名称"
      :visible.sync="dialogVisibleEdit"
      width="50%"
    >
      <el-form
        ref="editCateForm"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCateSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCataList,
  addCate,
  deleteCate,
  queryCateById,
  editCate
} from '../../api/axios.js'
export default {
  name: 'Categories',
  data() {
    return {
      /* 列表数据 */
      cataList: [],
      /* 分页信息 */
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      /* 树形表格的列配置 */
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      /* 添加分类对话框的状态及数据 */
      dialogVisibleAdd: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      /* 添加分类对话框的父级分类数据 */
      parentCateList: [],
      /* 级联选择器的配置 */
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      /* 添加时选择的分类 */
      selectedKeys: [],
      /* 编辑分类的数据 */
      dialogVisibleEdit: false,
      editCateForm: {
        cat_name: '',
        cat_pid: 0
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatasList()
  },
  methods: {
    /* 请求商品列表数据 */
    async getCatasList() {
      const { data: res } = await getCataList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cataList = res.data.result
      this.total = res.data.total
    },
    /* 分页大小变化的回调 */
    handleSizeChange(newVal) {
      this.queryInfo.pagesize = newVal
      this.getCatasList()
    },
    /* 当前页变化的回调 */
    handleCurrentChange(newVal) {
      this.queryInfo.pagenum = newVal
      this.getCatasList()
    },
    /* 添加分类按钮的回调，打开对话框 */
    showAddCateView() {
      this.getParentCateList()
      this.dialogVisibleAdd = true
    },
    /* 添加对话框打开时，获取父级分类 */
    async getParentCateList() {
      addCate
      const { data: res } = await getCataList({ type: 2 })
      if (res.meta.status1 == 200)
        return this.$message.error('获取父级列表失败')
      this.parentCateList = res.data
    },
    /* 级联选择器数据变化的回调 */
    parentCateChange() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        let len = this.selectedKeys.length
        this.addCateForm.cat_pid = this.selectedKeys[len - 1]
        this.addCateForm.cat_level = len
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    /* 添加对话框确认按钮的回调 */
    addCate() {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await addCate(this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.dialogVisibleAdd = false
        this.getCatasList()
      })
    },
    /* 清除表单验证 */
    resetform(formName) {
      this.$refs[formName].resetFields()
    },
    /* 关闭添加对话框的回调 */
    resetAddform() {
      this.resetform('addCateForm')
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    /* 删除分类按钮的回调 */
    async handleDelete(obj) {
      const result = await this.$confirm(
        '此操作将删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (result !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await deleteCate(obj.cat_id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除' + obj.cat_name + '成功')
      this.getCatasList()
    },
    /* 编辑按钮的回调，打开对话框，并获取数据 */
    async handleEdit(obj) {
      const { data: res } = await queryCateById(obj.cat_id)
      if (res.meta.status !== 200)
        return this.$message.error('获取编辑信息失败')
      this.editCateForm = res.data
      this.dialogVisibleEdit = true
    },
    /* 编辑对话框确认按钮的回调 */
    async editCateSub() {
      const { data: res } = await editCate(
        this.editCateForm.cat_id,
        this.editCateForm.cat_name
      )
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.getCatasList()
      this.dialogVisibleEdit = false
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>