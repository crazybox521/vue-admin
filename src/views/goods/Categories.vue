<template>
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
        <template v-slot:isOk="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
            class="el-icon-success"
          ></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>
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
        <template v-slot:option="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </zk-table>

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
  </div>
</template>

<script>
import { getCataList, addCate } from '../../api/axios.js'
export default {
  name: 'Categories',
  data() {
    return {
      cataList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
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
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: []
    }
  },
  created() {
    this.getCatasList()
  },
  methods: {
    async getCatasList() {
      const { data: res } = await getCataList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cataList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newVal) {
      this.queryInfo.pagesize = newVal
      this.getCatasList()
    },
    handleCurrentChange(newVal) {
      this.queryInfo.pagenum = newVal
      this.getCatasList()
    },
    showAddCateView() {
      this.getParentCateList()
      this.dialogVisibleAdd = true
    },
    async getParentCateList() {
      const { data: res } = await getCataList({ type: 2 })
      if (res.meta.status1 == 200)
        return this.$message.error('获取父级列表失败')
      this.parentCateList = res.data
    },
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
    addCate() {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await addCate(this.addCateForm)
        if (res.meta.stagtitus !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.dialogVisibleAdd = false
        this.getCatasList()
      })
    },
    resetAddform() {
      this.$refs['addCateForm'].resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
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