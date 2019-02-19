<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-lx-goods"></i> 订单管理</el-breadcrumb-item>
              <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="orderCode" label="订单编号"  width="auto" align="center">
                </el-table-column>
                <el-table-column prop="username" label="用户" width="auto" align="center">
                </el-table-column>
              <el-table-column prop="totalAmount" label="订单金额" width="90px" align="center">
              </el-table-column>
              <el-table-column prop="payType" label="支付方式" width="90px" align="center">
              </el-table-column>
              <el-table-column prop="status" label="订单状态" width="90px" align="center">
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="auto" align="center" >
              </el-table-column>
              <el-table-column label="操作" width="160px" align="center">
                  <template slot-scope="scope">
                      <el-button type="text" icon="el-icon-lx-calendar" @click="checkOrder(scope.$index, scope.row)">查看订单</el-button>
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
        name: 'order',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                total_record: 1,
                page_size: 10,
                orderId: null,
                multipleSelection: [],
                delVisible: false,
                form: {
                    id:'',
                    orderCode: '',
                    username: '',
                    totalAmount: '',
                    payType: '',
                    status: '',
                    createTime: ''
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
                  if (d.payType === 0) {
                    d.payType = '未支付';
                  } else if (d.payType === 1) {
                    d.payType = '支付宝';
                  }else if(d.payType === 2){
                    d.payType = '微信支付';
                  }
                  if (d.status === 0) {
                    d.status = '待付款';
                  } else if (d.status === 1) {
                    d.status = '待发货';
                  } else if (d.status === 2) {
                    d.status = '已发货';
                  } else if (d.status === 3) {
                    d.status = '已完成';
                  } else if (d.status === 4) {
                    d.status = '已关闭';
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
                this.$axios.post('get_order_list', {page: this.cur_page, pageSize: this.page_size}).then(response=>{
                  this.tableData = response.data.list;
                  this.total_record = response.data.totalRecord;
                })
            },
            checkOrder(index, row) {
                this.$router.push({path: '/get_order_detail', query: {id: row.id}
                })
            },
            handleDelete(index, row) {
                this.orderId = row.id;
                console.log(this.orderId);
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
                this.$axios.post('/delete_order/' + this.orderId).then((response) => {
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
