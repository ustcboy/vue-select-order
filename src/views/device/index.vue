<template>
<div>
<el-row>
    <el-col :span="12"><div class="contain-title">{{roleAdmin?'设备管理':'设备仓库'}}</div></el-col>
    <el-col :span="12"><div class="add-button">
        <el-button v-if="roleAdmin" size="max" @click="createInfo">新增</el-button>
    </div></el-col>
</el-row>
<div class="top-search">
    <p class="filter-container">设备：</p>
    <el-input  placeholder="请输入设备类型/子类型/型号" v-model="pageQuery.queryString" @clear="getList" clearable style="width: 300px;" class="filter-container" />
    <el-select class="quality-select" v-model="pageQuery.quality" clearable @clear="getList" placeholder="等级">
        <el-option label="高" value="high"></el-option>
        <el-option label="中" value="mid"></el-option>
        <el-option label="低" value="low"></el-option>
    </el-select>
    <el-button size="max" class="filter-container" @click="getList">查询</el-button>
</div>

<el-table ref="deviceTable" :data="tableData" style="width: 100%" :height="tableHeight">
    <el-table-column prop="type" label="类型" width="150"></el-table-column>
    <el-table-column prop="subType" label="子类型" width="150"></el-table-column>
    <el-table-column prop="quality" label="等级" width="70">
        <template slot-scope="{row}">
          <span>{{ row.quality==='high'? '高':row.quality==='mid'?'中':'低' }}</span>
        </template>
    </el-table-column>
    <el-table-column prop="name" label="型号" width="150"></el-table-column>
    <el-table-column prop="specify" label="规格" width="150"></el-table-column>
    <el-table-column prop="supplier" label="供应商" width="150"></el-table-column>
    <el-table-column prop="unit" label="单位" width="70"></el-table-column>
    <el-table-column prop="price" label="价格" width="100"></el-table-column>
    <el-table-column v-if="roleAdmin" prop="cost" label="成本" width="100"></el-table-column>
    <el-table-column prop="recommend" label="推荐" width="150">
        <template slot-scope="{row}">
          <el-rate v-model="row.recommend" disabled :colors="colors" style="margin-top:10px;"></el-rate>
        </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
    <el-table-column prop="modifyTime" label="修改时间" width="160"></el-table-column>
    <el-table-column prop="remark" label="备注" width="150"></el-table-column>
    <el-table-column v-if="roleAdmin" label="操作" width="100">
      <template slot-scope="scope">
        <el-button @click="editeInfo(scope.row)" type="text" size="small">编辑</el-button>
        <el-button type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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
