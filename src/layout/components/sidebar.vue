<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="this.$router.path"
            :collapse="collapse"
            background-color="#324157"
            text-color="#dfebf9"
            active-text-color="#20a0ff"
            unique-opened
            router>
            <template v-for="item in items">
                <el-menu-item :index="item.path" :key="item.path">
                    <i :class="item.meta.icon"/>
                    <span class="title-text" slot="title">{{item.meta.title}}</span>
                </el-menu-item>
                <el-divider :key="item.index" class="divider"></el-divider>
            </template>
        </el-menu>
    </div>
</template>

<script>
import {cRouters} from '@/router'
export default {
    created(){
        this.$EventBus.$on("collapse", val=>{
            this.collapse = val
        });
        let role = this.$store.state.role
        console.log(role)
        for (let i = 0; i<cRouters.length; i++){
            let item = cRouters[i]
            let roles = item.meta.role
            for (let j=0; j<roles.length; j++){
                if (role === roles[j]){
                    this.items.push(item)
                    break
                }
            }
        }
    },
    data(){
        return{
            collapse:this.$store.state.collapse,
            items:[]
        }
    },
    methods:{
        
    }
    
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
.title-text{
    font-size: 16px;
    font-weight:550;
}
.divider{
    margin: 0;
    padding: 0;
    border: #000;
}
</style>
