<template>
  <div class="welcome">
    <h1>欢迎进入商城管理系统欢迎页</h1>
    <h1>系统主要有以下几个方面的功能或特点：</h1>
    <section>
      <ol>
        <li>
          基于RBAC(Role-Based Access
          Control)的访问控制，将权限与角色相关联，赋予角色相应权限，通过给不同用于配置角色实现权限管理
        </li>
        <li>基于Element UI快速搭建的后台界面</li>
        <li>
          商品管理（对商品的参数，类别，商品本身的管理）、订单管理（地址更改、物流查询）
        </li>
        <li>使用echarts对用户来源的一个可视化展示</li>
      </ol>
    </section>
    <h1>gitee地址</h1>
    <section>
      <a href="https://gitee.com/crazybox521/vue-admin" target="_blank"
        >vue后台管理系统</a
      >
    </section>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style>
</style>