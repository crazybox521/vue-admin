<template>
  <el-container class="home-container">
    <!-- 页面头部区域 -->
    <el-header>
      <!-- logo区域 -->
      <div :style="{ cursor: 'pointer' }" class="header-logo" @click="toHome">
        <span>依云商城后台管理</span>
      </div>
      <div class="btn-wrap">
        <span style="margin: 10px">欢迎您 , {{ userName }}</span>
        <el-button  @click="logout" type="warning">注销登录</el-button>
        <el-button type="info" icon="el-icon-setting" @click="$router.push('/settings')"></el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 页面左侧导航栏 -->
      <el-aside :width="asideWidth">
        <div class="btn-collapse-wrapper">
          <el-button
            type="primary"
            class="btn-collapse"
            @click="handleCollapse"
          >
            <i v-show="isCollapse" class="el-icon-arrow-right"></i>
            {{ textCollapse }}
          </el-button>
        </div>
        <!-- 页面左侧导航栏菜单 -->
        <el-menu
          :collapse-transition="false"
          unique-opened
          background-color="#fff"
          text-color="#000"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :default-active="activeIndex"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <el-menu-item
                @click="saveActive(item.path)"
                :index="item.path"
                v-for="item in menu.children"
                :key="item.id"
                class="aside-menu-item"
                ><i class="el-icon-menu"></i>{{ item.authName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域右侧内容区域 -->
      <el-main class="home-main">
        <router-view></router-view>
        <el-backtop target=".home-main"></el-backtop>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getPermission } from '../api/user'
export default {
  name: 'Home',
  data() {
    return {
      /* 左侧导航权限列表 */
      menuList: [],
      /* 导航对应图标 */
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-key',
        101: 'el-icon-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-data-analysis'
      },
      /* 是否折叠菜单 */
      isCollapse: true,
      /* 当前激活菜单 */
      activeIndex: '',
      userName: ''
    }
  },
  computed: {
    /* 折叠按钮的文本 */
    textCollapse() {
      return this.isCollapse ? '' : '收起'
    },
    /* 右侧菜单的宽度，根据是否折叠控制 */
    asideWidth() {
      return this.isCollapse ? '65px' : '200px'
    }
  },
  created() {
    /* 请求导航列表信息 */
    this.getMunuList()
    /* 请求激活的导航信息 从sessionStorage */
    this.activeIndex = sessionStorage.getItem('index')
      ? sessionStorage.getItem('index')
      : ''
    /* 获取local中的是否折叠选项，只要不是true都设为false */
    this.isCollapse =
      localStorage.getItem('isCollapse') === 'true' ? true : false
    this.userName = sessionStorage.getItem('userName')
  },
  methods: {
    toHome() {
      console.log(this.$route.path)
      if (this.$route.path !== '/Welcome') this.$router.push('/Welcome')
    },
    /* 保存导航的激活状态 */
    saveActive(val) {
      this.activeIndex = val
      sessionStorage.setItem('index', val)
    },
    /* 处理折叠按钮点击事件 */
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      localStorage.setItem('isCollapse', this.isCollapse)
    },
    /* 获取列表数据 */
    getMunuList() {
      /* 调用封装的api */
      getPermission().then((res) => {
        const data = res.data
        if (data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.menuList = data.data
      })
    },
    /* 处理注销登录按钮点击事件 */
    logout() {
      this.$confirm('将注销此次登录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '成功退出登录!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
/* 整个首页样式 */
.home-container {
  height: 100%;
}
/* 头部区域样式 */
.el-header {
  background-image: linear-gradient(#00bcd4, #2196f3);
  color: #fff;
  text-align: center;
  line-height: 8vh;
  height: 8vh !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* logo区域样式 */
  .header-logo {
    height: 100%;
    /* logo文本的样式 */
    span {
      font-size: 28px;
      font-weight: bold;
    }
  }
}

/* 左侧导航区域 */
.el-aside {
  background-color: #fff;
  /* 折叠按钮区域 */
  .btn-collapse-wrapper {
    height: 40px;
    line-height: 40px;
    /* 折叠按钮 */
    .btn-collapse {
      width: 100%;
    }
  }
}

/* 内容区域 */
.home-main {
  /* background-color: #e9eef3; */
  color: #333;
  width: 100%;
  height: 92vh;
  overflow-y: auto;
}
</style>