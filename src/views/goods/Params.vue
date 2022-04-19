<template>
  <!-- 商品参数页 -->
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
          <!-- 商品分类的级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cataList"
            :props="cascaderProps"
            @change="CateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 参数和属性的tab页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="openAddView"
            
            >添加动态参数</el-button
          >
          <!-- 动态参数的数据表格 -->
          <el-table :data="manyTabData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <!-- 展开项，动态参数的标签 -->
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable=""
                  >{{ item }}</el-tag
                >
                <!-- 添加标签的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加标签的按钮 -->
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
                  @click="paramsEdit(scope.row)"
                  
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="paramsDel(scope.row)"
                  
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
                  @click="paramsEdit(scope.row)"
                  
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="paramsDel(scope.row)"
                  
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
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
        <el-button type="primary" @click="handleAddParam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数名称 -->
    <el-dialog
      :title="'修改' + tabName"
      :visible.sync="dialogVisibleEdit"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item :label="tabName" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editParamSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCataList,
  getParamsList,
  addParam,
  delParam,
  queryParamById,
  editParam
} from '../../api/goods'
export default {
  name: 'Params',
  data() {
    return {
      /* 商品分类数据 */
      cataList: [],
      /* 级联选择器配置 */
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      /* 级联选择器的值 */
      selectedKeys: [],
      /* 当前tab */
      activeName: 'many',
      /* 动态参数 */
      manyTabData: [],
      /* 静态属性 */
      onlyTabData: [],
      /* 添加参数或属性对话框的状态 */
      dialogVisibleAdd: false,
      /* 添加对话框表单的数据 */
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      /* 编辑参数或属性对话框的状态 */
      dialogVisibleEdit: false,
      /* 编辑参数名称的数据 */
      editForm: {
        attr_id: 0,
        cat_id: 0,
        attr_sel: '',
        attr_name: ''
      },
      editRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    /* 添加属性/参数按钮的开启状态 */
    isBtnDisabled() {
      return this.selectedKeys.length === 3 ? false : true
    },
    /* 级联选择器选中分类的ID */
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    },
    /* 当前tab页 */
    tabName() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    /* 获取商品列表 */
    async getCateList() {
      const { data: res } = await getCataList({})
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cataList = res.data
    },
    /* 级联选择器change事件 */
    CateChange() {
      if (this.cateId == null) {
        this.selectedKeys = []
        return
      }
      this.getParamsList()
    },
    /* 切换tab页 */
    handleTabClick() {
      if (this.cateId != null) {
        this.getParamsList()
      }
    },
    /* 获取参数/属性信息 */
    async getParamsList() {
      /* 根据当前tab页查询对应数据 */
      const { data: res } = await getParamsList(this.cateId, this.activeName)
      if (res.meta.status !== 200)
        return this.$message.error(`获取${this.tabName}失败`)
      this.$message.success(`获取${this.tabName}成功`)
      console.log(res.data);
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
    /* 添加参数按钮的回调 */
    openAddView() {
      this.dialogVisibleAdd = true
    },
    /* 添加参数提交的回调 */
    handleAddParam() {
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

    /* 添加tag的回调 */
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /* 添加标签的输入框失去焦点或回车的回调 */
    handleInputConfirm(row) {
      let inputValue = row.inputValue
      if (inputValue.trim()) {
        row.attr_vals.push(inputValue)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    /* 编辑按钮回调 */
    async paramsEdit(row) {
      const { data: res } = await queryParamById(row.cat_id, row.attr_id)
      if (res.meta.status !== 200) this.$message.error('获取失败')
      this.editForm = res.data
      this.dialogVisibleEdit = true
    },
    /* 编辑提交回调 */
    editParamSub() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await editParam(
          this.editForm.cat_id,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.editForm.attr_sel
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getParamsList()
        this.dialogVisibleEdit = false
      })
    },
    /* 删除按钮回调，删除参数/属性 */
    async paramsDel(row) {
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
      const { data: res } = await delParam(row.cat_id, row.attr_id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getParamsList()
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
  width: 200px;
  margin: 5px 5px 5px 0;
  vertical-align: bottom;
}
</style>