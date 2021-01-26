<template>
<div>
<el-row>
    <el-col :span="12"><div class="contain-title">订单管理</div></el-col>
    <el-col :span="12"><div class="add-button"><el-button @click="createInfo" size="max" v-if="roleUser">新增</el-button></div></el-col>
</el-row>
<div class="top-search">
    <p class="filter-container">订单：</p>
    <el-input  placeholder="请输入订单账号/责任人/项目名称" v-model="pageQuery.queryString" @clear="getList" clearable style="width: 300px;" class="filter-container" />
    <el-button size="max" class="filter-container" @click="getList">查询</el-button>
</div>

<el-table ref="userTable" :data="tableData" style="width: 100%" :height="tableHeight">
    <el-table-column prop="id" label="订单号" width="150"></el-table-column>
    <el-table-column prop="project" label="项目名称" width="200"></el-table-column>
    <el-table-column prop="totalPrice" label="总价格" width="150"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
    <el-table-column prop="modifyTime" label="修改时间" width="200"></el-table-column>
    <el-table-column prop="attributor" label="责任人" width="150"></el-table-column>
    <el-table-column label="操作" width="150">
      <template slot-scope="scope">
        <el-button @click="showInfo(scope.row)" type="text" size="small">查看</el-button>
        <template v-if="roleUser">
            <el-button @click="editeInfo(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
        </template>
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
:title="modifyInfo?'修改订单'+tempID:'创建订单'"
:visible.sync="dialogVisible"
width="100%"
:before-close="handleClose">

