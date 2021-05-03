<template>
  <el-container class="home_container">
    <!-- 顶部 -->
    <el-header>
      <!-- 顶部右侧图标和文字 -->
      <div>
        <img src="../assets/images/logo.png" alt="" />
        <span>电商管理后台系统</span>
      </div>
      <!-- 顶部退出登录按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 内容侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏卷边按钮 -->
        <div class="Collapebtn" @click="isCollapseBtn">|||</div>
        <!-- 侧边栏一级菜单 -->
        <el-menu
          background-color="#869A78"
          text-color="#EEE3D9"
          active-text-color="#F5D17A"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :unique-opened="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.pk + ''"
            v-for="(item, index) in menusList"
            :key="index"
          >
            <template slot="title">
              <!-- 菜单图标 -->
              <i :class="iconObj[index]"></i>
              <!-- 菜单文本 -->
              <span @click="toAction(item.pid)">{{ item.name }}</span>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.geMenustList()
    // 刷新页面左侧菜单，当前激活的菜单高亮保持
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 菜单列表数据
      menusList: [],
      // 一级菜单图标对象
      iconObj: {
        0: 'iconfont icon-users',
        1: 'iconfont icon-tijikongjian',
        2: 'iconfont icon-shangpin',
        3: 'iconfont icon-danju',
        4: 'iconfont icon-baobiao',
        5: 'iconfont icon-shangpin',
        6: 'iconfont icon-danju',
        7: 'iconfont icon-baobiao',
      },
      urlConfig: {
        100001: 'Order',
        100002: 'Good',
        100005: 'Store',
        100007: 'Freight',
        100008: 'Sku',
      },
      // 卷边按钮 默认不卷边
      isCollapse: false,
      // 保存激活的链接地址
      activePath: '',
    }
  },
  methods: {
    // 退出登录方法
    logout: function () {
      //清除token
      window.sessionStorage.clear()
      // 编程式导航跳转到登录页面
      this.$router.push('/login')
    },
    // 获取菜单列表方法
    async geMenustList() {
      const { data: res } = await this.$http.get('/seller/chsc/apis/menu/')
      // 将获取的菜单数组赋值给menusList数组
      this.menusList = res.role.permission
      // console.log(this.menusList)
    },
    // 卷边按钮方法
    isCollapseBtn: function () {
      this.isCollapse = !this.isCollapse
    },
    // 保存激活的链接，刷新页面当前激活的菜单高亮保持
    saveActiveStatus: function (activePath) {
      // 刷新页面
      window.sessionStorage.setItem('activePath', activePath)
      // 切换页面
      this.activePath = activePath
    },

    // 点击不同选项进入响应界面
    toAction(pid) {
      this.$router.push({ name: this.urlConfig[pid] })
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #869a78;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 25px;
  padding-left: 5px;
  .el-button {
    background-color: #f4ce7c;
  }
  div {
    display: flex;
    align-items: center;

    img {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.el-aside {
  span {
    font-size: 20px;
  }
  i {
    color: #f4ce7c;
  }
  .el-menu {
    border-right: none;
  }
  background-color: #869a78;
  .Collapebtn {
    background-color: #abbc98;
    color: #f4ce7c;
    text-align: center;
    line-height: 21.25px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.iconfont {
  padding-right: 5px;
}

.el-main {
  background-color: #cadad9;
}
</style>
