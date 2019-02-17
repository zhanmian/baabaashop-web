<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
              <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button style="float: right" type="primary" icon="add" @click="addProductCategory">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="分类名称"  width="auto" align="center">
                </el-table-column>
                <el-table-column prop="categoryLevel" label="分类级别" width="auto" align="center">
                </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="auto" align="center">
              </el-table-column>
              <el-table-column label="操作" width="auto" align="center">
                  <template slot-scope="scope">
                      <el-button type="text" :disabled="is_subcategory" @click="subcategory(scope.$index, scope.row)">次级分类</el-button>
                      <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background
                               @current-change="handleCurrentChange"
                               layout="prev, pager, next"
                               :total="total_record"
                               :page-size="page_size"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

  export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                page_size: 5,
                total_record: 1,
                categoryId: 0,
                multipleSelection: [],
                is_search: false,
                is_subcategory: false,
                delVisible: false,
                form: {
                  id: '',
                  parentId: '',
                  categoryName: '',
                  categoryLevel: '',
                  createTime: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        //对表格进行二次渲染
        watch: {
          $route(route) {
            this.getData();
          }
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                  if(d.categoryLevel == 0){
                      d.categoryLevel = "一级分类";
                  }else if (d.categoryLevel == 1){
                      d.categoryLevel = "二级分类";
                  }
                  return d;
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取列表数据
            getData() {
                this.is_subcategory=this.$route.query.is_subcategory;
                if(this.is_subcategory){
                  this.cur_page=1;
                  this.page_size=100;
                  this.categoryId=this.$route.query.parentId;
                }else{
                  this.categoryId=0;
                }
                this.$axios.post('product_category', {
                    page: this.cur_page,
                    pageSize: this.page_size,
                    categoryId: this.categoryId
                }).then((res) => {
                    this.tableData = res.data.list;
                    this.total_record = res.data.totalRecord;
                })

            },
          //跳转到次级分类
            subcategory(index, row) {
                this.$router.push({
                path: '/product_category',
                query: {
                  parentId: row.id,
                  is_subcategory: true
                }
              })
            },
            addProductCategory(){
              if(this.is_subcategory){
                this.$router.push({
                  path: '/add_product_category',
                  query: {parentId: this.$route.query.parentId, is_subcategory: true}
                })
              }else{
                this.$router.push({path: '/add_product_category'})
              }
            },
            handleEdit(index, row) {
              this.$router.push({path: '/update_product_category', query: {id: row.id}})
            },
            handleDelete(index, row) {
                this.categoryId = row.id;
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
            deleteRow() {
              this.$axios.post('/delete_product_category/'+this.categoryId).then((response) => {
                this.delVisible = false;
                this.$confirm(response.data.message, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'success'
                }).then(() => {
                  this.getData();
                })
              })
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
