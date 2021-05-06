<template>
  <div id="SkuEffcientDetail">
    <el-dialog
      title="添加有效SKU"
      :visible.sync="dialogVisible"
      height="100%"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 有效Sku表单 -->
      <el-form ref="skuForm" :model="skuForm" label-width="130px">
        <el-form-item label="商品" prop="commodity">
          <el-select
            v-model="skuForm.commodity"
            filterable
            placeholder="请选择商品"
          >
            <el-option
              v-for="item in commodityList"
              :key="item.pk"
              :label="item.commodity_name"
              :value="item.pk"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类目名" prop="name">
          <el-input
            v-model="skuForm.name"
            placeholder="卡其色4XL码潮流的男士衬衫"
          ></el-input>
        </el-form-item>
        <el-form-item label="sku原价" prop="price">
          <el-input-number
            v-model="skuForm.price"
            :percision="2"
            :step="0.1"
            :min="0.01"
            :max="9999999"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="sku优惠价" prop="favourable_price">
          <el-input-number
            v-model="skuForm.favourable_price"
            placeholder="0.01"
            :precision="2"
            :step="0.1"
            :min="0.01"
            :max="9999999"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="sku有效属性值" prop="properties_w">
          <el-select
            v-model="skuValues"
            multiple
            placeholder="请选择sku类目属性"
            filterable
          >
            <el-option-group
              v-for="group in skuPropList"
              :key="group.pk"
              :label="group.name"
            >
              <el-option
                v-for="item in group.values"
                :key="item.pk"
                :label="item.value"
                :value="group.name + ':' + item.value + ':' + item.pk"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="sku库存" prop="stock">
          <el-input-number
            v-model="skuForm.stock"
            placeholder="1"
            :precision="0"
            :step="1"
            :min="1"
            :max="999999"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="sku状态" prop="status">
          <el-switch v-model="skuForm.status"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-if="pk > 0" @click="update"
            >保 存</el-button
          >
          <el-button type="primary" v-else @click="create">立即 创建</el-button>
          <el-button @click="resetForm('skuForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SkuEffcientDetail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    commodityList: {
      type: Array,
      default: new Array(),
    },
    permission: {
      type: Number,
      default: 0,
    },
    skuPropList: {
      type: Array,
      default: new Array(),
    },
    pk: {
      type: Number,
      default: -1,
    },
  },
  watch: {
    // 当pk传进来的是正数，表示编辑，先请求获取该数据
    pk(newValue, oldValue) {
      if (newValue > 0) {
        // 根据id获取对应类目数据，替换skuPropForm和skuValues
        this.$http
          .get('/seller/chsc/apis/sku/?pk=' + newValue, {
            headers: { Permission: this.permission },
          })
          .then((res) => {
            let data = res.data
            this.skuForm.sid = data.sid
            this.skuForm.name = data.name
            this.skuForm.status = data.status
            this.skuForm.price = data.price
            this.skuForm.favourable_price = data.favourable_price
            this.skuForm.commodity = data.cid
            this.properties_w = data.properties_r
            this.skuForm.stock = data.stock
            this.sidList = data.sid.split('-')
            this.skuValues = []
            let index = 0

            // 生成已选的类目属性键值对数据
            for (let key in data.properties_r) {
              this.skuValues.push(
                key + ':' + data.properties_r[key] + ':' + this.sidList[index]
              )
              index += 1
            }
          })
          .catch((err) => {
            this.$message({
              message: '获取sku数据失败',
              showClose: true,
              type: 'error',
            })
          })
      }
    },
  },
  data() {
    return {
      skuForm: {
        commodity: '', // 商品id
        name: '', // sku名
        status: true, // sku状态
        sid: '', // sku中类目值id所组成的字符串
        price: 0, // sku中的原价
        favourable_price: 0, // sku中的优惠价
        properties_w: {}, // sku类目值
        stock: 0, // sku当前库存
      },
      skuValues: [], // sku类目值数组
      inputVisible: false, // 是否显示输入框
      skuValue: '', // sku类目值
    }
  },
  methods: {
    // 关闭dialog，发送父组件，修改dialogVisible值为fasle
    handleClose() {
      this.$emit('closeDialog')
    },

    // 创建数据
    async create() {
      let data = {
        price: this.skuForm['price'],
        favourable_price: this.skuForm['favourable_price'],
        status: this.skuForm['status'],
        commodity: this.skuForm['commodity'],
        stock: this.skuForm['stock'],
        name: this.skuForm['name'],
      }
      let properties = {} // sku属性键值对map
      let sidList = [] // sid列表
      for (let index in this.skuValues) {
        let skuProp = this.skuValues[index].split(':')
        properties[skuProp[0]] = skuProp[1]
        sidList.push(skuProp[2])
      }
      data['properties_w'] = properties
      data['sid'] = sidList.join('-')
      // 发送创建有效sku请求
      const res = await this.$http.post('/seller/chsc/apis/sku/', data, {
        headers: { Permission: 100008 },
      })
      if (res.status === 200 && res.data.code === 1066) {
        this.$message({
          message: '创建成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('refresh') // 再次请求数据进行刷新
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
      this.resetForm('skuForm')
      this.$emit('closeDialog')
    },

    // 更新数据
    async update() {
      let data = {
        pk: this.pk,
        price: this.skuForm['price'],
        favourable_price: this.skuForm['favourable_price'],
        status: this.skuForm['status'],
        commodity: this.skuForm['commodity'],
        stock: this.skuForm['stock'],
        name: this.skuForm['name'],
      }
      let properties = {} // sku属性键值对map
      let sidList = [] // sid列表
      for (let index in this.skuValues) {
        let skuProp = this.skuValues[index].split(':')
        properties[skuProp[0]] = skuProp[1]
        sidList.push(skuProp[2])
      }
      data['properties_w'] = properties
      data['sid'] = sidList.join('-')
      // 发送更新有效sku请求
      const res = await this.$http.put('/seller/chsc/apis/sku/', data, {
        headers: { Permission: 100008 },
      })
      if (res.status === 200 && res.data.code === 1066) {
        this.$message({
          message: '更新成功',
          showClose: true,
          type: 'success',
        })
        this.$emit('refresh') // 再次请求数据进行刷新
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
      this.$emit('closeDialog')
    },

    // 关闭弹窗
    cancel() {
      this.$emit('closeDialog')
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style>
</style>