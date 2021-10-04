<template>
  <el-container class="home-container">
    <!-- 页面头部区域 -->
    <el-header>
      <!-- logo区域 -->
      <div class="header-logo">
        <img src="../assets/logo.png" alt="logo.png" /><span>后台管理系统</span>
      </div>
      <el-button type="danger" plain @click="logout">注销登录</el-button>
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
          background-color="#545c64"
          text-color="#fff"
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
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getPermission } from '../api/axios'
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
      activeIndex: ''
    }
  },
  computed: {
    /* 折叠按钮的文本 */
    textCollapse() {
      return this.isCollapse ? '' : '折叠'
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
    /* 获取session中的是否折叠选项，只要不是true都设为false */
    this.isCollapse =
      sessionStorage.getItem('isCollapse') === 'true' ? true : false
  },
  methods: {
    /* 保存导航的激活状态 */
    saveActive(val) {
      this.activeIndex = val
      sessionStorage.setItem('index', val)
    },
    /* 处理折叠按钮点击事件 */
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      sessionStorage.setItem('isCollapse', this.isCollapse)
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
  background-color: #393d49;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* logo区域样式 */
  .header-logo {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* logo图片的样式 */
    img {
      height: 100%;
    }
    /* logo文本的样式 */
    span {
      color: #e9eef3;
      font-size: 28px;
      font-weight: bold;
    }
  }
  /* 头部区域注销登录按钮 */
  .el-button {
    height: 50px;
  }
}

/* 左侧导航区域 */
.el-aside {
  background-color: #545c64;
  text-align: center;
  line-height: 200px;
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
.el-main {
  background-color: #e9eef3;
  color: #333;
  width: 100%;
}

/* 二级菜单样式 */
.aside-menu-item {
  padding: 0;
  min-width: 199px;
}
</style>