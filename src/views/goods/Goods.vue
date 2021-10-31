<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            @clear="resetTable"
            clearable
            placeholder="请输入内容"
          >
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" @click="queryGood">
            </el-button
          ></el-input>
        </el-col>
        <el-col :span="3">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="goAddPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table stripe border :data="goodsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑商品信息"
              placement="bottom"
            >
              <el-button
                type="primary"
                @click="openEditView(scope.row.goods_id)"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除商品"
              placement="bottom"
            >
              <el-button type="danger" @click="delGood(scope.row.goods_id)"
                >删除</el-button
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
        :page-sizes="[2, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    
  </div>
</template>

<script>
import { getGoodsList, deleteGood } from '../../api/axios'
export default {
  name: 'Goods',
  data() {
    return {
      /* 分页信息 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      /* 商品数据 */
      goodsList: [],
      /* 添加相关数据和状态 */
      
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    /* 获取商品列表数据 */
    async getGoods() {
      const { data: res } = await getGoodsList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品数据失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    /* 分页大小变化的回调 */
    handleSizeChange(newVal) {
      this.queryInfo.pagesize = newVal
      this.getGoods()
    },
    /* 当前页变化的回调 */
    handleCurrentChange(newVal) {
      this.queryInfo.pagenum = newVal
      this.getGoods()
    },
    /* 搜索商品 */
    queryGood() {
      this.getGoods()
    },
    /* 清除搜索 */
    resetTable() {
      this.getGoods()
    },
    async delGood(id) {
      const result = await this.$confirm(
        '此操作将删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (result !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await deleteGood(id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getGoods()
    },
    openEditView(id) {
      console.log(id)
    },goAddPage(){
      this.$router.push('/addgood')
    }
  }
}
</script>

<style>
</style>