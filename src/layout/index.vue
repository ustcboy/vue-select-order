<template>
    <div class="wrapper">
        <v-head/>
        <v-sidebar/>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive>
                        <router-view />
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './components/header'
import vSidebar from './components/sidebar'
export default {
    data(){
        return {
            collapse:this.$store.state.collapse
        }
    },
    components:{
        vHead,
        vSidebar
    },
    created(){
        this.$EventBus.$on('collapse', val=>{
            this.collapse = val
        });
    }
}
</script>