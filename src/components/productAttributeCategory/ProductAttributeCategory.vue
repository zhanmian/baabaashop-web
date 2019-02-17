<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
              <el-breadcrumb-item>商品属性分类列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button style="float: right" type="primary" icon="add" @click="addProductAttrCate">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="id" label="ID"  width="50" align="center">
              </el-table-column>
                <el-table-column prop="categoryName" label="属性名称"  width="120" align="center">
                </el-table-column>
                <el-table-column prop="attributeCount" label="规格属性数量" width="120" align="center">
                </el-table-column>
              <el-table-column prop="paramCount" label="参数属性数量" width="120" align="center">
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="auto" align="center">
              </el-table-column>
              <el-table-column label="查看列表" width="auto" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="getAttribute(scope.$index, scope.row)">规格属性</el-button>
                  <el-button type="text" @click="getParamAttribute(scope.$index, scope.row)">参数属性</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="auto" align="center">
                  <template slot-scope="scope">
                      <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                      <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               layout="prev, pager, next"
                               :total="total_record"
                               :page-size="page_size">
                </el-pagination>
            </div>

          <!--新建分类或编辑分类弹出框-->
          <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form ref="productAttrCatForm" :model="productAttributeCategory" :rules="rules" label-width="120px">
              <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="productAttributeCategory.categoryName" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确 定</el-button>
           </span>
          </el-dialog>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="400" center>
            <div class="del-dialog-cnt">删除该商品属性分类将一并删除该分类下的所有商品属性，一旦删除，不可恢复</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

  export default {
        name: 'productAttributeCategory',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                total_record: 1,
                page_size: 5,
                multipleSelection: [],
                del_list: [],
                editVisible: false,
                delVisible: false,
                dialogTitle: '添加商品属性分类',
                dialogVisible: false,
                productAttributeCategory: {
                  categoryName: '',
                  id: null
                },
                form: {
                    id: '',
                    categoryName: '',
                    attributeCount: '',
                    paramCount: '',
                    createTime: ''
                },
                rules: {
                  categoryName: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                  ]
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                  return d;
                })
            }
        },
        methods: {
            //分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            //获取列表数据
            getData() {
                this.$axios.post('product_attribute_category', {
                    page: this.cur_page,
                    pageSize: this.page_size
                }).then((res) => {
                    this.tableData = res.data.list;
                    this.total_record = res.data.totalRecord;
                })
            },
            //获取规格属性
            getAttribute(index, row){
              this.$router.push({
                path: '/product_attribute',
                query: {
                  categoryId: row.id,
                  type: 0
                }
              })
            },
            //获取参数属性
            getParamAttribute(index, row){
              this.$router.push({
                path: '/product_attribute',
                query: {
                  categoryId: row.id,
                  type: 1
                }
              })
            },
            addProductAttrCate() {
              this.dialogVisible = true;
              this.dialogTitle = "添加商品属性分类";
            },
            handleUpdate(index, row) {
              this.dialogVisible = true;
              this.dialogTitle = "编辑类型";
              this.productAttributeCategory.categoryName = row.categoryName;
              this.productAttributeCategory.id = row.id;
            },
            handleDelete(index, row) {
                this.categoryId = this.tableData[index].id;
                this.delVisible = true;
            },
            delAll() {
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
              this.$axios.post('/delete_product_attribute_category', {
                categoryId: this.categoryId
              }).then((response) => {
                this.delVisible = false;
                this.$confirm(response.data.message, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'success'
                }).then(() => {
                this.getData();
                })
              })
            },
            handleConfirm(formName){
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  let data = {};
                  data.categoryName=this.productAttributeCategory.categoryName;
                  if(this.dialogTitle==="添加商品属性分类"){
                    console.log(data);
                    this.$axios.post('/add_product_attribute_category', data).then(response=>{
                      this.$message({
                        message: response.data.message,
                        type: 'success',
                        duration:1000
                      });
                      this.dialogVisible = false;
                      this.getData();
                    });
                  }
                  else{
                    data.id=this.productAttributeCategory.id;
                    this.$axios.post('/update_product_attribute_category', data).then(response=>{
                      this.$message({
                        message: response.data.message,
                        type: 'success',
                        duration:1000
                      });
                      this.dialogVisible = false;
                      this.getData();
                    });
                  }
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
