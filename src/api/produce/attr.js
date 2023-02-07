// 平台属性API
import request from '@/utils/request'
//获取一级分类
export const getCategory1=()=>request.get('/admin/product/getCategory1')
//获取二级分类
export const getCategory2=(category1Id)=>request.get(`/admin/product/getCategory2/${category1Id}`)
//获取三级分类
export const getCategory3=(category2Id)=>request.get(`/admin/product/getCategory3/${category2Id}`)
//获取商品基础属性列表
export const getAttrInfoList=(category1Id,category2Id,category3Id)=>request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
//增加或修改属性
export const addAttr=(data)=>request({method:'post',data:data,url:'/admin/product/saveAttrInfo'})
//删除属性
 export const removeAttr=(attrId)=>request.delete(`/admin/product/deleteAttr/${attrId}`)