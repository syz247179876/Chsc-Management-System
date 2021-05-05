<template>
  <div id="SellerInfo">
    <div class="card">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-avatar
            shape="square"
            :size="100"
            :src="form.head_image"
          ></el-avatar
        ></el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="是否是商家">
          <el-switch v-model="form.is_seller" disabled></el-switch>
        </el-form-item>
        <el-form-item label="帐号是否激活">
          <el-switch v-model="form.is_active" disabled></el-switch>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="3">男</el-radio>
            <el-radio :label="6">女</el-radio>
            <el-radio :label="9">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-input v-model="form.birthday" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="开店日期">
          <el-input v-model="form.date_joined"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button>取消</el-button>
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
  methods: {},
}
</script>

<style>
</style>