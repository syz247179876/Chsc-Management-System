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
          <el-button type="primary" @click="openAddFreight"
            >添加运费模板</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table :data="freightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" block class="demo-table-expand">
              <p v-if="props.row.is_free">由于包邮,无邮寄信息</p>
              <el-form-item v-else label="邮寄可达地址:">
                <br />
                <div
                  v-for="(freightItem, index) in props.row.freight_items"
                  :key="index"
                >
                  <el-tag
                    type="danger"
                    v-for="(city, indexCity) in freightItem.city.split('-')"
                    :key="indexCity"
                  >
                    {{ city }}
                    <br />
                  </el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          label="运费模板名"
          prop="name"
          width="200px"
        ></el-table-column>
        <el-table-column label="是否包邮" prop="str_is_free">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_free"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="收费类型"
          prop="str_charge_type"
          width="85px"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editFreightbtn(scope.row.pk)"
              >编辑</el-button
            >
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
      <FreightDetail
        :pk="pk"
        :permission="permission"
        @closeDialog="closeDialog"
        :dialogVisible="dialogVisible"
        @refresh="refresh"
      ></FreightDetail>
    </el-card>
  </div>
</template>

<script>
const FreightDetail = () => import('@/components/freight/FreightDetail')
export default {
  name: 'Freight',
  components: { FreightDetail },
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
      dialogVisible: false, // 是否开启弹框
      pk: -1, // 运费模板id
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

    // 打开添加运费模板的dialog
    openAddFreight() {
      this.dialogVisible = true
    },
    // 关闭弹窗，修改状态
    closeDialog() {
      this.dialogVisible = false
    },

    // 刷新数据集
    refresh() {
      this.getFreightList()
    },

    // 进入编辑dialog
    editFreightbtn(id) {
      this.pk = id
      this.dialogVisible = true
    },
  },
}
</script>

<style>
</style>