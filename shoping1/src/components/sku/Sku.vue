<template>
  <div id="Sku">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Sku管理</el-breadcrumb-item>
      <el-breadcrumb-item>Sku列表</el-breadcrumb-item>
    </el-breadcrumb>
    有效Sku列表管理
    <SkuEfficient></SkuEfficient>
    Sku类目管理
    <SkuProp></SkuProp>
  </div>
</template>

<script>
const SkuEfficient = () => import('@/components/sku/SkuEfficient')
const SkuProp = () => import('@/components/sku/SkuProp')
export default {
  name: 'Sku',
  components: { SkuEfficient, SkuProp },
}
</script>

<style>
</style>