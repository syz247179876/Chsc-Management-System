<template>
  <div id="Sku">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Sku管理</el-breadcrumb-item>
      <el-breadcrumb-item>Sku列表</el-breadcrumb-item>
    </el-breadcrumb>
    有效Sku列表管理
    <SkuEfficient
      :skuList="skuList"
      :skuCount="skuCount"
      :commodityList="commodityList"
      :skuPropList="skuPropList"
      @getSkuData="getSkuData"
    ></SkuEfficient>
    Sku类目管理
    <SkuProp
      :skuPropList="skuPropList"
      :skuPropCount="skuPropCount"
      :commodityList="commodityList"
      @getSkuProp="getSkuProp"
    ></SkuProp>
  </div>
</template>

<script>
const SkuEfficient = () => import('@/components/sku/SkuEfficient')
const SkuProp = () => import('@/components/sku/SkuProp')
export default {
  name: 'Sku',
  components: { SkuEfficient, SkuProp },
  data() {
    return {
      permission: 100008,
      skuList: [], // sku有效数据集
      skuCount: 0, // sku有效数据的个数
      commodityList: [], // 当前用户下的商品集
      skuPropList: [], // sku类目属性值数据集
      skuPropCount: 0, // sku类目属性键值对个数
    }
  },
  created() {
    this.getSkuData()
    this.getSkuProp()
  },
  methods: {
    // 获取商家的sku数据
    async getSkuData() {
      const res = await this.$http.get('/seller/chsc/apis/sku/', {
        headers: { Permission: this.permission },
      })
      if (res.status == 200) {
        this.skuList = res.data.data
        this.count = res.data.count
      }
    },

    // 获取sku类目数据
    async getSkuProp() {
      const res = await this.$http.get('/seller/chsc/apis/sku-property/', {
        headers: { Permission: this.permission },
      })
      if (res.status === 200) {
        this.skuPropList = res.data.data
        this.count = res.data.count
        this.commodityList = res.data.commodity
      }
    },
  },
}
</script>

<style>
</style>