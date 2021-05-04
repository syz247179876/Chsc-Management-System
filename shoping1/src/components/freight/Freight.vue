<template>
  <div id="Freight">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运费管理</el-breadcrumb-item>
      <el-breadcrumb-item>运费列表</el-breadcrumb-item>
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
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table :data="freightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="运费模板名" prop="name"></el-table-column>
        <el-table-column
          label="是否免运费"
          prop="str_is_free"
          width="85px"
        ></el-table-column>
        <el-table-column
          label="收费类型"
          prop="str_charge_type"
          width="85px"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="deleteFreightBtn(scope.row.pk)"
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
  name: 'Freight',
  data() {
    return {
      // 查询商品列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      freightList: [],
      // 商品列表总数
      total: 0,
      permission: 100007,
      count: 0,
    }
  },
  created() {
    this.getFreightList()
  },
  methods: {
    // 获取运费模板数据
    async getFreightList() {
      const res = await this.$http.get('/seller/chsc/apis/freight/', {
        headers: { Permission: this.permission },
      })
      if (res.status != 200) return this.$message.error('获取商品列表失败')
      this.freightList = res.data.data
      this.count = res.data.count
    },

    // 删除制定运费模板
    async deleteFreightBtn(id) {
      let data = []
      data.push(id)
      const res = await this.$http.delete('/seller/chsc/apis/freight/', {
        data: { pk_list: data },
        headers: { Permission: this.permission },
      })
      if (res.status === 200 && res.data.code === 1051) {
        this.$message({
          message: '删除成功',
          type: 'success',
        })
        this.getFreightList()
      } else {
        this.$message({
          message: res.data.detail,
          type: 'fail',
        })
      }
    },
  },
}
</script>

<style>
</style>