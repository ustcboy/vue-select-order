<template>
    <el-dialog
    title="个人设置"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
        <el-form :model="infoForm" :rules="rules" ref="infoForm" class="demo-ruleForm dialog-margin">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="infoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select style="width: 100%" v-model="infoForm.sex" placeholder="请选择">
                    <el-option label="男" value="男"/>
                    <el-option label="女" value="女"/>
                </el-select>
            </el-form-item>
            <el-form-item v-if="roleUser" label="角色" prop="position">
                <el-select style="width: 100%" v-model="infoForm.position" clearable placeholder="请选择角色">
                    <el-option label="财务" value="财务"></el-option>
                    <el-option label="售前" value="售前"></el-option>
                    <el-option label="销售" value="销售"></el-option>
                    <el-option label="产品经理" value="产品经理"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="infoForm.phone"></el-input>
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
            roleUser:this.$store.state.role=='user',
            dialogVisible: false,
            infoForm:{
                name:'',
                sex:'',
                position:'',
                phone:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { type: 'number', validator: checkPhone, message: '请输入11位有效手机号号码', trigger: ['blur', 'change'] }
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
            this.infoForm.name = this.$store.state.name
            this.infoForm.position = this.$store.state.position
            this.infoForm.phone = this.$store.state.phone
            this.infoForm.sex = this.$store.state.sex
        },
        emitClose(){
            this.dialogVisible = false
            this.$emit("close", "info")
        },
        handleClose(done) {
            console.log(this.infoForm)
            if ((this.infoForm.name.trim() === this.$store.state.name)&&
            (this.infoForm.position.trim() === this.$store.state.position)&&
            (this.infoForm.phone.trim() === this.$store.state.phone)&&
            (this.infoForm.sex.trim() === this.$store.state.sex)){
                this.emitClose()
                return
            }
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
                this.emitClose()
            })
            .catch(_ => {});
        },
        cancelDialog(){
            this.emitClose()
        },
        confirmDialog(){
            this.$refs['infoForm'].validate((valid)=>{
                if (valid){
                    updateUser(this.infoForm).then((msg)=>{
                        this.$store.state.name = this.infoForm.name
                        this.$store.state.position = this.infoForm.position
                        this.$store.state.phone = this.infoForm.phone
                        this.$store.state.sex = this.infoForm.sex
                        this.$message.success('更新成功')
                        this.$EventBus.$emit("updateInfo")
                        this.emitClose()
                    })
                }
            })
        }
    }
}
</script>
