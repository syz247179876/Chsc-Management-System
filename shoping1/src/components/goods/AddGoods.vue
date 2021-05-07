<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示警示框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGood"
        :rules="addGoodRules"
        ref="addGoodRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏切换 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="tabChange"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="commodity_name">
              <el-input v-model="addGood.commodity_name"></el-input>
            </el-form-item>
            <el-form-item label="商品简介" prop="intro">
              <el-input
                v-model="addGood.intro"
                type="textarea"
                rows="2"
                maxlength="100"
                show-word-limit
                minlength="1"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品原价" prop="price">
              <el-input v-model="addGood.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品优惠价" prop="favourable_price">
              <el-input
                v-model="addGood.favourable_price"
                type="number"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="addGood.stock" type="number"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="category_id">
              <el-cascader
                v-model="addGood.category_id"
                :options="cateList"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="运费模板" prop="freight_id">
              <el-select
                v-model="addGood.freight_id"
                placeholder="请选择运费模板"
              >
                <el-option
                  v-for="(item, index) in freightList"
                  :key="index"
                  :label="item.name"
                  :value="item.pk"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.is_free ? '包邮' : '不包邮'
                  }}</span>
                  <span
                    style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px;
                      padding-left:10px ;
                    "
                    >{{ item.charge_type }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品SPU操作步骤 -->
          <el-tab-pane label="商品参数" name="1">
            <el-tag
              v-for="(spu, index) in spuList"
              :key="index"
              class="spu-tag"
              closable
              @close="handleCloseSpuTag(spu)"
            >
              {{ spu }}
            </el-tag>
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="margin-top: 10px"
              @click="dialogSPUVisible = true"
              v-if="spuList.length <= 20"
            >
              点击添加 商品SPU</el-button
            >
            <el-dialog title="商品SPU" :visible.sync="dialogSPUVisible">
              <el-form :model="spu" ref="spu">
                <el-form-item label="SPU名">
                  <el-input
                    v-model="spu.name"
                    autocomplete="off"
                    placeholder="重量"
                  ></el-input>
                </el-form-item>
                <el-form-item label="SPU值">
                  <el-input
                    v-model="spu.value"
                    autocomplete="off"
                    placeholder="20kg"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSPUVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSpu">确 定</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="2">
            <!-- 上传图片 -->
            <!-- action 是图片上传的请求地址-->
            <!-- on-preview 点击预览 -->
            <!-- on-remove  点击删除 -->
            <el-upload
              :action="imgUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="3">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGood.details"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addbtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="完成" name="4">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewUrl" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 引入lodash组件 用里面的cloneDeep深拷贝方法
var _ = require('lodash')

export default {
  created() {
    this.getGoodCate()
  },
  data() {
    return {
      dialogSPUVisible: false, // 是否打开SPU dialog
      value: '',
      valuess: '',
      // 步骤条中被激活的步骤
      activeIndex: '0',
      // 添加商品的基本信息
      addGood: {
        commodity_name: '', // 商品名
        price: 0.0, //  商品原价
        favourable_price: 0.0, // 商品优惠价
        intro: '', // 商品简介
        groups: [], // 商品分组
        status: false, // 商品是否上架
        stock: 0, // 商品库存
        freight_id: '', // 运费模板id
        category_id: '', // 运费模板id
      },
      // 商品单个spu属性键值对
      spu: {
        name: '', // spu键
        value: '', // spu值
      },
      // 存储多个spu数组
      spuList: [],
      // 添加商品验证规则
      addGoodRules: {
        commodity_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        intro: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品原价', trigger: 'blur' }],
        favourable_price: [
          {
            required: true,
            message: '请输入商品优惠，如果无优惠，请设置为商品原价',
            trigger: 'blur',
          },
        ],
        stock: [
          { required: true, message: '请输入商品总库存', trigger: 'blur' },
        ],
        category_id: [
          { required: true, message: '请选择商品类别', trigger: 'blur' },
        ],
      },
      // 商品类别数组
      cateList: [],
      // 商品运费模板数组
      freightList: [],

      // 级联选择框的配置
      selectProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 商品参数列表
      manyParamList: [],
      // 商品静态属性
      onlyParamList: [],
      // 上传的图片的请求地址
      imgUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 为图片上传添加token请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片上传成功后的url地址
      previewUrl: '',
      // 预览对话框的显示和隐藏
      previewVisible: false,
    }
  },

  methods: {
    // 获取商品所需额外信息
    async getGoodCate() {
      const res = await this.$http.get('/seller/chsc/apis/commodity-extra/')
      if (res.status != 200) {
        this.$message({
          message: '获取商品额外信息失败',
          showClose: true,
          type: 'error',
        })
      } else {
        this.cateList = res.data.category.children // 从第一级目录开始
        this.freightList = res.data.freight
      }
    },

    // 级联选择框变化的时候触发的函数
    handleChange() {
      // 当选中的不是三级分类 则把选中的id数组请空
      if (this.addGood.category_id.length != 3) {
        this.addGoodList.goods_cat = []
      }
    },

    // 添加spu属性键值对
    addSpu() {
      let strSpu = this.spu.name + ':' + this.spu.value
      this.spuList.push(strSpu) // 追加，用于展示
      this.dialogSPUVisible = false
      this.$refs['spu'].resetFields() // 重置表单内容
    },

    // 删除spu属性键值对
    handleCloseSpuTag(tag) {
      this.spuList.splice(this.spuList.indexOf(tag), 1)
    },

    // 是否阻止tab栏切换
    tabChange(activename, oldActivename) {
      // 如果tab栏为基本信息页面,且没有选择分类，阻止切换
      if (oldActivename === '0' && this.addGood.category_id.length != 3) {
        this.$message.error('请选择分类')
        return false
      }
    },

    // tab栏被点击选中时触发  获取对应参数列表
    async tabClick() {
      //  点击商品参数
      // if (this.activeIndex === '1') {
      //   // 获取参数列表
      //   const { data: res } = await this.$http.get(
      //     `/categories/${this.cid}/attributes`,
      //     {
      //       params: {
      //         sel: 'many',
      //       },
      //     }
      //   )
      //   if (res.meta.status != 200) return this.$message.error('获取参数失败')
      //   // 请求成功
      //   // 将data里面的attr_vals转换为数组形式
      //   res.data.forEach((item) => {
      //     item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      //   })
      //   this.manyParamList = res.data
      //   console.log(res)
      // } else if (this.activeIndex === '2') {
      //   // 点击商品静态属性
      //   const { data: res } = await this.$http.get(
      //     `/categories/${this.cid}/attributes`,
      //     {
      //       params: {
      //         sel: 'only',
      //       },
      //     }
      //   )
      //   if (res.meta.status != 200) return this.$message.error('获取参数失败')
      //   // 请求成功
      //   this.onlyParamList = res.data
      //   console.log(res)
      // }
    },

    // 图片上传点击预览
    handlePreview(file) {
      console.log(file)
      this.previewUrl = file.response.data.url
      this.previewVisible = true
      console.log(this.previewUrl)
    },

    // 图片上传  点击移除的操作
    handleRemove(file) {
      // 获取将要被移除的图片的零时保存地址
      const picPath = file.response.data.tmp_path

      // 找到零时地址在pics中的索引
      const i = this.addGoodList.pics.findIndex((x) => {
        x.pic = picPath
      })
      // 根据索引删除在pics数组中删除改零时地址
      this.addGoodList.pics.splice(i, 1)
      console.log(this.addGoodList)
    },

    //监听图片上传成功
    handleUpload(response) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象push到addGoodList的pics数组中
      this.addGoodList.pics.push(picInfo)
      console.log(this.addGoodList)
    },

    // 添加商品按钮
    add() {
      // 预验证
      this.$refs.addGoodRef.validate(async (valida) => {
        if (!valida) return this.$message.error('请数入必要的表单项')
        // 预验证通过
        // 处理发送添加商品表单的参数
        // 将添加商品的数据深拷贝一份  因为表单项的数据格式和请求参数的格式不一样
        // lodash里面的cloneDeep深拷贝方法
        const form = _.cloneDeep(this.addGoodList)
        // 处理goods_cat项
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyParamList.forEach((item) => {
          const newQuery = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodList.attrs.push(newQuery)
        })
        // 处理静态参数
        this.onlyParamList.forEach((item) => {
          const newQuery = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodList.attrs.push(newQuery)
        })
        form.attrs = this.addGoodList.attrs
        //  console.log(form)
        // 发送添加商品亲求
        const { data: res } = await this.$http.post('/goods', form)
        console.log(res)
        if (res.meta.status != 201) return this.$message.error('添加商品失败')
        // 请求成功
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },

  computed: {
    // 获取分类id
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px !important;
}
.previewImg {
  width: 100%;
}
.addbtn {
  margin-top: 15px;
}
.spu-tag {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}
</style>
