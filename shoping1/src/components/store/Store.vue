<template>
  <div id="Store">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
      <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户信息" name="sellerInfo">
          <SellerInfo
            :sellerInfo="sellerInfo"
            :permission="permission"
          ></SellerInfo>
        </el-tab-pane>
        <el-tab-pane label="店铺信息" name="sellerStore">
          <SellerStore
            :sellerStore="sellerStore"
            :permission="permission"
          ></SellerStore>
        </el-tab-pane>
        <el-tab-pane label="角色信息" name="sellerRole">
          <SellerRole
            :sellerRole="sellerRole"
            :permission="permission"
          ></SellerRole
        ></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
const SellerStore = () => import('@/components/store/SellerStore')
const SellerInfo = () => import('@/components/user/SellerInfo')
const SellerRole = () => import('@/components/power/SellerRole')
export default {
  name: 'Store',
  components: { SellerInfo, SellerRole, SellerStore },
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表总数
      total: 0,
      permission: 100002,
      count: 0,
      activeName: 'sellerInfo',
      sellerRole: {}, // 商家角色信息
      sellerStore: {}, // 商家店铺信息
      sellerInfo: {}, // 商家信息
    }
  },
  created() {
    this.getSellerStoreInfo()
  },
  methods: {
    // 获取商家店铺+角色+个人信息
    async getSellerStoreInfo() {
      const res = await this.$http.get('/seller/chsc/apis/store/', {
        headers: { Permission: this.permission },
      })
      if (res.status === 200) {
        let data = res.data
        this.sellerInfo = data.user
        this.sellerStore = data.store
        this.sellerRole = data.role
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style>
</style>