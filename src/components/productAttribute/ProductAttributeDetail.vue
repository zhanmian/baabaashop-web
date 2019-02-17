<template>
  <div>
    <div class="crumbs margin-top: 50px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品属性列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品属性</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  <el-card class="form-container" shadow="never">
    <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
      <el-form-item label="属性名称：" prop="attributeName">
        <el-input v-model="productAttr.attributeName"></el-input>
      </el-form-item>
      <el-form-item label="商品类型：">
        <el-select v-model="productAttr.id" placeholder="请选择">
          <el-option
            v-for="item in productAttrCateList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性是否可选:">
        <el-radio-group v-model="productAttr.selectType">
          <el-radio :label="0">单选</el-radio>
          <el-radio :label="1">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="属性值的录入方式:">
        <el-radio-group v-model="productAttr.inputStatus">
          <el-radio :label="0">手工录入</el-radio>
          <el-radio :label="1">从下面列表中选择</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="属性值可选值列表:">
        <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
        <el-button  v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  </div>
</template>

<script>

  const defaultProductAttr = {
    inputList: '',
    inputStatus: 0,
    id: null,
    attributeName: '',
    selectType: 0,
    type: 0
  };
  export default {
    name: "ProductAttributeDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productAttr: Object.assign({}, defaultProductAttr),
        rules: {
          attributeName: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        productAttrCateList: null,
        inputListFormat:null
      }
    },
    created() {
      if(this.isEdit){
        this.$axios.post('get_product_attribute_by_id', {id:this.$route.query.id}).then(response => {
          this.productAttr = response.data;
          this.productAttr.id=response.data.categoryId;
          this.inputListFormat = this.productAttr.inputList.replace(/,/g,'\n');
        });
      }else{
        this.resetProductAttr();
      }
      this.getCateList();
    },
    watch:{
      inputListFormat: function (newValue, oldValue) {
        newValue = newValue.replace(/\n/g,',');
        this.productAttr.inputList = newValue;
      }
    },
    methods: {
      getCateList() {
        this.$axios.post('product_attribute_category', {pageNum: 1, pageSize: 100}).then(response => {
          this.productAttrCateList = response.data.list;
        });
      },
      resetProductAttr() {
        this.productAttr = Object.assign({}, defaultProductAttr);
        this.productAttr.id = Number(this.$route.query.categoryId);
        this.productAttr.type = Number(this.$route.query.type);
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.isEdit){
                this.productAttr.categoryId = this.productAttr.id;
                this.productAttr.id = this.$route.query.id;
                this.$axios.post('update_product_attribute', this.productAttr).then(response=>{
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 3000
                  });
                  this.$router.back();
                });
              }else{
                this.$axios.post('add_product_attribute', this.productAttr).then(response=>{
                    this.$message({
                      message: '提交成功',
                      type: 'success',
                      duration: 3000
                    });
                    this.resetForm('productAttrFrom');
                  });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.resetProductAttr();
      }
    },
  }
</script>

<style scoped>
  .form-container {
    /*position: absolute;*/
    left: 0;
    right: 0;
    width: 720px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }
</style>