<el-row>
    <el-col :span="12">
    <el-container :style="styleHeight">
        <el-header class="header-right">设备仓库</el-header>
        <el-main width="100%">
        <template v-for="(v1, type) in deviceObj">
            <template v-for="(v2, subType) in v1">
            <el-collapse :key="subType">
                <el-collapse-item v-for="(v3, lv) in v2" :key="lv" :name="lv">
                <template slot="title">
                <div class="h3-type h3-item">{{type}}/{{subType}}/{{lv==='high'?'高':lv==='mid'?'中':'低'}}</div>
                </template>
                <el-table ref="adTable" :data="v3" style="width: 100%">
                    <el-table-column prop="name" label="型号" width="120"></el-table-column>
                    <el-table-column prop="specify" label="规格" width="150"></el-table-column>
                    <el-table-column prop="supplier" label="供应商" width="150"></el-table-column>
                    <el-table-column label="价格" width="100">
                        <template slot-scope="{row}">
                            <span>{{ row.price}}/{{row.unit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="recommend" label="推荐" width="150">
                        <template slot-scope="{row}">
                        <el-rate v-model="row.recommend" disabled :colors="colors" style="margin-top:10px;"></el-rate>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                    <template slot-scope="{row}">
                        <el-button @click="selectToOrder(row)" type="primary" size="small">添加</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                </el-collapse-item>
            </el-collapse>    
            </template>
        </template>
        </el-main>
    </el-container>
    </el-col>
    <el-col :span="12">
    <el-container :style="styleHeight">
        <el-header class="header-left">订单详情</el-header>
        <el-main width="100%">
        <el-header>
            <el-input v-model="tempProject" placeholder="请输入项目名称"></el-input>
        </el-header>
        <el-main :style="subHeight">
            <template v-for="(v1, type) in tempOrderObj">
                <span class="h3-type" :key="type">{{type}}</span>
                <el-table :key="type+'1'" ref="adTable" :data="v1" style="width: 100%">
                    <el-table-column prop="name" label="型号" width="150"></el-table-column>
                    <el-table-column prop="specify" label="规格" width="150"></el-table-column>
                    <el-table-column prop="supplier" label="供应商" width="150"></el-table-column>
                    <el-table-column prop="price" label="价格" width="100"></el-table-column>
                    <el-table-column prop="unit" label="单位" width="70"></el-table-column>
                    <el-table-column prop="num" label="数量" width="70">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="numDevice(scope.row,scope.row.num)">{{scope.row.num}}</el-link>
                    </template>
                    </el-table-column>
                    <el-table-column prop="total" label="总价" width="70"></el-table-column>
                    <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removeDevice(scope.row)">移除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-main>
        <el-footer>
            <span>总价：{{tempTotalPrice}}元</span>
        </el-footer>
        </el-main>
    </el-container>
    </el-col>
</el-row>

<el-dialog width="250px" title="输入数量" append-to-body :visible.sync="numVisible">
    <el-input-number v-model="tempNum" :min="1" label="输入数量"></el-input-number>
    <span slot="footer" class="dialog-footer">
    <el-button @click="numVisible=false">取 消</el-button>
    <el-button type="primary" @click="confirmNum">确 定</el-button>
    </span>
</el-dialog>

<span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="confirmDialog">{{modifyInfo?'更新':'提交'}}订单</el-button>
</span>
</el-dialog>

<el-dialog :title="'订单：'+tempID"
:visible.sync="showVisible"
width="1050px">
<el-container :style="styleHeight">
    <el-header>{{tempProject}}</el-header>
    <el-main width="100%">
    <el-main >
        <template v-for="(v1, type) in tempOrderObj">
            <span class="h3-type" :key="type">{{type}}</span>
            <el-table :key="type+'1'" ref="adTable" :data="v1" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="型号" width="150"></el-table-column>
                <el-table-column prop="specify" label="规格" width="200"></el-table-column>
                <el-table-column prop="supplier" label="供应商" width="200"></el-table-column>
                <el-table-column prop="price" label="价格" width="100"></el-table-column>
                <el-table-column prop="unit" label="单位" width="70"></el-table-column>
                <el-table-column prop="num" label="数量" width="70">
                <template slot-scope="scope">
                    <el-link>{{scope.row.num}}</el-link>
                </template>
                </el-table-column>
                <el-table-column prop="total" label="总价" width="70"></el-table-column>
            </el-table>
        </template>
    </el-main>
    <el-footer>
        <span>总价：{{tempTotalPrice}}元</span>
    </el-footer>
    </el-main>
</el-container>
<span slot="footer" class="dialog-footer">
<el-button @click="showVisible=false">取 消</el-button>
<el-button @click="downloadOrder" type="primary">下载订单</el-button>
</span>
</el-dialog>

</div >   
</template>
<script>
import {createOrder, updateOrder, orderList, deleteOrder, exportOrder} from '@/api/order'
import {deviceArray} from '@/api/device'
import fileDownload from 'js-file-download'
export default {
    data(){
        return{
            colors:['#99A9BF', '#F7BA2A', '#FF9900'],
            activeNames:"3",
            roleUser: this.$store.state.role==='user',
            totalNum:0,
            pageQuery:{
                pageNum:1,
                perNum:20,
                queryString:''
            },
            tableHeight:500,
            tableData: [],
            dialogVisible:false,
            showVisible:false,
            modifyInfo:false,
            allDevice:{},
            deviceObj:{},
            tempID:"",
            tempProject:"",
            tempTotalPrice:0,
            tempOrderObj:{},
            numVisible:false,
            tempNum:0,
            tempRow:{}
        }
    },
    methods:{
        downloadOrder(){
            exportOrder({id:this.tempID}).then((msg)=>{
                fileDownload(msg, this.tempID+'.xlsx')
            })
        },
        numDevice(row, num){
            this.tempRow = row
            this.tempNum = num
            this.numVisible = true
        },
        confirmNum(){
            this.numVisible = false
            this.setDeviceNum(this.tempRow, this.tempNum)
        },
        removeDevice(row){
            this.$confirm('确认移除该设备'+row.id+'？')
            .then(_ => {
                this.setDeviceNum(row, 0)
            })
            .catch(_ => {});
        },
        setDeviceNum(row, num){
            if (!(row.type in this.tempOrderObj)){
                return
            }
            let dArray = this.tempOrderObj[row.type]
            let newArray = []
            let tempPrice = 0
            for (let i=0; i<dArray.length; i++){
                let tO = dArray[i]
                if (tO.id === row.id){
                    if (num <=0 ){
                        tempPrice = -tO.total
                        continue
                    }
                    tempPrice = tO.total
                    tO.total = num * tO.price
                    tempPrice = tO.total - tempPrice
                    tO.num = num
                    newArray.push(tO)
                }else{
                    newArray.push(tO)
                }
            }
            if (tempPrice == 0) return
            this.tempTotalPrice = this.tempTotalPrice + tempPrice
            this.$set(this.tempOrderObj, row.type, newArray)
        },
        selectToOrder(row, num=1){
            let dArray = []
            if (row.type in this.tempOrderObj){
                dArray = this.tempOrderObj[row.type]
            }
            let b = true
            let tempPrice = 0
            for (let i=0; i<dArray.length; i++){
                let tO = dArray[i]
                if (tO.id === row.id){
                    b = false
                    let t = tO.total
                    tO.num = tO.num + num
                    tO.total = tO.num * tO.price
                    tempPrice = tO.total - t
                    break
                }
            }
            if (b){
                tempPrice = row.price * num
                dArray.push(Object.assign({num:num, total:tempPrice}, row))
            }
            this.tempTotalPrice = this.tempTotalPrice + tempPrice
            this.$set(this.tempOrderObj, row.type, dArray)
        },
        getList(){
            orderList(this.pageQuery).then((msg)=>{
                this.tableData = msg.data.array
                this.totalNum = msg.data.totalNum
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                this.dialogVisible = false
                done();
            })
            .catch(_ => {});
        },
        confirmDialog(){
            let project = this.tempProject.trim()
            if (project.length == 0){
                this.$message.warning("请输入项目名称")
                return
            }
            let deviceObj = {}
            for (let v of Object.values(this.tempOrderObj)){
                for (let i =0; i<v.length; i++){
                    let item = v[i]
                    deviceObj[item.id] = item.num
                }
            }
            let orderObj = {}
            orderObj.project = project
            orderObj.obj = deviceObj
            orderObj.id = this.tempID
            console.log(orderObj)
            if (this.modifyInfo){
                updateOrder(orderObj).then((msg)=>{
                    this.dialogVisible = false
                    this.$message.success("更新订单成功")
                    this.getList()
                })
            }else{
                createOrder(orderObj).then((msg)=>{
                    this.dialogVisible = false
                    this.$message.success("创建订单成功")
                    this.getList()
                })
            }          
        },
        createInfo(){
            this.tempProject = ""
            this.tempID = ""
            this.tempOrderObj = {}
            this.tempTotalPrice = 0

            this.modifyInfo = false
            this.dialogVisible = true
        },
        editeInfo(row){
            this.tempProject = row.project
            this.tempID = row.id
            this.tempOrderObj = {}
            this.tempTotalPrice = 0
            for (let k of Object.keys(row.obj)){
                this.selectToOrder(this.allDevice[k], row.obj[k])
            }

            this.modifyInfo = true
            this.dialogVisible = true
        },
        deleteInfo(row){
            this.$confirm("确认删除订单："+row.id+"?")
            .then(_ => {
                deleteOrder({id:row.id}).then((msg)=>{
                this.$message.success('删除成功')
                this.getList()
                });
            })
            .catch(_ => {});
        },
        showInfo(row){
            this.tempProject = row.project
            this.tempID = row.id
            this.tempOrderObj = {}
            this.tempTotalPrice = 0
            for (let k of Object.keys(row.obj)){
                this.selectToOrder(this.allDevice[k], row.obj[k])
            }
            this.showVisible = true
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
    computed:{
        styleHeight(){
            return {height: (this.tableHeight) + 'px'}
        },
        subHeight(){
            return {height: (this.tableHeight-220) + 'px'}
        }
    },
    created(){
        this.getList()
        deviceArray().then(response => {
            this.allDevice = response.data.allDevice
            this.deviceObj = response.data.deviceObj
        })
    }
}
</script>

<style>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.header-left{
    font-size: 18px;
    font-weight: 550;
    margin-left: 15px;
}

.header-right{
    font-size: 18px;
    font-weight: 550;
    margin-right: 15px;
}
  
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}
  
.el-main {
    background-color: #E9EEF3;
    color: #333;
    /*text-align: center;*/
    /*line-height: 160px;*/
}
  
body > .el-container {
    margin-bottom: 40px;
}

.h3-item{
    margin-left: 25px;
}

.h3-type{
    margin-left: 5px;
    font-size: 18px;
    font-weight: 530;
}
</style>