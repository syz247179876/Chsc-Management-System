<template>
  <div id="FreightDetail">
    <el-dialog
      title="添加有效SKU"
      :visible.sync="dialogVisible"
      height="100%"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 运费模板表单 -->
      <el-form ref="freightForm" :model="freightForm" label-width="130px">
        <el-form-item label="运费模板名" prop="name">
          <el-input v-model="freightForm.name" placeholder="请输入模板名">
          </el-input>
        </el-form-item>
        <el-form-item label="是否包邮" prop="is_free">
          <el-switch
            v-model="freightForm.is_free"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <div v-if="!freightForm.is_free">
          <el-form-item label="计费类型" prop="charge_type">
            <el-select v-model="freightForm.charge_type" placeholder="请选择">
              <el-option
                v-for="item in chargeType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运费项" prop="name">
            <!-- 运费项子表单 -->
            <div
              v-for="(item, index) in freightForm.freight_items_w"
              :key="index"
            >
              <el-form-item
                label="首件个数"
                :prop="'freight_items_w.' + index + '.first_piece'"
              >
                <el-input-number
                  v-model="freightForm.freight_items_w[index].first_piece"
                  :min="1"
                  :max="999"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label="首件运费价格"
                :prop="'freight_items_w.' + index + '.first_price'"
              >
                <el-input-number
                  v-model="freightForm.freight_items_w[index].first_price"
                  :min="1"
                  :max="999"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label="续件数量"
                :prop="'freight_items_w.' + index + '.continue_piece'"
              >
                <el-input-number
                  v-model="freightForm.freight_items_w[index].continue_piece"
                  :min="1"
                  :max="999"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label="续件运费价格"
                :prop="'freight_items_w.' + index + '.continue_price'"
              >
                <el-input-number
                  v-model="freightForm.freight_items_w[index].continue_price"
                  :min="1"
                  :max="999"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="城市" prop="continue_price">
                <el-tag
                  v-for="(cityName, indexCity) in freightForm.freight_items_w[
                    index
                  ].city"
                  :key="indexCity"
                  closable
                  :disable-transitions="false"
                  @close="deleteTag(cityName, index)"
                >
                  {{ cityName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="city"
                  ref="city"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(index)"
                  @blur="handleInputConfirm(index)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ 添加城市</el-button
                >
              </el-form-item>
              <el-form-item label="是否启用" prop="status">
                <el-switch
                  v-model="freightForm.freight_items_w[index].status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
              <el-button
                class="button-new-tag"
                size="small"
                @click="addFreightItem"
                >+ 运费项</el-button
              >
              <el-button
                class="button-new-tag"
                size="small"
                @click="deleteFreightItem(index)"
                v-if="index > 0"
                >删除</el-button
              >
            </div>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" v-if="pk > 0" @click="update"
            >保 存</el-button
          >
          <el-button type="primary" v-else @click="addFreight"
            >立即 创建</el-button
          >
          <el-button @click="resetForm('freightForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FreightDetail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: Number,
      default: 0,
    },
    pk: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      freightForm: {
        name: '', // 运费模板名
        is_free: true, // 是否免费
        charge_type: '0', // 计费类型
        freight_items_w: [
          // 运费项数组
          {
            first_piece: 0, // 首件个数
            first_price: 0, // 首件运费价格
            continue_piece: 0, // 续件数量
            continue_price: 0, // 续件运费价格
            city: [], // 送货城市
            status: false, // 运费项是否启用
          },
        ],
      },
      chargeType: [
        {
          value: '0',
          label: '按重量',
        },
        {
          value: '1',
          label: '按件数',
        },
        {
          value: '2',
          label: '按体积',
        },
      ], // 计费类型
      inputVisible: false, // 是否显示城市选择栏
      city: '', // 城市
    }
  },
  watch: {
    pk(newValue, oldValue) {
      console.log(newValue, oldValue)
      if (newValue > 0 || newValue === oldValue) {
        this.$http
          .get('/seller/chsc/apis/freight/?pk=' + newValue, {
            headers: { Permission: this.permission },
          })
          .then((res) => {
            let data = res.data
            this.freightForm.name = data.name
            this.freightForm.status = data.status
            this.freightForm.is_free = data.is_free
            this.freightForm.charge_type = data.charge_type
            this.freightForm.freight_items_w = data.freight_items
            this.splitCity() // 拆分city字符串
          })
          .catch((err) => {
            this.$message({
              message: '获取运费模板数据失败',
              showClose: true,
              type: 'error',
            })
          })
      }
    },
  },
  created() {},
  methods: {
    // 添加运费模板
    async addFreight() {
      this.mergeCity() // 合并city
      const res = await this.$http.post(
        '/seller/chsc/apis/freight/',
        this.freightForm,
        {
          headers: { Permission: this.permission },
        }
      )
      if (res.status === 200 && res.data.code === 1049) {
        this.$message({
          message: res.data.msg,
          showClose: true,
          type: 'success',
        })
        this.splitCity() // 拆分
        this.resetForm()
        this.$emit('refresh') // 刷新父组件数据
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
      this.handleClose()
    },

    // 更新运费模板
    async update() {
      // 解析数据

      this.mergeCity() // 合并city
      this.freightForm.pk = this.pk

      const res = await this.$http.put(
        '/seller/chsc/apis/freight/',
        this.freightForm,
        {
          headers: { Permission: this.permission },
        }
      )
      if (res.status === 200 && res.data.code === 1050) {
        this.$message({
          message: res.data.msg,
          showClose: true,
          type: 'success',
        })
        this.splitCity() // 拆分
        this.$emit('refresh') // 刷新父组件数据
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
      // this.resetForm()
      delete this.freightForm.pk // 需要删除pk
      this.handleClose()
    },

    // 添加运费项子表单
    addFreightItem() {
      let data = {
        first_piece: 0,
        first_price: 0,
        continue_piece: 0,
        continue_price: 0,
        city: new Array(),
        status: false,
      }
      if (this.pk > 0) {
        // 处于修改编辑状态
        data.freight = this.pk
        this.$http
          .post('/seller/chsc/apis/freight-item/', data, {
            headers: { Permission: this.permission },
          })
          .then((res) => {
            if (res.status == 200 && res.data.code === 1074) {
              data.city = [] // 设置为空数组
              this.freightForm.freight_items_w.push(data) // 追加一条子表单
            }
          })
          .catch((err) => {
            this.$message({
              message: err,
              showClose: true,
              type: 'error',
            })
          })
      } else {
        this.freightForm.freight_items_w.push(data) // 追加一条子表单
      }
    },

    // 拆分city数组
    splitCity() {
      for (let index in this.freightForm.freight_items_w) {
        // 如果城市字符为空，直接new空数组，否则进行切片
        if (this.freightForm.freight_items_w[index].city == '')
          this.$set(
            this.freightForm.freight_items_w[index],
            'city',
            new Array()
          )
        else
          this.freightForm.freight_items_w[
            index
          ].city = this.freightForm.freight_items_w[index].city.split('-')
      }
    },

    // 合并城市数组
    mergeCity() {
      for (let index in this.freightForm.freight_items_w)
        this.freightForm.freight_items_w[
          index
        ].city = this.freightForm.freight_items_w[index].city.join('-')
    },

    // 删除运费项
    deleteFreightItem(index) {
      this.freightForm.freight_items_w.splice(index, 1)
    },

    // 关闭dialog，发送父组件，修改dialogVisible值为fasle
    handleClose() {
      this.$emit('closeDialog')
    },

    // 点击添加城市，显示选择栏
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        // this.$refs.city.$refs.input.focus()
      })
    },

    // 鼠标移开input标签，调用该函数，加入元素，渲染dom
    handleInputConfirm(index) {
      let cityName = this.city
      console.log(cityName)
      console.log(index)
      if (cityName) {
        this.freightForm.freight_items_w[index].city.push(cityName)
      }
      this.inputVisible = false
      this.city = ''
    },

    // 删除对应运费项中的城市名标签
    deleteTag(tag, index) {
      this.freightForm.freight_items_w[index].city.splice(
        this.freightForm.freight_items_w[index].city.indexOf(tag)
      )
    },

    // 取消
    cancel() {
      this.$emit('closeDialog')
    },

    // 重置
    resetForm(formName = 'freightForm') {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>