<template>
  <div id="SkuEfficient">
    <!-- 卡片视图区域 -->
    <div class="card">
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
        <el-col :span="3">
          <el-button type="primary" @click="openAddSku"
            >为商品添加Sku</el-button
          >
        </el-col>
        <el-col :span="3">
          <el-button type="danger" @click="deleteSku">删除Sku</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table
        :data="skuList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index"></el-table-column>
        <!-- 行展开功能 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" block class="demo-table-expand">
              <el-form-item label="所属商品:">
                <span>{{ props.row.commodity_name }}</span>
              </el-form-item>
              <el-form-item label="sku名称:">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="sku图片:">
                <span><img :src="props.row.image" /></span>
              </el-form-item>
              <el-form-item label="sku类目:">
                <br />
                <div
                  v-for="(value, key, index) in props.row.properties_r"
                  :key="index"
                >
                  {{ index + 1 }}: &nbsp;{{ key }}:
                  <el-tag>{{ value }}</el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          label="商品名"
          prop="commodity_name"
          sortable
        ></el-table-column>
        <el-table-column label="sku名称" prop="name"></el-table-column>
        <el-table-column
          label="sku原价"
          prop="price"
          width="85px"
          sortable
        ></el-table-column>
        <el-table-column
          label="sku优惠价"
          prop="favourable_price"
          width="85px"
          sortable
        ></el-table-column>
        <el-table-column label="sku库存" prop="stock" width="190px" sortable>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editSkuBtn(scope.row.pk)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="deleteSkuBtn(scope.row.pk)"
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
      <SkuEffcientDetail
        :dialogVisible="dialogVisible"
        :commodityList="commodityList"
        :permission="permission"
        :skuPropList="skuPropList"
        :pk="pk"
        @closeDialog="closeDialog"
        @refresh="refresh"
      ></SkuEffcientDetail>
    </div>
  </div>
</template>

<script>
const SkuEffcientDetail = () => import('@/components/sku/SkuEffcientDetail')
export default {
  name: 'SkuEfficient',
  components: { SkuEffcientDetail },
  props: {
    skuList: {
      type: Array,
      default: new Array(),
    },
    skuCount: {
      type: Number,
      default: 0,
    },
    commodityList: {
      type: Array,
      default: new Array(),
    },
    skuPropList: {
      type: Array,
      default: new Array(),
    },
  },
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
      permission: 100008,
      count: 0,
      multipleSelection: [], // sku复选框
      dialogVisible: false, // dialog状态
      pk: -1, // sku的id
    }
  },
  created() {},
  methods: {
    // 勾选/取消复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 群删Sku
    async deleteSku() {
      let data = []
      for (let i in this.multipleSelection) {
        data.push(this.multipleSelection[i].pk)
      }
      const res = await this.$http.delete('/seller/chsc/apis/sku/', {
        data: { pk_list: data },
        headers: { Permission: this.permission },
      })
      if (res.status === 200 && res.data.code === 1065) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('getSkuData')
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },

    // 单删sku
    async deleteSkuBtn(id) {
      let data = []
      data.push(id)
      const res = await this.$http.delete('/seller/chsc/apis/sku/', {
        data: { pk_list: data },
        headers: { Permission: this.permission },
      })
      if (res.status === 200 && res.data.code === 1065) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('getSkuData')
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },

    // 修改sku类目数据
    editSkuBtn(id) {
      this.pk = id
      this.dialogVisible = true
    },

    // 弹出增加sku弹框
    openAddSku() {
      this.dialogVisible = true
    },

    // 关闭弹窗，修改状态
    closeDialog() {
      this.dialogVisible = false
    },

    // 刷新数据集
    refresh() {
      this.$emit('getSkuData')
    },
  },
}
</script>

<style>
</style>