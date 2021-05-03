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
      <!-- 搜索框和添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="commodity_name"
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="price"
          width="85px"
        ></el-table-column>
        <el-table-column
          label="优惠价"
          prop="favourable_price"
          width="85px"
        ></el-table-column>
        <el-table-column label="简要介绍" prop="intro" width="190px">
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="deleteGoodsBtn(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        :background="true"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Store',
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodList: [],
      // 商品列表总数
      total: 0,
      permission: 100002,
      count: 0,
    }
  },
}
</script>

<style>
</style>