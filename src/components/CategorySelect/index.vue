<template>
  <div>
    <!-- 三级联动组件 -->
    <el-form :inline="true" class="demo-form-inline" :model="categoryId">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="categoryId.category1Id" @change="getCategory2">
          <el-option :label="cg.name" :value="cg.id" v-for="cg in list1" :key="cg.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="categoryId.category2Id" @change="getCategory3">
          <el-option :label="cg2.name" :value="cg2.id" v-for="cg2 in list2" :key="cg2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="categoryId.category3Id" @change="setID">
          <el-option :label="cg3.name" :value="cg3.id" v-for="cg3 in list3" :key="cg3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'categorySelect',
  data() {
      return {
        categoryId:{
          category1Id:'',
          category2Id:'',
          category3Id:''
        },
        //一级分类数据
        list1:[],
        //二级分类数据
        list2:[],
        //三级分类数据
        list3:[]
      }
    },
    mounted(){
      //获取一级分类
      this.getCategory1()
    },
    methods:{
      //发送Id至attr组件，用户发请求获取属性信息
      setID(){
        this.$emit('getAttrInfo',this.categoryId)
      },
      //获取3级分类
      async getCategory3(){
        this.categoryId.category3Id=''
        const result= await this.$API.attr.getCategory3(this.categoryId.category2Id)
        if(result.code===200){
          this.list3=result.data
        }
      },
      //获取2级分类
     async getCategory2(){
        //重新选择之前清空1和2的数据
        this.categoryId.category2Id=''
        this.categoryId.category3Id=''
        const result= await this.$API.attr.getCategory2(this.categoryId.category1Id)
        if(result.code===200){
          this.list2=result.data
        }
      },
      //获取1级分类
     async getCategory1(){
       const result= await this.$API.attr.getCategory1()
       if(result.code===200){
        this.list1=result.data
       }
      }
    }
}
</script>

<style>
</style>