<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 商品管理</el-breadcrumb-item>
              <el-breadcrumb-item>商品属性分类列表</el-breadcrumb-item>
              <el-breadcrumb-item>商品属性列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button style="float: right" type="primary" icon="add" @click="addProductAttribute">添加</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="attributeName" label="属性名称"  width="auto" align="center">
                </el-table-column>
                <el-table-column prop="categoryName" label="分类" width="auto" align="center">
                </el-table-column>
              <el-table-column prop="selectType" label="是否多选" width="auto" align="center">
              </el-table-column>
              <el-table-column prop="inputStatus" label="录入方式" width="auto" align="center">
              </el-table-column>
              <el-table-column prop="inputList" label="可选值列表" width="220" align="center">
              </el-table-column>
              <el-table-column label="操作" width="auto" align="center">
                  <template slot-scope="scope">
                      <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        name: 'productAttribute',
        data() {
            return {
                url:'product_attribute',
                tableData: [],
                cur_page: 1,
                page_size: 5,
                total_record: 1,
                categoryId: this.$route.query.categoryId,
                attributeId: null,
                type: this.$route.query.type,
                multipleSelection: [],
                delVisible: false,
                form: {
                    id: '',
                    attributeName: '',
                    categoryName: '',
                    selectType: '',
                    inputStatus: '',
                    inputList: ''
                },
                idx: -1,
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取列表数据
            getData() {
                this.$axios.post(this.url, {
                    page: this.cur_page,
                    pageSize: this.page_size,
                    categoryId: this.categoryId,
                    type: this.type
                }).then((res) => {
                    this.tableData = res.data.list;
                    this.total_record = res.data.totalRecord;
                })
            },
            handleEdit(index, row) {
              this.$router.push({path:'/update_product_attribute',query:{id:row.id}});
            },
            handleDelete(index, row) {
                this.attributeId = this.tableData[index].id;
                this.delVisible = true;
            },
            delAll() {
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
              this.$axios.post('/delete_product_attribute', {
                id: this.attributeId,
                categoryId: this.categoryId,
                type: this.type
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
            addProductAttribute(){
              this.$router.push({
                path:'/add_product_attribute',
                query:{
                  categoryId:this.$route.query.categoryId,
                  type:this.$route.query.type
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
