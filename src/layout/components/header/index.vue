<template>
    <div class="header">
        <el-image fit="contain" class="logo" :src="logoUrl"/>
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="collapse" class="el-icon-s-unfold"/>
            <i v-else class="el-icon-s-fold"/>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" placement="bottom" :content="fullscreen?'取消全屏':'全屏'">
                        <i v-if="fullscreen" class="el-icon-full-screen"/>
                        <i v-else class="el-icon-rank"/>
                    </el-tooltip>
                </div>
                <div class="user-avator">
                    <img :src="avator"/>
                </div>
                <el-dropdown class="user-name" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{name}}
                        <i class="el-icon-caret-bottom"/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-user" command="info">个人设置</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-lock" command="password">密码设置</el-dropdown-item>
                        <el-dropdown-item style="float:left;" icon="el-icon-switch-button" divided command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <info-dialog :visible="infoVisible" @close="handleClose"/>
        <password-dialog :visible="passwordVisible" @close="handleClose"/>
    </div>
</template>

<script>
import InfoDialog from './components/modifyInfo'
import PasswordDialog from './components/modifyPassword'
import {logout} from '@/api/user'
export default {
    components:{
        InfoDialog,
        PasswordDialog
    },
    data(){
        return {
            name: this.$store.state.name,
            avator:this.$store.state.avator,
            collapse:this.$store.state.collapse,
            fullscreen:false,
            role:this.$store.state.role,
            message:2,
            logoUrl:require('@/assets/img/logo.png'),
            infoVisible:false,
            passwordVisible:false
        };
    },
    methods:{
        collapseChage(){
            if (this.collapse){
                this.collapse = false
            }else{
                this.collapse = true
            }
            this.$store.state.collapse = this.collapse
            this.$EventBus.$emit("collapse", this.collapse)
        },
        handleCommand(command){
            if (command === 'info'){
                this.infoVisible = true
            }else if(command === 'password'){
                this.passwordVisible = true
            }else if (command === 'logout'){
                this.$confirm('确认退出登录？')
                .then(_ => {
                    this.$store.state.role = 'any'
                    this.$router.push('/login')
                    logout().then((msg)=>{
                        this.$message.success('退出登录')
                    })
                })
                .catch(_ => {});
            }
        },
        handleClose(command){
            if (command === 'info'){
                this.name = this.$store.state.name;
                this.infoVisible = false
            }else if(command === 'password'){
                this.passwordVisible = false
            }
        },
        handlePassword(){
            this.passwordVisible = true;
        },
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    }
}
</script>

<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    margin-left: 20px;
    float: left;
    width: 300px;
    height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
