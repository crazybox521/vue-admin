<template>
  <div class="orders">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            @clear="getOrdersList"
            clearable
            placeholder="请输入内容"
          >
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            >
            </el-button
          ></el-input>
        </el-col>
      </el-row>
      <!-- 订单数据表格 -->
      <el-table stripe border :data="ordersList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="bottom"
            >
              <el-button type="primary" @click="dialogVisiableAddress = true"
                >修改地址</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看物流"
              placement="bottom"
            >
              <el-button type="success" @click="openProgressView"
                >查看物流</el-button
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
    <el-dialog
      title="修改地址信息"
      :visible.sync="dialogVisiableAddress"
      width="50%"
      @close="handleCloseDialog('addressForm')"
    >
      <!-- 弹出框里嵌入的表单，修改地址 -->
      <el-form
        label-width="80px"
        ref="addressForm"
        :model="addressForm"
        :rules="addressFormRules"
      >
        <el-form-item label="地址" prop="address1">
          <!-- 地址的级联选择器 -->
          <el-cascader
            :options="cityOptions"
            v-model="addressForm.address1"
            change-on-select
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input
            v-model="addressForm.address2"
            prefix-icon="el-icon-location"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiableAddress = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisiableProgress"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
/* 引入省市数据 */
import cityOptions from '../../utils/city_data2017_element'
/* 模拟的物流信息 */
import wuliu from '../../assets/json/wuliu.json'
import { getOrders } from '../../api/axios'
export default {
  name: 'Orders',
  data() {
    return {
      /* 分页信息 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      /* 订单数据 */
      ordersList: [],
      /* 修改地址对话框数据 */
      dialogVisiableAddress: false,
      /* 修改地址相关数据 */
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      /* 地址信息 */
      cityOptions: cityOptions,
      /* 物流信息对话框 */
      dialogVisiableProgress: false,
      /* 物流进度条 */
      progressData: wuliu
    }
  },
  created() {
    this.getOrdersList()
    console.log(wuliu)
  },
  methods: {
    /* 获取订单数据 */
    async getOrdersList() {
      const { data: res } = await getOrders(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取订单失败')
      this.total = res.data.total
      this.ordersList = res.data.goods
    },
    /* 分页大小变化的回调 */
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    /* 页码变化的回调 */
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    /* 重置表单 */
    handleCloseDialog(formName) {
      this.$refs[formName].resetFields()
    },
    /* 打开物流信息对话框 */
    async openProgressView() {
      this.dialogVisiableProgress = true
    }
  }
}
</script>

<style>
</style>