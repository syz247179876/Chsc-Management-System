<template>
  <div id="SellerRole">
    <div id="card">
      <el-form ref="sellerRole" :model="sellerRole" label-width="150px">
        <el-form-item label="角色名">
          <el-input
            v-model="sellerRole.role_name"
            style="width: 150px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="sellerRole.description"
            type="textarea"
            :rows="4"
            style="width: 300px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色编号">
          <el-input v-model="sellerRole.rid" style="width: 150px" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerRole',
  props: {
    sellerRole: {
      type: Object,
      default: new Object(),
    },
  },
  data() {
    return {
      form: {
        id: '', // 角色id
        role_name: '', // 角色名
        description: '', // 角色描述信息
        rid: '', // 角色编号
      },
    }
  },
}
</script>

<style>
</style>