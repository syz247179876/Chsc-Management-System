<template>
  <div id="SkuProp">
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
          <el-button type="primary" @click="addSkuProp">添加Sku类目</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" @click="deleteSkuProp"
            >删除Sku类目</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <el-table
        :data="skuPropList"
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
              <el-form-item label="sku类目:">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="sku类目值:">
                <el-tag
                  v-for="(value, index) in props.row.values"
                  :key="index"
                  class="tag"
                  type="warning"
                >
                  {{ value.value }}
                </el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          label="sku类目所属商品"
          prop="commodity_name"
          width="160px"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="sku类目"
          prop="name"
          width="120px"
          sortable
        ></el-table-column>
        <el-table-column label="sku类目属性值">
          <template slot-scope="props">
            <el-tag
              v-for="(value, index) in props.row.values"
              :key="index"
              class="tag"
            >
              {{ value.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editSkuPropBtn(scope.row.pk)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="deleteSkuPropBtn(scope.row.pk)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SkuPropDetail
      :dialogVisible="dialogVisible"
      :commodityList="commodityList"
      :permission="permission"
      :pk="pk"
      @closeDialog="closeDialog"
      @refresh="refresh"
    ></SkuPropDetail>
  </div>
</template>

<script>
const SkuPropDetail = () => import('@/components/sku/SkuPropDetail')
export default {
  name: 'SkuProp',
  props: {
    skuPropList: {
      type: Array,
      default: new Array(),
    },
    skuPropCount: {
      type: Number,
      default: 0,
    },
    commodityList: {
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
      dialogVisible: false, // 显示弹框
      pk: -1, // sku类目id值
    }
  },
  components: { SkuPropDetail },
  created() {},
  methods: {
    // 勾选/取消复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单删sku类目数据
    async deleteSkuPropBtn(id) {
      let data = []
      data.push(id)
      const res = await this.$http.delete('seller/chsc/apis/sku-property/', {
        data: { pk_list: data },
        headers: { Permission: this.permission },
      })
      if (res.status === 200 && res.data.code === 1051) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('getSkuProp')
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },

    // 添加Sku类目，显示弹框
    async addSkuProp() {
      this.dialogVisible = true
    },

    // 删除Sku类目
    async deleteSkuProp() {
      let data = []
      for (let i in this.multipleSelection) {
        data.push(this.multipleSelection[i].pk)
      }
      const res = await this.$http.delete('seller/chsc/apis/sku-property/', {
        data: { pk_list: data },
        headers: { Permission: this.permission },
      })
      if (res.status === 200 && res.data.code === 1051) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('getSkuProp')
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },

    // 修改sku类目数据
    editSkuPropBtn(id) {
      this.pk = id
      this.dialogVisible = true
    },
    // 关闭dialog
    closeDialog() {
      this.dialogVisible = false
    },

    // 刷新数据集
    refresh() {
      this.$emit('getSkuProp')
    },
  },
}
</script>

<style scoped>
.tag {
  margin-left: 10px;
}
</style>