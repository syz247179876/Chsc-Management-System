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
      <el-form ref="skuForm" :model="skuForm" label-width="80px">
        <el-form-item label="商品" prop="commodity">
          <el-select v-model="skuForm.commodity" placeholder="请选择商品">
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
          <el-input v-model="skuForm.price" placeholder="0.01"></el-input>
        </el-form-item>
        <el-form-item lang="sku优惠价" prop="favourable_price">
          <el-input
            v-model="skuForm.favourable_price"
            placeholder="0.01"
          ></el-input>
        </el-form-item>

        <el-form-item label="sku有效属性值" prop="properties_w">
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
            >+ 点击添加</el-button
          >

          <el-form-item lang="sku库存" prop="stock">
            <el-input v-model="skuForm.stock" placeholder="0"></el-input>
          </el-form-item>

          <el-form-item lang="sku状态" prop="status">
            <el-input v-model="skuForm.status" placeholder="0"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button @click="resetForm('skuPropForm')">重置</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SkuEffcientDetail',
  props: {},
  data() {
    return {
      skuForm: {
        commodity: 0, // 商品id
        name: '', // sku名
        status: true, // sku状态
        sid: '', // sku中类目值id所组成的字符串
        price: 0, // sku中的原价
        favourable_price: 0, // sku中的优惠价
        properties_w: {}, // sku类目值
        stock: 0, // sku当前库存
      },
    }
  },
  methods: {
    // 关闭dialog，发送父组件，修改dialogVisible值为fasle
    handleClose() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style>
</style>