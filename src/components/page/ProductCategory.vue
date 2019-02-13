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
                <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                    <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                    <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
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
                      <el-button type="text" @click="subcategory(scope.$index, scope.row)">次级分类</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

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
                url: 'product_category',
                tableData: [],
                cur_page: 1,
                total_record: 1,
                page_size: 5,
                multipleSelection: [],
                // select_cate: '',
                // select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    categoryName: '',
                    categoryLevel: '',
                    createTime: '',
                    categoryId: ''
                },
                idx: -1,
                categoryId: 0
            }
        },
        created() {
            this.resetParentId();
            this.getData();
        },
        //对表格进行二次渲染
        watch: {
          $route(route) {
            this.resetParentId();
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
                this.$axios.post(this.url, {
                    page: this.cur_page,
                    pageSize: this.page_size,
                    categoryId: this.categoryId
                }).then((res) => {
                    this.tableData = res.data.list;
                    this.total_record = res.data.totalRecord;
                })
            },
            //设置子类的父ID
            resetParentId(){
              if(this.$route.query.categoryId != null){
                this.categoryId=this.$route.query.categoryId;
              }else{
                this.categoryId=0;
              }
            },
            search() {
                this.is_search = true;
            },
            subcategory(index, row) {
                this.$router.push({
                path: '/product_category',
                query: {
                  categoryId: row.categoryId
                }
              })
            },
            handleEdit(index, row) {
                const item = this.tableData[index];
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.categoryId = this.tableData[index].categoryId;
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
                this.$axios.post('/delete_product_category', {
                  categoryId: this.categoryId
                }).then((response) => {
                  this.delVisible = false;
                  alert(response.data.message);
                  window.location.reload();
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
