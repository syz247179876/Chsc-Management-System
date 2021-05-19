<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
        <!-- 行展开 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" block>
              <el-form-item label="商品名:">
                <span>{{ props.row.commodity_name }}</span>
              </el-form-item>
              <el-form-item label="商品参数:">
                <el-tag
                  class="tag"
                  v-if="props.row.spu == null || props.row.spu == ''"
                >
                  该商品暂无任何参数
                </el-tag>
                <el-tag
                  class="tag"
                  v-else
                  v-for="(spu, index) in props.row.spu.split('-')"
                  :key="index"
                >
                  {{ spu }}
                </el-tag>
              </el-form-item>
              <el-form-item label="商品详情:">
                <div v-html="props.row.details"></div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="commodity_name"
          width="200px"
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

        <el-table-column label="库存量" prop="stock" width="190px">
        </el-table-column>
        <el-table-column label="简要介绍" prop="intro"> </el-table-column>
        <el-table-column label="是否上架" prop="status" width="120px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
            ></el-switch>
          </template>
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
  created() {
    this.getGoodList()
  },

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

  methods: {
    // 获取商品列表数据
    async getGoodList() {
      const res = await this.$http.get('/seller/chsc/apis/commodity/', {
        headers: { Permission: this.permission },
      })
      if (res.status != 200) return this.$message.error('获取商品列表失败')
      this.goodList = res.data.data
      this.count = res.data.count
    },

    // 监听每页显示多少条数据的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 监听当前页码的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodList()
    },

    // 删除商品变化
    async deleteGoodsBtn(gid) {
      // 确认是否删除
      const deleteResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 取消了删除
      if (deleteResult != 'confirm') return this.$message.info('取消了删除')
      // 确认了删除
      let data = {
        pk_list: [gid],
      }
      this.$http
        .delete('/seller/chsc/apis/commodity/', {
          data: data,
          headers: { Permission: this.permission },
        })
        .then((res) => {
          if (res.status === 200 && res.data.code === 1076) {
            // 成功删除
            this.$message.success('删除成功')
            this.getGoodList()
          } else {
            this.$message.error(res.data.detail)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 添加商品按钮
    addGoods() {
      this.$router.push({ name: 'AddGoods' })
    },
  },
}
</script>

<style scoped>
.tag {
  font-size: 18px;
  margin-left: 10px;
  margin-bottom: 8px;
}
</style>
