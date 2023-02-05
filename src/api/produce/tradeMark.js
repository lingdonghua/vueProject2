// 品牌管理的api
import request from '@/utils/request'
// 获取品牌列表
export const getMarkList = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)
// 新增或修改品牌
export const getAddMarkOrUpdateMark=(tmInfo)=>{
  if(tmInfo.id){
    //修改操作
    return request({method:'put',data:tmInfo,url:'/admin/product/baseTrademark/update'})
  }else{
    //新增操作
    return request({method:'post',data:tmInfo,url:'/admin/product/baseTrademark/save'})
  }
}
//删除品牌
export const deleteMark=(id)=>request.delete(`/admin/product/baseTrademark/remove/${id}`)