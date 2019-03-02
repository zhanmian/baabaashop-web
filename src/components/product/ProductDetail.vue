<template>
    <div>
        <div class="crumbs margin-top: 50px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      <el-card class="form-container" shadow="never">
                <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                    <el-form-item label="商品分类" prop="productCategoryId">
                      <el-cascader
                        :options="productCategoryOptions"
                        v-model="selectProductCategoryValue">
                      </el-cascader>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="productName">
                        <el-input v-model="form.productName"></el-input>
                    </el-form-item>
                    <el-form-item label="商品货号">
                      <el-input v-model="form.productCode"></el-input>
                    </el-form-item>
                    <el-form-item label="商品售价">
                      <el-input v-model="form.productPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="属性类型">
                      <el-select v-model="form.productAttributeCategoryId"
                                 placeholder="请选择属性类型"
                                 @change="handleProductAttributeChange">
                        <el-option
                          v-for="item in productAttributeCategoryOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="商品规格">
                      <el-card shadow="never" class="cardBg">
                        <div v-for="(productAttr,idx) in selectProductAttribute">
                          {{productAttr.attributeName}}：
                          <!--inputStatus值为1代表是从inputList加载商品属性-->
                          <el-checkbox-group v-if="productAttr.inputStatus===1" v-model="selectProductAttribute[idx].values">
                            <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item"
                                         class="littleMarginLeft"></el-checkbox>
                          </el-checkbox-group>
                          <!--如果inputStatus值为0代表手动添加商品属性-->
                          <div v-else>
                            <el-checkbox-group v-model="selectProductAttribute[idx].values">
                              <div v-for="(item,index) in selectProductAttribute[idx].options" style="display: inline-block"
                                   class="littleMarginLeft">
                                <el-checkbox :label="item" :key="item"></el-checkbox>
                                <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                                </el-button>
                              </div>
                            </el-checkbox-group>
                            <el-input v-model="addProductAttrValue" style="width: 160px" clearable></el-input>
                            <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
                          </div>
                        </div>
                      </el-card>
                      <el-table style="width: 100%;margin-top: 20px"
                                :data="form.skuStockList"
                                border>
                        <el-table-column
                          v-for="(item,index) in selectProductAttribute"
                          :label="item.attributeName"
                          :key="item.id"
                          align="center"
                          width="auto">
                          <template slot-scope="scope">
                            {{getProductSkuSp(scope.row,index)}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="销售价格"
                          width="auto"
                          align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.skuPrice"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="商品库存"
                          width="auto"
                          align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.skuStock"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="SKU编号"
                          align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.skuCode"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          width="auto"
                          align="center">
                          <template slot-scope="scope">
                            <el-button
                              type="text"
                              @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-button
                        type="primary"
                        style="margin-top: 20px"
                        @click="handleRefreshProductSkuList">刷新列表
                      </el-button>
                      <el-button
                        type="primary"
                        style="margin-top: 20px"
                        @click="handleSyncProductSkuPrice">同步价格
                      </el-button>
                    </el-form-item>
                    <el-form-item label="商品图片">
                      <el-card shadow="never" class="cardBg">
                      <div class="crop-demo">
                        <img :src="cropImg" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                          <input class="crop-input" type="file" name="image" accept="image/*"
                                 @change="setImage"/>
                        </div>
                        <div class="crop-demo-btn" @click="uploadImage">上传图片</div>
                      </div>
                      <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                        <vue-cropper ref='cropper'
                                     :src="imgSrc"
                                     :ready="cropImage"
                                     :zoom="cropImage"
                                     :cropmove="cropImage"
                                     style="width:100%;height:100%;">
                        </vue-cropper>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="cancelCrop">取 消</el-button>
                          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                        </span>
                      </el-dialog>
                      </el-card>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="description">
                        <quill-editor ref="myTextEditor" v-model="form.description" :options="editorOption"></quill-editor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="finishCommit()">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
      </el-card>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'productDetail',
        components: {
          quillEditor,
          VueCropper
        },
        props:{
          isEdit: {
            type: Boolean,
            default: false
          }
        },
        data: function(){
            return {
                //编辑模式时是否初始化成功
                hasEditCreated:false,
                //下拉列表商品分类的值
                selectProductCategoryValue: [],
                //商品父分类及其子分类
                productCategoryOptions: [],
                //商品属性父分类及其子分类
                productAttributeCategoryOptions: [],
                //商品属性
                selectProductAttribute: [],
                //手动添加的商品属性
                addProductAttrValue: '',
                //富文本编辑器配置
                editorOption: {
                  placeholder: 'Hello World'
                },
                //cropper参数
                defaultSrc: require('../../assets/img/add_image.jpg'),
                fileList: [],
                imgSrc: '',
                imageName: '',
                cropImg: '',
                cropImgBlob: '',
                dialogVisible: false,
                form: {
                    id: '',
                    productName: '',
                    productPrice: '',
                    productCode: '',
                    productCategoryId: '',
                    productCategoryName: '',
                    productCategoryParentId: '',
                    productAttributeCategoryId: '',
                    productAttributeValueList: [],
                    picture: '',
                    skuStockList: [],
                    skuPrice: '',
                    skuStock: '',
                    skuCode: '',
                    description: '',
                },
                rules: {
                    productName: [
                      {required: true, message: '请输入商品名称', trigger: 'blur'},
                      {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                    ],
                    productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
                    description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
                    requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
                }
            }
        },
        created(){
          this.getProductCategoryList();
          this.getProductAttributeCategoryList();
          this.cropImg = this.defaultSrc;

          if(this.isEdit){
            this.$axios.post('get_product_detail/' + this.$route.query.id).then(response=>{
              this.form=response.data;
              this.cropImg = 'http://localhost:8088/downloadImage?filePath='+ this.form.picture;
            });
          }
        },
        computed: {
          productId(){
            return this.form.id;
          }
        },
        watch: {
          productId:function (newValue) {
            if(!this.isEdit)return;
            if(this.hasEditCreated)return;
            if(newValue===undefined||newValue==null||newValue===0)return;
            this.handleEditCreated();
          },
          selectProductCategoryValue: function (newValue) {
            if (newValue != null && newValue.length === 2) {
              this.form.productCategoryId = newValue[1];
              this.form.productCategoryName= this.getCateNameById(this.form.productCategoryId);
            } else {
              this.form.productCategoryId = null;
              this.form.productCategoryName=null;
            }
          }
        },
        methods: {
            handleEditCreated() {
              //根据商品属性分类id获取属性和参数
              if(this.form.productAttributeCategoryId!=null){
                this.selectProductCategoryValue.push(this.form.productCategoryParentId);
                this.selectProductCategoryValue.push(this.form.productCategoryId);
                this.handleProductAttributeChange(this.form.productAttributeCategoryId);
              }
              this.hasEditCreated=true;
            },
            //富文本编辑器
            onEditorChange({ editor, html, text }) {
              this.form.description = html;
            },
            //获得商品分类列表
            getProductCategoryList() {
              this.$axios.post('get_product_category_with_children').then(response => {
                let list = response.data;
                this.productCategoryOptions = [];
                for (let i = 0; i < list.length; i++) {
                  let children = [];
                  //级联选择器子分类赋值
                  if (list[i].children != null && list[i].children.length > 0) {
                    for (let j = 0; j < list[i].children.length; j++) {
                      children.push({label: list[i].children[j].categoryName, value: list[i].children[j].id});
                    }
                  }
                  this.productCategoryOptions.push({label: list[i].categoryName, value: list[i].id, children: children});
                }
              });
            },
            getCateNameById(id){
              let name=null;
              for(let i=0;i<this.productCategoryOptions.length;i++){
                for(let j=0;i<this.productCategoryOptions[i].children.length;j++){
                  if(this.productCategoryOptions[i].children[j].value===id){
                    name=this.productCategoryOptions[i].children[j].label;
                    return name;
                  }
                }
              }
              return name;
            },
            //获取商品属性分类列表
            getProductAttributeCategoryList(){
              let param = {pageNum: 1, pageSize: 1000};
              this.$axios.post('product_attribute_category', param).then(response => {
                this.productAttributeCategoryOptions = [];
                let list = response.data.list;
                for (let i = 0; i < list.length; i++) {
                  this.productAttributeCategoryOptions.push({label: list[i].categoryName, value: list[i].id});
                }
              });
            },
            //改变商品属性分类时触发该方法，加载商品规格属性详情
            handleProductAttributeChange(value){
              this.getProductAttributeList(0, value);
            },
            //根据分类ID获取商品属性列表
            getProductAttributeList(type, attributeCategoryId){
              let param = {type: type, categoryId: attributeCategoryId, page: 1, pageSize: 1000};
              this.$axios.post('product_attribute', param).then(response => {
                let list = response.data.list;
                if(type === 0){
                  this.selectProductAttribute = [];
                  for(let i=0; i<list.length; i++){
                    let options=[];
                    let values=[];
                    if (this.isEdit) {
                      if (list[i].inputStatus === 0) {
                        //编辑状态下获取手动添加编辑属性
                        options = this.getEditAttrOptions(list[i].id);
                      }
                      //编辑状态下获取选中属性
                      values = this.getEditAttrValues(i);
                    }
                    this.selectProductAttribute.push({
                      id: list[i].id,
                      attributeName: list[i].attributeName,
                      inputStatus: list[i].inputStatus,
                      inputList: list[i].inputList,
                      options: options,
                      values: values
                    })
                  }
                }
              })
            },
            //如果是编辑状态，获取设置的可手动添加属性值
            getEditAttrOptions(id) {
              let options = [];
              for (let i = 0; i < this.form.productAttributeValueList.length; i++) {
                let attrValue = this.form.productAttributeValueList[i];
                if (attrValue.attributeId === id) {
                  let strArr = attrValue.value.split(',');
                  for (let j = 0; j < strArr.length; j++) {
                    options.push(strArr[j]);
                  }
                  break;
                }
              }
              return options;
            },
            //如果是编辑状态，获取选中的属性值
            getEditAttrValues(index) {
              let values = [];
              if (index === 0) {
                for (let i = 0; i < this.form.skuStockList.length; i++) {
                  let sku = this.form.skuStockList[i];
                  if (sku.spec1 != null && values.indexOf(sku.spec1) === -1) {
                    values.push(sku.spec1);
                  }
                }
              } else if (index === 1) {
                for (let i = 0; i < this.form.skuStockList.length; i++) {
                  let sku = this.form.skuStockList[i];
                  if (sku.spec2 != null && values.indexOf(sku.spec2) === -1) {
                    values.push(sku.spec2);
                  }
                }
              } else {
                for (let i = 0; i < this.form.skuStockList.length; i++) {
                  let sku = this.form.skuStockList[i];
                  if (sku.spec3 != null && values.indexOf(sku.spec3) === -1) {
                    values.push(sku.spec3);
                  }
                }
              }
              return values;
            },
            //将可选值列表去掉逗号返回一个数组
            getInputListArr(inputList){
                return inputList.split(',');
            },
            //手动添加商品属性
            handleAddProductAttrValue(idx) {
              let options = this.selectProductAttribute[idx].options;
              if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
                this.$message({
                  message: '属性值不能为空',
                  type: 'warning',
                  duration: 1000
                });
                return
              }
              if (options.indexOf(this.addProductAttrValue) !== -1) {
                this.$message({
                  message: '属性值不能重复',
                  type: 'warning',
                  duration: 1000
                });
                return;
              }
              this.selectProductAttribute[idx].options.push(this.addProductAttrValue);
              this.addProductAttrValue = null;
            },
            //删除手动添加的商品规格属性值
            handleRemoveProductAttrValue(idx, index) {
              this.selectProductAttribute[idx].options.splice(index, 1);
            },
            //表格的表头
            getProductSkuSp(row, index) {
              if (index === 0) {
                return row.spec1;
              } else if (index === 1) {
                return row.spec2;
              } else {
                return row.spec3;
              }
            },
            handleRefreshProductSkuList() {
              this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.refreshProductSkuList();
              });
            },
            //刷新表格，根据多选框勾选的属性值搭配出SKU
            refreshProductSkuList() {
              this.form.skuStockList = [];
              let skuList = this.form.skuStockList;
              //只有一个属性时
              if (this.selectProductAttribute.length === 1) {
                let values = this.selectProductAttribute[0].values;
                for (let i = 0; i < values.length; i++) {
                  skuList.push({
                    spec1: values[i]
                  });
                }
              //两个属性时
              } else if (this.selectProductAttribute.length === 2) {
                let values0 = this.selectProductAttribute[0].values;
                let values1 = this.selectProductAttribute[1].values;
                for (let i = 0; i < values0.length; i++) {
                  if (values1.length === 0) {
                    skuList.push({
                      spec1: values0[i]
                    });
                    continue;
                  }
                  for (let j = 0; j < values1.length; j++) {
                    skuList.push({
                      spec1: values0[i],
                      spec2: values1[j]
                    });
                  }
                }
              //三个属性时
              } else {
                let values0 = this.selectProductAttribute[0].values;
                let values1 = this.selectProductAttribute[1].values;
                let values2 = this.selectProductAttribute[2].values;
                for (let i = 0; i < values0.length; i++) {
                  if (values1.length === 0) {
                    skuList.push({
                      spec1: values0[i]
                    });
                    continue;
                  }
                  for (let j = 0; j < values1.length; j++) {
                    if (values2.length === 0) {
                      skuList.push({
                        spec1: values0[i],
                        spec2: values1[j]
                      });
                      continue;
                    }
                    for (let k = 0; k < values2.length; k++) {
                      skuList.push({
                        spec1: values0[i],
                        spec2: values1[j],
                        spec3: values2[k]
                      });
                    }
                  }
                }
              }
            },
            handleSyncProductSkuPrice(){
              this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if(this.form.skuStockList!==null&&this.form.skuStockList.length>0){
                  let price=this.form.skuStockList[0].price;
                  for(let i=0;i<this.form.skuStockList.length;i++){
                    this.form.skuStockList[i].price=price;
                  }
                }
              });
            },
            //删除表格里所选的SKU
            handleRemoveProductSku(index, row) {
              let list = this.form.skuStockList;
              //如果只有一行就销毁表格
              if (list.length === 1) {
                list.pop();
              } else {
                list.splice(index, 1);
              }
            },
            //cropper方法
            setImage(e){
              const file = e.target.files[0];
              this.imageName = e.target.files[0].name;
              if (!file.type.includes('image/')) {
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
              };
              reader.readAsDataURL(file);
            },
            cropImage () {
              this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
              this.$refs.cropper.getCroppedCanvas({width: 800, height: 800}).toBlob((blob) => {
                const formData = new FormData();
                formData.append('file', blob, this.imageName);
                this.cropImgBlob=formData;
                }
              )
            },
            cancelCrop(){
              this.dialogVisible = false;
              this.cropImg = this.defaultSrc;
            },
            uploadImage() {
              if(!this.cropImgBlob){
                this.$message({
                    message: '请先选择图片',
                    type: 'warning',
                    duration: 2000
                })
              }else{
                this.$axios.post('upload_picture', this.cropImgBlob).then(response=>{
                  this.form.picture=response.data.data.filePath;
                  if(response.data.code === 1){
                    this.$message({
                      message: '上传成功',
                      type: 'success',
                      duration: 2000
                    })
                  }
                })
                }
            },
            finishCommit() {
              this.$confirm('是否要提交该产品', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if(this.isEdit){
                  this.$axios.post('update_product', this.form).then(response=>{
                    this.$message({
                      type: 'success',
                      message: '提交成功',
                      duration:3000
                    });
                    this.$router.back();
                  });
                }else{
                this.mergeProductAttrValue();
                this.form.productCategoryId=this.selectProductCategoryValue[1];
                this.$axios.post('add_product', this.form).then(response=>{
                    if(response.data.code===1111){
                      this.$confirm('添加商品成功', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success'
                      });
                      location.reload();
                    }else{
                      this.$message.error('提交失败');
                    }
                  });
                }
              })
            },
            //合并商品属性
            mergeProductAttrValue() {
              this.form.productAttributeValueList = [];
              for (let i = 0; i < this.selectProductAttribute.length; i++) {
                let attr = this.selectProductAttribute[i];
                if (attr.inputStatus === 0 && attr.options != null && attr.options.length > 0) {
                  this.form.productAttributeValueList.push({
                    id: attr.id,
                    value: this.getOptionStr(attr.options)
                  });
                }
              }
              // for (let i = 0; i < this.selectProductParam.length; i++) {
              //   let param = this.selectProductParam[i];
              //   this.form.productAttributeValueList.push({
              //     productAttributeId: param.id,
              //     value: param.value
              //   });
              // }
            },
            getOptionStr(arr) {
              let str = '';
              for (let i = 0; i < arr.length; i++) {
                str += arr[i];
                if (i != arr.length - 1) {
                  str += ',';
                }
              }
              return str;
            },
        }
    }
</script>
<style scoped>
  .pre-img{
    width: 30%;
    height: 30%;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .crop-demo{
    display: flex;
    align-items: flex-end;
  }
  .crop-demo-btn{
    position: relative;
    width: 85px;
    height: 30px;
    line-height: 30px;
    padding: 0 18px;
    margin-left: 12px;
    background-color: #409eff;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    box-sizing: border-box;
  }
  .crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  .form-container {
    /*position: absolute;*/
    left: 0;
    right: 0;
    width: 720px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }
  .cardBg {
    background: #F8F9FC;
  }
</style>