:title="modifyInfo?'修改设备信息'+tempData.name:'新建设备信息'"
:visible.sync="dialogVisible"
width="60%"
:before-close="handleClose">
    <el-form :model="tempData" :rules="rules" ref="deviceForm" class="demo-ruleForm dialog-margin">
        <el-row><el-col :span="11">
        <el-form-item label="类型" prop="type">
            <el-select :disabled="modifyInfo" style="width: 100%" v-model="tempData.type" filterable allow-create placeholder="请选择设备主类型">
                <el-option v-for="t in typeOpthions" :key="t.type" :label="t.type" :value="t.type"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="quality">
            <el-select style="width: 100%" v-model="tempData.quality">
                <el-option label="高" value="high"/>
                <el-option label="中" value="mid"/>
                <el-option label="低" value="low"/>
            </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="name">
            <el-input v-model="tempData.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
           <el-input-number style="width: 100%" :min="0" :precision="2" :step="0.01" v-model="tempData.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
            <el-input v-model="tempData.supplier"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="1"><div class="grid-content"></div></el-col>
        <el-col :span="12">
        <el-form-item label="子类型" prop="subType">
            <el-select style="width: 100%" v-model="tempData.subType" filterable allow-create placeholder="请选择设备子类型">
            <template v-for="t in typeOpthions">
                <template v-if="t.type===tempData.type">
                    <el-option v-for="st in t.subType"  :key="st" :label="st" :value="st"></el-option>
                </template>
            </template>
            </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
            <el-select style="width: 100%" v-model="tempData.unit">
                <el-option label="台" value="台"/>
                <el-option label="套" value="套"/>
            </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specify">
            <el-input v-model="tempData.specify"></el-input>
        </el-form-item>
        <el-form-item label="成本" prop="cost">
            <el-input-number style="width: 100%" :min="0" :precision="2" :step="0.01" v-model="tempData.cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
            <el-input v-model="tempData.remark"></el-input>
        </el-form-item>
        </el-col></el-row>
        <el-form-item label="推荐" prop="recommend">
            <el-rate v-model="tempData.recommend" :colors="colors" style="margin-top:10px;"></el-rate>
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
import {createDevice, updateDevice, deviceList, deleteDevice, deviceType} from '@/api/device'
export default {
    data(){
        return{
            roleAdmin:this.$store.state.role==='admin',
            colors:['#99A9BF', '#F7BA2A', '#FF9900'],
            typeOpthions:[],
            totalNum:0,
            pageQuery:{
                pageNum:1,
                perNum:20,
                quality:'',
                queryString:''
            },
            tableHeight:500,
            tempData:{
                type:"",
                quality:"",
                subType:"",
                name:"",
                specify:"",
                supplier:"",
                unit:"",
                price:0,
                cost:0,
                recommend:1,
                remark:""
            },
            tableData: [],
            dialogVisible:false,
            modifyInfo:false,
            rules: {
                type: [
                    { required: true, message: '请输入设备类型', trigger: 'blur' }
                ],
                quality: [
                    { required: true, message: '请输入设备等级', trigger: 'blur' }
                ],
                subType: [
                    { required: true, message: '请输入设备子类型', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入设备型号', trigger: 'blur' }
                ],
                specify: [
                    { required: true, message: '请输入设备规格', trigger: 'blur' }
                ],
                supplier: [
                    { required: true, message: '请输入供应商', trigger: 'blur' }
                ],
                unit: [
                    { required: true, message: '请输入单位', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                ],
                cost: [
                    { required: true, message: '请输入成本', trigger: 'blur' }
                ],
                recommend: [
                    { required: true, message: '请输入推荐等级', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        getList(){
            deviceList(this.pageQuery).then((msg)=>{
                this.tableData = msg.data.array
                this.totalNum = msg.data.totalNum
            })
        },
        handleClose(done) {
            if (this.tempData.type.trim().length +
               this.tempData.subType.trim().length+
               this.tempData.name.trim().length+
               this.tempData.specify.trim().length+
               this.tempData.supplier.trim().length==0){
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
            this.$refs['deviceForm'].validate((valid) => {
                if (valid){
                    if (this.modifyInfo){
                        updateDevice(this.tempData).then((msg)=>{
                            this.$message.success('更新成功')
                            this.dialogVisible = false
                            this.getList()
                        })
                    }else{
                        createDevice(this.tempData).then((msg)=>{
                            this.$message.success('创建成功')
                            this.dialogVisible = false
                            this.getList()
                        })
                    }
                }
            })
        },
        createInfo(){
            deviceType().then((msg)=>{
                this.typeOpthions = msg.data
                this.tempData.id = ""
                this.tempData.type = ""
                this.tempData.quality = "mid"
                this.tempData.subType = ""
                this.tempData.name = ""
                this.tempData.specify = ""
                this.tempData.supplier = ""
                this.tempData.unit = "台"
                this.tempData.price = ""
                this.tempData.cost = ""
                this.tempData.recommend = 1
                this.tempData.remark = ""
                this.modifyInfo = false
                this.dialogVisible = true
            })
        },
        editeInfo(row){
            deviceType().then((msg)=>{
                this.typeOpthions = msg.data
                this.tempData = Object.assign({}, row)
                this.modifyInfo = true
                this.dialogVisible = true
            })
        },
        deleteInfo(row){
            this.$confirm("确认删除设备："+row.id+"?")
            .then(_ => {
                deleteDevice({id:row.id}).then((msg)=>{
                this.$message.success('删除成功')
                this.getList()
                });
            })
            .catch(_ => {});
        }
    },
    mounted:function(){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.deviceTable.$el.offsetTop - 200;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.deviceTable.$el.offsetTop - 200
            }
        })
    },
    created(){
        this.getList()
    }
}
</script>
<style>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.quality-select{
    width: 100px;
    margin-right: 10px;
}
</style>