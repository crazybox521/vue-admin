<template>
  <!-- 商品添加页 -->
  <div class="add-good">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        center
        title="添加商品信息"
        type="info"
        effect="dark"
        :closable="false"
      >
      </el-alert>
      <!-- 进度条 -->
      <el-steps
        :active="activeIndex - 0"
        align-center
        class="add-steps"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 整个添加商品信息的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <!-- 添加商品区域不同内容的tab页 -->
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息页 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="goods_cat">
              <!-- 级联选择器选择分类 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cataList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader
            ></el-form-item>
          </el-tab-pane>
          <!-- 参数页 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="val"
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 属性页 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片页 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传组件 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 富文本编辑器内容页 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button class="btn-addgood" type="primary" @click="addGood"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog title="预览图片" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
/* 引入api请求 */
import { getCataList, getParamsList,addGood } from '../../api/axios'
/* 引入lodash */
import _ from 'lodash'
export default {
  name: 'AddGood',
  data() {
    return {
      /* tab及进度条激活项 */
      activeIndex: 0,
      /* 添加数据 */
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      /* 商品分类数据 */
      cataList: [],
      /* 级联选择器配置 */
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      /* 动态参数列表 */
      manyTableData: [],
      onlyTableData: [],
      /* 上传图片的地址 */
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      dialogVisible: false
    }
  },
  methods: {
    /* 获取分类数据 */
    async getCatasList() {
      const { data: res } = await getCataList({})
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cataList = res.data
    },
    /* 处理分类级联选择器值change事件 */
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    /* tab页离开前的钩子 */
    beforeTabLeave(active, old) {
      if (old === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    /* 处理tab点击事件 */
    async tabClicked() {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await getParamsList(
          this.addForm.goods_cat[2],
          'many'
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取动态参数失败')
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        console.log(res.data)

        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await getParamsList(
          this.addForm.goods_cat[2],
          'only'
        )
        if (res.meta.status !== 200)
          return this.$message.error('获取动态参数失败')
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    /* 处理图片预览事件 */
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    /* 处理图片移除事件 */
    handleRemove(file) {
      console.log(file)
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex((item) => {
        item.pic = filePath
      })
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm.pics)
    },
    /* 处理图片上传成功事件 */
    handleSuccess(res) {
      console.log(res)
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    /* 添加商品的回调 */
    addGood() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请检查必填项是否填写完整！')
        /* 深拷贝添加的数据 */
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        /* 处理动态参数和静态属性 */
        this.manyTableData.forEach((item) => {
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }

          this.addForm.attrs.push(newAttr)
        })
        this.onlyTableData.forEach((item) => {
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newAttr)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        /* 发起添加商品的请求 */
        const {data:res} =await addGood(form)
        if(res.meta.status!==201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    },
    
  
  },
  created() {
    this.getCatasList()
  }
}
</script>

<style lang="less" scoped>
/* 进度条 */
.add-steps {
  margin: 20px auto;
}
/* 复选框 */
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
/* 预览图片 */
.previewImg {
  width: 100%;
}
/* 添加商品按钮 */
.btn-addgood {
  margin-top: 10px;
}
</style>