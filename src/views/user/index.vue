<template>
<div>
<el-row>
    <el-col :span="12"><div class="contain-title">用户管理</div></el-col>
    <el-col :span="12"><div class="add-button">
        <el-button size="max" @click="createInfo">新增</el-button>
    </div></el-col>
</el-row>
<div class="top-search">
    <p class="filter-container">用户：</p>
    <el-input  placeholder="请输入用户姓名/账号/电话" v-model="pageQuery.queryString" @clear="getList" clearable style="width: 300px;" class="filter-container" />
    <el-button size="max" class="filter-container" @click="getList">查询</el-button>
</div>

<el-table ref="userTable" :data="tableData" style="width: 100%" :height="tableHeight">
    <el-table-column prop="name" label="用户姓名" width="150"></el-table-column>
    <el-table-column prop="account" label="用户账号" width="150"></el-table-column>
    <el-table-column prop="position" label="角色" width="150"></el-table-column>
    <el-table-column prop="sex" label="性别" width="150"></el-table-column>
    <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
    <el-table-column prop="modifier" label="修改人" width="150"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
    <el-table-column prop="modifyTime" label="修改时间" width="150"></el-table-column>
    <el-table-column label="操作" width="100">
      <template slot-scope="scope">
        <el-button @click="editeInfo(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="deleteInfo(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
</el-table>

<el-pagination
    class="page-select"
    background
    :current-page.sync="pageQuery.pageNum"
    :page-size.sync="pageQuery.perNum"
    :page-sizes="[10, 20, 30, 40]"
    @size-change="getList"
    layout="sizes, prev, pager, next, total"
    :total="totalNum"
    @current-change="getList">
</el-pagination>

<el-dialog
:title="modifyInfo?'修改用户信息':'新建用户信息'"
:visible.sync="dialogVisible"
width="30%"
:before-close="handleClose">
    <el-form :model="tempData" :rules="rules" ref="userForm" class="demo-ruleForm dialog-margin">
        <el-form-item label="账户" prop="account">
            <el-input disabled:modifyInfo v-model="tempData.account"></el-input>
        </el-form-item>
        <el-form-item v-if="modifyInfo==false" label="密码" prop="password">
            <el-input type="password" v-model.trim="tempData.password"></el-input>
        </el-form-item>
        <el-form-item v-if="modifyInfo" label="密码">
            <el-input type="password" v-model="tempData.ePassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="tempData.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-select style="width: 100%" v-model="tempData.sex" placeholder="请选择性别">
                <el-option label="男" value="男"/>
                <el-option label="女" value="女"/>
            </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="position">
            <el-select style="width: 100%" v-model="tempData.position" clearable placeholder="请选择角色">
                <el-option label="财务" value="财务"></el-option>
                <el-option label="售前" value="售前"></el-option>
                <el-option label="销售" value="销售"></el-option>
                <el-option label="产品经理" value="产品经理"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
            <el-input v-model="tempData.phone"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
    </span>
</el-dialog>

</div >   
</template>
<script>
import {createUser, updateUser, deleteUser, userList} from '@/api/user'
import md5 from 'js-md5'
export default {
    data(){
        let checkPhone = (rule, value, callback) => {
            let reg = /^1[345789]\d{9}$/
            if (!reg.test(value)) {
                callback(new Error('请输入11位手机号'))
            } else {
                callback()
            }
        }
        return{
            totalNum:0,
            pageQuery:{
                pageNum:1,
                perNum:20,
                queryString:''
            },
            tableHeight:500,
            tempData:{
                name:"",
                account:"",
                password:"",
                ePassword:"",
                sex:"",
                phone:"",
                position:""
            },
            tableData: [],
            dialogVisible:false,
            modifyInfo:false,
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 16, message: '长度在  3 到 16 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请输入性别', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { type: 'number', validator: checkPhone, message: '请输入11位有效手机号号码', trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    methods:{
        getList(){
            userList(this.pageQuery).then((msg)=>{
                this.tableData = msg.data.array
                this.totalNum = msg.data.totalNum
            })
        },
        handleClose(done) {
            if (this.tempData.name.trim().length +
               this.tempData.account.trim().length+
               this.tempData.phone.trim().length+
               this.tempData.position.trim().length ==0){
                this.dialogVisible = false
                return
            }
            this.$confirm('确认关闭？')
            .then(_ => {
                this.dialogVisible = false
                done();
            })
            .catch(_ => {});
        },
        confirmDialog(){
            this.$refs['userForm'].validate((valid) => {
                if (valid){
                    let confirmData = Object.assign({}, this.tempData)
                    if (this.modifyInfo){
                        confirmData.password = md5(this.tempData.ePassword)
                        updateUser(confirmData).then((msg)=>{
                            this.$message.success('更新成功')
                            this.dialogVisible = false
                            this.getList()
                        })
                    }else{
                        confirmData.password = md5(this.tempData.password)
                        createUser(confirmData).then((msg)=>{
                            this.$message.success('创建成功')
                            this.dialogVisible = false
                            this.getList()
                        })
                    }
                }
            })
        },
        createInfo(){
            this.tempData.name = ""
            this.tempData.account = ""
            this.tempData.password = ""
            this.tempData.ePassword = ""
            this.tempData.sex = "男"
            this.tempData.phone = ""
            this.tempData.position = ""
            this.modifyInfo = false
            this.dialogVisible = true
        },
        editeInfo(row){
            this.tempData = Object.assign({ePassword:""}, row)
            this.modifyInfo = true
            this.dialogVisible = true
        },
        deleteInfo(row){
            this.$confirm("确认删除账户："+row.account+"?")
            .then(_ => {
                deleteUser({account:row.account}).then((msg)=>{
                this.$message.success('删除成功')
                this.getList()
                });
            })
            .catch(_ => {});
        }
    },
    mounted:function(){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.userTable.$el.offsetTop - 200;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.userTable.$el.offsetTop - 200
            }
        })
    },
    created(){
        this.getList()
    }
}
</script>