<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        :closable="false"
        type="warning"
        show-icon
      ></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cataList"
            :props="cascaderProps"
            @change="CateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="openAddView"
            size="mini"
            >添加动态参数</el-button
          >
          <el-table :data="manyTabData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable=""
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>

            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  @click="handleManyTabEdit(scope.row.id)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleManyTabDel(scope.row.id)"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="openAddView"
            size="mini"
            >添加静态属性</el-button
          >
          <el-table :data="onlyTabData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable=""
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                ></template
              >
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>

            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  @click="handleManyTabEdit(scope.row.id)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="handleManyTabDel(scope.row.id)"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + tabName"
      :visible.sync="dialogVisibleAdd"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item :label="tabName" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAddParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCataList, getParamsList, addParam } from '../../api/axios.js'
export default {
  name: 'Params',
  data() {
    return {
      cataList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      dialogVisibleAdd: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled() {
      return this.selectedKeys.length === 3 ? false : true
    },
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    },
    tabName() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await getCataList({})
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cataList = res.data
    },
    async CateChange() {
      this.getParamsList()
    },
    handleTabClick() {
      if (this.cateId != null) {
        this.getParamsList()
      }
    },
    async getParamsList() {
      const { data: res } = await getParamsList(this.cateId, this.activeName)
      if (res.meta.status !== 200)
        return this.$message.error(`获取${this.tabName}失败`)
      this.$message.success(`获取${this.tabName}成功`)
      res.data.forEach((item) => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      if (this.activeName == 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    openAddView() {
      this.dialogVisibleAdd = true
    },
    handleAddParams() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await addParam(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsList()
        this.dialogVisibleAdd = false
      })
    },
    handleClose() {},

    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      let inputValue = row.inputValue
      if (inputValue) {
        row.attr_vals.push(inputValue)
      }
      row.inputVisible = false
      row.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
.button-new-tag {
  margin-left: 5px;
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 5px;
  vertical-align: bottom;
}
</style>