<template>
    <el-dialog
    title="密码设置"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
        <el-form :model="passwordForm" :rules="rules" ref="passwordForm" class="demo-ruleForm dialog-margin">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="passwordForm.password"></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="repeatPassword">
                <el-input type="password" v-model="passwordForm.repeatPassword"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="confirmDialog">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {updateUser} from '@/api/user'
import md5 from 'js-md5'
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            dialogVisible: false,
            passwordForm:{
                password:'',
                oldPassword:'',
                repeatPassword:''
            },
            rules:{
                password: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 6, max:16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                oldPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max:16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                repeatPassword: [
                    { required: true,validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        visible:{
            immediate:true,
            handler(val){
                this.resetForm(val)
            },
            deep:false
        }
    },
    methods:{
        resetForm(val){
            this.dialogVisible = val
            this.passwordForm.password = ''
            this.passwordForm.oldPassword = ''
            this.passwordForm.repeatPassword = ''
        },
        emitClose(){
            this.dialogVisible = false
            this.$emit("close", "password")
        },
        handleClose(done) {
            if ((this.passwordForm.password.length +
            this.passwordForm.oldPassword.length +
            this.passwordForm.repeatPassword.length)==0){
                this.emitClose()
                return
            }
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
                this.emitClose();
            })
            .catch(_ => {});
        },
        cancelDialog(){
            this.emitClose()
        },
        confirmDialog(){
            this.$refs['passwordForm'].validate((valid)=>{
                if (valid){
                    updateUser({oldPassword:md5(this.passwordForm.oldPassword), password:md5(this.passwordForm.password)}).then((msg)=>{
                        this.$message.success('更新成功')
                        this.emitClose()
                    })
                }
            })
        }
    }
}
</script>
