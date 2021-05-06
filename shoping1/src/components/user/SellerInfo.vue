<template>
  <div id="SellerInfo">
    <div class="card">
      <el-form ref="sellerInfo" :model="sellerInfo" label-width="150px">
        <el-form-item label="用户名">
          <el-input
            v-model="sellerInfo.username"
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-avatar
            shape="square"
            :size="100"
            :src="sellerInfo.head_image"
          ></el-avatar
        ></el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="sellerInfo.email" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="sellerInfo.phone" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="是否是商家">
          <el-switch v-model="sellerInfo.is_seller" disabled></el-switch>
        </el-form-item>
        <el-form-item label="帐号是否激活">
          <el-switch v-model="sellerInfo.is_active" disabled></el-switch>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="sellerInfo.sex">
            <el-radio label="m">男</el-radio>
            <el-radio label="f">女</el-radio>
            <el-radio label="s">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="sellerInfo.birthday"
            style="width: 200px"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开店日期">
          <el-input
            v-model="sellerInfo.date_joined"
            disabled
            style="width: 200px"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerInfo',
  props: {
    sellerInfo: {
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
        username: '',
        full_name: '',
        email: '',
        phone: '',
        is_seller: true,
        is_active: true,
        birthday: '',
        sex: '',
        head_image: '',
        date_joined: '',
      },
    }
  },
  methods: {
    // 保存
    async save() {
      let data = {
        username: this.sellerInfo.username,
        email: this.sellerInfoemail,
        phone: this.sellerInfo.phone,
        birthday: this.sellerInfo.birthday,
        sex: this.sellerInfo.sex,
      }
      const res = await this.$http.put(
        '/seller/chsc/apis/info/personal/',
        data,
        {
          headers: { Permission: this.permission },
        }
      )

      if (res.status === 200 && res.data.code === 1008) {
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

<style>
</style>