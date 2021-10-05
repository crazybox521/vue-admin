<template>
  <div class="reports">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 830px; height: 550px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
import { getReportsdata } from '../../api/axios'
export default {
  name: 'reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    const { data: res } = await getReportsdata()
    if (res.meta.status !== 200)
      return this.$message.error('获取折线图数据失败')

    var myChart = echarts.init(document.getElementById('main'))

    const myOption = _.merge(res.data, this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(myOption)
  }
}
</script>

<style>
</style>