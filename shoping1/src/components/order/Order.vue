<template>
  <div id="Order">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="deleteOrder">删除订单</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table
        :data="orderList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index"></el-table-column>
        <!-- 行展开功能 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" block class="demo-table-expand">
              <el-form-item label="订单号:">
                <span>{{ props.row.commodity_name }}</span>
              </el-form-item>
              <el-form-item label="商品名称:">
                <span>{{ props.row.commodity_name }}</span>
              </el-form-item>
              <el-form-item label="订单状态:">
                <span>{{ props.row.status }}</span>
              </el-form-item>
              <el-form-item label="是否审核:">
                <span>{{
                  props.row.is_checked == 'False' ? '未审核' : '已接单'
                }}</span>
              </el-form-item>
              <el-form-item label="订单有效期:">
                <span>{{ props.row.efficient_time }}</span>
              </el-form-item>
              <el-form-item label="收货人:">
                <span>{{ props.row.recipient }}</span>
              </el-form-item>
              <el-form-item label="收货地址:">
                <span>{{
                  props.row.province.split('/').join(' ') + props.row.region
                }}</span>
              </el-form-item>
              <el-form-item label="收货人电话:">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="订单商品价格:">
                <span>{{ props.row.sku_favourable_price }}</span>
              </el-form-item>
              <el-form-item label="订单商品属性:">
                <span>{{ props.row.sku_properties }}</span>
              </el-form-item>
              <el-form-item label="订单商品名称:">
                <span>{{ props.row.sku_name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="order_id"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="commodity_name"
          width="85px"
        ></el-table-column>
        <el-table-column
          label="订单状态"
          prop="status"
          width="85px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="efficient_time"
          sortable
          width="170px"
        >
        </el-table-column>
        <el-table-column label="sku属性" prop="sku_properties" width="150px">
        </el-table-column>
        <el-table-column label="sku名称" prop="sku_name" width="150px">
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="deleteGoodsBtn(scope.row.pk)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        :background="true"
      >
      </el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Order',
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      orderList: [],
      permission: 100002,
      count: 0,
      multipleSelection: [], // 订单复选框
    }
  },
  created() {
    this.getOrderSeller()
  },
  methods: {
    // 异步获取订单数据
    async getOrderSeller() {
      const res = await this.$http.get('/order/chsc/apis/order/seller/')
      if (res.status === 200) {
        this.orderList = res.data.data
        this.count = res.data.count
      }
    },

    // 勾选/取消复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 群删除订单
    async deleteOrder() {
      let data = []
      for (let i in this.multipleSelection) {
        data.push(this.multipleSelection[i].pk)
      }
      const res = await this.$http.delete(
        '/order/chsc/apis/order/delete-multiple/',
        { data: { pk_list: data, identity: 1 } }
      )
      this.getOrderSeller()
    },

    // 单删订单
    async deleteGoodsBtn(id) {
      const res = await this.$http.delete(
        '/order/chsc/apis/order/' + id + '/?identity=1'
      )
      if (res.status === 200 && res.data.code === 1018) {
        this.$message({
          message: '删除成功',
          type: 'success',
        })
        this.getOrderSeller()
      } else {
        this.$message({
          message: '删除失败',
          type: 'fail',
        })
      }
    },
  },
}
</script>

<style lang="less" scope>
</style>