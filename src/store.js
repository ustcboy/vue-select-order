import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

var store = new Vuex.Store({
    // plugins: [createPersistedState({
    //     storage: window.sessionStorage
    // })],
    state:{
        account:'admin',
        name:'管理员',
        avator:require('@/assets/img/avator.jpg'),
        role:'any',
        position:'管理员',
        phone:'15372419769',
        collapse:false,
        sex:'男'
    }
})

function replaceState(srcObj, tempObj){
    if (tempObj.role) srcObj.role = tempObj.role;
    if (tempObj.account) srcObj.account = tempObj.account;
    if (tempObj.name) srcObj.name = tempObj.name;
    if (tempObj.position) srcObj.position = tempObj.position;
    if (tempObj.collapse) srcObj.collapse = tempObj.collapse
    if (tempObj.phone) srcObj.phone = tempObj.phone;
    if (tempObj.avator) srcObj.avator = tempObj.avator;
    if (tempObj.sex) srcObj.sex = tempObj.sex;
}

if (sessionStorage.getItem('store')) {
    replaceState(store.state, JSON.parse(sessionStorage.getItem('store')));
}

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('store', JSON.stringify(store.state));
})

export default store