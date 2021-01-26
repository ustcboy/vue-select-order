<template>
<div>
<el-row>
  <el-col :span="24"><h1>欢迎回来 {{name}}</h1></el-col>
</el-row>
<el-row>
  <el-col :span="24"><el-calendar v-model="value"></el-calendar></el-col>
</el-row>
</div>
</template>
<script>
export default {
    data(){
        return{
            value: new Date(),
            name: this.$store.state.name,
        }
    },
    beforeCreate(){
        if (this.$store.state.role === 'any'){
            this.$router.push('/login')
        }
    },
    created(){
        this.$EventBus.$on('updateInfo', ()=>{
            this.name=this.$store.state.name
        })
    }
}
</script>