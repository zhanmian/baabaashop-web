<template>
  <div>
    <div class="crumbs margin-top: 50px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.breadcrumb}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="form-container" shadow="never">
      <el-form :model="productCategory" :rules="rules" ref="productCategory" label-width="150px">
        <el-form-item label="分类名称：" prop="attributeName">
          <el-input v-model="productCategory.categoryName"></el-input>
        </el-form-item>
        <el-form-item  label="上级分类：">
          <el-select v-model="productCategory.parentId" placeholder="请选择">
            <el-option
              v-for="item in productCategoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('productCategory')">提交</el-button>
          <el-button  v-if="!isEdit" @click="resetForm('productCategory')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

  export default {
    name: "ProductCategoryDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        is_subcategory: false,
        // 面包屑标题
        breadcrumb: '',
        productCategoryList: [],
        productCategory: {
          id: '',
          parentId: '',
          categoryName: '',
          categoryLevel: 0
        },
        rules: {
          categoryName: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
      }
    },
    created() {
      if(this.isEdit){
        this.breadcrumb='编辑商品分类';
        this.productCategory.id=this.$route.query.id;
        this.$axios.post('get_product_category_by_id', {id: this.$route.query.id}).then(response => {
          this.productCategory = response.data;
        });
      }else{
        this.breadcrumb='添加商品分类';
        // this.resetProductAttr();
      }
      this.getCateList();
    },
    methods: {
      getCateList() {
          this.$axios.post('product_category', {page: 1, pageSize:100, categoryId: 0}).then(response => {
          this.productCategoryList = response.data.list;
          //数组头部插入，该方法可向数组的开头添加一个或更多元素，并返回新的长度
          this.productCategoryList.unshift({id: 0, categoryName: '无上级分类'});
        });
      },
      // resetProductAttr() {
      //   this.productAttr = Object.assign({}, defaultProductAttr);
      //   this.productAttr.id = Number(this.$route.query.categoryId);
      //   this.productAttr.type = Number(this.$route.query.type);
      // },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.isEdit){
                this.$axios.post('update_product_category', this.productCategory).then(response=>{
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 3000
                  });
                  this.$router.back();
                });
              }else{
                if(this.productCategory.parentId !== 0){
                  this.productCategory.categoryLevel=1;
                }
                this.$axios.post('add_product_category', this.productCategory).then(response=>{
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 3000
                  });
                  this.resetForm('productCategory');
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
        // this.resetProductAttr();
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
