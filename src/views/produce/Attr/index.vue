<template>
  <div>
    <el-card style="margin: 0 0 20px 0;">
      <CategorySelect @getAttrInfo="getAttrInfo"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这里用v-if会错误，下面的组件表格的输入框无法渲染 -->
      <div v-show="addAndEdit">
        <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="category3Id===''">添加属性</el-button>
        <el-table border :data="data">
          <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" align="center"></el-table-column>
          <el-table-column label="属性值列表" width="800px">
            <template v-slot="{row,$index}">
              <el-tag
                type="success"
                v-for="attr in row.attrValueList"
                :key="attr.id"
                style="margin: 0 10px;"
              >{{attr.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateAttr(row)"></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeAllAttr(row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!addAndEdit">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="attrInfo.attrName===''"
        >添加属性</el-button>
        <el-button>取消</el-button>
        <el-table border style="margin: 15px 0;" class="table" :data="attrInfo.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="100px" prop="prop"></el-table-column>
          <el-table-column label="属性值名称" prop="prop">
            <template v-slot="{row}">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                v-show="row.flat"
                @blur="attrRow(row)"
                @keyup.native.enter="row.flat=false"
              ></el-input>
              <span v-show="!row.flat" @click="true">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop">
            <template v-slot="{row}">
              <el-button type="danger" icon="el-icon-delete" @click="removeAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrName==''" @click="save">保存</el-button>
        <el-button @click="addAndEdit=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//lodashi深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
  export default {
    name: 'Attr',
    data() {
      return {
        //收集子组件传来的ID
        category1Id:'',
        category2Id:'',
        category3Id:'',
        //属性列表数据
        data: [],
        //控制添加表和属性表的显示与隐藏
        addAndEdit: true,
        //新增或者修改属性
        attrInfo: {
          attrName: "",
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 3,
        },
        //控制input框和span的相互切换
        currenIndex:-1
      }
    },
    methods: {
      //删除整体属性
      async removeAllAttr(id){
        const result= await this.$API.attr.removeAttr(id)
        if(result.code===200){
          this,this.getAttrList()
        }
      },
      //删除属性
      removeAttr(row){
        //找出索引值
        const r=this.attrInfo.attrValueList.indexOf(row)
        //删除元素
        this.attrInfo.attrValueList.splice(r,1)
      },
      //修改属性
      updateAttr(row){
        //数据回显赋值
        this.attrInfo=cloneDeep(row)
        this.addAndEdit=false
      },
      //点击添加属性
      add(){
        //清楚原有数据
        this.attrInfo={
          attrName: "",
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 3,
        }
        this.addAndEdit=false
      },
      //保存
     async save(){
        // 除去添加的flat属性
          this.attrInfo.attrValueList.forEach((item)=>{
          delete item.flat
          console.log(item);
        })
        //发请求
       const result= await this.$API.attr.addAttr(this.attrInfo)
       if(result.code===200){
        this.addAndEdit=true
        this.getAttrList()
       }
      },
      //增加或修改属性
      attrRow(row){
        //判断不能输入空白属性
        if(row.valueName.trim()===''){
          this.$message('请输入属性值')
          return
        }
        //属性不能重复
       const f= this.attrInfo.attrValueList.some((item=>{
            if(item!==row){
              return item.valueName===row.valueName
            }
        }))
        if(f===true){
          this.$message('重复属性值')
          return
        }
        row.flat=false
      },
      //点击添加属性 
      addAttr(){
        this.attrInfo.attrValueList.push(
          {
            attrId: undefined,
            flat:true,
            valueName: ""
          }
        )
        this.attrInfo.categoryId=this.category3Id
      },
      //发送请求获取属性列表
       getAttrInfo({
        category1Id,
        category2Id,
        category3Id
      }) {
        this.category1Id=category1Id
        this.category2Id=category2Id
        this.category3Id=category3Id
        this.getAttrList()
      },
      //发送请求获取属性列表
     async getAttrList(){
        const result = await this.$API.attr.getAttrInfoList(this.category1Id, this.category2Id, this.category3Id)
        if (result.code === 200) {
          this.data = result.data
        }
      }
    }
  }

</script>
<style lang="scss">
</style>
