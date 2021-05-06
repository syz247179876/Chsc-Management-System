<template>
  <div id="SellerStore">
    <div class="card">
      <el-form
        ref="sellerStore"
        :model="sellerStore"
        label-width="150px"
        :label-position="labelPosition"
      >
        <el-form-item label="店铺名">
          <el-input v-model="sellerStore.name" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="店铺类型">
          <el-input
            v-model="sellerStore.type"
            style="width: 150px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺介绍">
          <el-input
            v-model="sellerStore.intro"
            type="textarea"
            :rows="4"
            maxlength="50"
            show-word-limit
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺积分">
          <el-input-number
            v-model="sellerStore.integral"
            :disabled="true"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="店铺是否被审核">
          <el-switch v-model="sellerStore.is_checked" disabled></el-switch>
        </el-form-item>

        <el-form-item label="店铺logo">
          <el-avatar
            shape="square"
            :size="100"
            :src="sellerStore.logo"
          ></el-avatar>
        </el-form-item>
        <el-form-item label="店铺描述评分">
          <el-rate
            v-model="sellerStore.description_score"
            disabled
            show-score
            text-color="#ff9900"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="店铺服务评分">
          <el-rate
            v-model="sellerStore.service_score"
            disabled
            show-score
            text-color="#ff9900"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="店铺物流评分">
          <el-rate
            v-model="sellerStore.logistics_score"
            disabled
            show-score
            text-color="#ff9900"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="店铺所在地">
          <el-cascader
            v-model="sellerStore.province"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import citydata from '@/utils/citydata'
export default {
  name: 'SellerStore',
  props: {
    sellerStore: {
      type: Object,
      default: new Object(),
    },
    permission: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        id: '', // 店铺id
        type: '', // 店铺类型
        name: '', // 店铺名
        intro: '', // 店铺介绍
        integral: 0, // 店铺积分
        is_checked: true, // 账户是否校验过
        logo: '', // 店铺logo
        description_score: 0, // 描述评分
        service_score: 0, // 服务评分
        logistics_score: 0, // 物流评分
        province: [], // 店铺所在地数组
      },
      labelPosition: 'left', // 标签对齐方式
      citydata, // 地区数据
    }
  },
  watch: {
    sellerInfo() {
      console.log(55555)
    },
  },
  mounted() {
    this.sellerStore.description_score = parseFloat(
      this.sellerStore.description_score
    )
    this.sellerStore.logistics_score = parseFloat(
      this.sellerStore.logistics_score
    )
    this.sellerStore.service_score = parseFloat(this.sellerStore.service_score)
    this.sellerStore.province = this.sellerStore.province.split('/')
  },
  methods: {
    // 保存当前数据
    async save() {
      let data = {
        pk: this.sellerStore.id,
        name: this.sellerStore.name,
        intro: this.sellerStore.intro,
        province: this.sellerStore.province.join('/'),
      }
      const res = await this.$http.put('/seller/chsc/apis/info/store/', data, {
        headers: { Permission: this.permission },
      })

      if (res.status === 200 && res.data.code === 1072) {
        this.$message({
          message: '更新成功',
          showClose: true,
          type: 'success',
        })
      } else {
        this.$message({
          message: res.data.detail,
          showClose: true,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style scoped>
.long {
  width: 250px;
}
</style>