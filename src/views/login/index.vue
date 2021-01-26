<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">订单管理系统</div>
            <el-form :model="info" :rules="rules" ref="loginInfo" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="info.name" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="info.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {login} from '@/api/user'
import md5 from 'js-md5'
export default {
    data: function() {
        return {
            info: {
                name: '',
                password: '',
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.loginInfo.validate(valid => {
                if (valid) {
                    login({account: this.info.name, password: md5(this.info.password)}).then((msg)=>{
                        this.$message.success('登录成功');
                        if (msg.data.role) this.$store.state.role = msg.data.role;
                        if (msg.data.account) this.$store.state.account = msg.data.account;
                        if (msg.data.phone) this.$store.state.phone = msg.data.phone;
                        if (msg.data.position) this.$store.state.position = msg.data.position;
                        if (msg.data.name) this.$store.state.name = msg.data.name
                        if (msg.data.sex) this.$store.state.sex = msg.data.sex

                        this.$router.push('/');
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>