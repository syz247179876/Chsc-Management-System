<template>
  <div id="SkuPropDetail">
    <el-dialog
      title="添加Sku类目"
      :visible.sync="dialogVisible"
      height="100%"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 表单 -->
      <el-form ref="skuPropForm" :model="skuPropForm" label-width="80px">
        <el-form-item label="商品" prop="commodity">
          <el-select
            v-model="skuPropForm.commodity"
            placeholder="请选择活动区域"
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
            v-model="skuPropForm.name"
            placeholder="内存大小"
          ></el-input>
        </el-form-item>
        <el-form-item label="类目值" prop="sku_values">
          <el-tag
            v-for="(value, index) in skuValues"
            :key="index"
            closable
            :disable-transitions="false"
            @close="deleteTag(value)"
          >
            {{ value }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="skuValue"
            ref="skuValue"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ New Tag</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="resetForm('skuPropForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SkuPropDetail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: true,
    },
    commodityList: {
      type: Array,
      default: new Array(),
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
      // sku类目表单数据
      skuPropForm: {
        commodity: '',
        sku_values: '', // sku属性值列表
        name: '', // sku类目名
      },
      skuValues: [], // sku类目值数组
      inputVisible: false, // 是否显示输入框
      skuValue: '', // sku类目值
    }
  },
  watch: {
    pk(newValue, oldValue) {
      if (newValue > 0) {
        // 根据id获取对应类目数据，替换skuPropForm和skuValues
        this.$http
          .get('/seller/chsc/apis/sku-property/?pk=' + newValue, {
            headers: { Permission: this.permission },
          })
          .then((res) => {
            let data = res.data
            this.skuPropForm.pk = data.pk
            this.skuPropForm.name = data.name
            for (let index in data.values) {
              this.skuValues.push(data.values[index].value)
            }
            this.skuPropForm.sku_values = data.values
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
  methods: {
    // 关闭dialog，发送父组件，修改dialogVisible值为fasle
    handleClose() {
      this.$emit('closeDialog')
    },
    // 取消按钮
    cancel() {
      this.$emit('closeDialog')
    },
    // 确认保存按钮，避免回调地狱
    async save() {
      let data = {
        commodity: this.skuPropForm['commodity'],
        name: this.skuPropForm['name'],
        sku_values: this.skuValues,
      }
      const res = await this.$http.post(
        '/seller/chsc/apis/sku-property/',
        data,
        {
          headers: { Permission: 100008 },
        }
      )
      if (res.status === 200 && res.data.code === 1049) {
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
      this.$emit('closeDialog')
    },

    // 删除类目值标签
    deleteTag(tag) {
      this.skuValues.splice(this.skuValues.indexOf(tag), 1)
    },

    // 点击btn，显示输入框
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.skuValue.$refs.input.focus()
      })
    },

    // 鼠标移开input标签，调用该函数，加入元素，渲染dom
    handleInputConfirm() {
      let skuValue = this.skuValue
      if (skuValue) {
        this.skuValues.push(skuValue)
      }
      this.inputVisible = false
      this.skuValue = ''
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped>
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