<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" @click="addMark">添加</el-button>
    <!-- 表格 -->
    <!-- data：表格的数据，必须是数组 -->
    <!-- prop：当前列展示的数据 -->
    <!-- type：对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" align="center" />
      <el-table-column prop="address" label="品牌LOGO" align="center">
        <template v-slot="{row,$index}">
          <img :src="row.logoUrl" style="width: 80px;height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template v-slot="{row}">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="update(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteMark(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器四个要素：当前页码，总条数，当前页显示条数，连续页码数 -->
    <!-- @current-change="handleCurrentChange：点击页码触发的函数，接收当前页码为形参"
    @size-change="handleSizeChange"：当前页显示条数，接收页码为形参"-->
    <el-pagination
      style="margin-top: 20px;text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[4,8,12]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
    <!-- 会话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%;" :model="tmInfo" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片组件 -->
          <!-- :on-success：文件上传成功时的钩子
          :before-upload：上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmInfo.logoUrl!==''" :src="tmInfo.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'tradeMark',
    data() {
      return {
        //当前页面
        page: 1,
        //一页显示的条数
        limit: 4,
        //品牌数据列表
        list: [],
        //总条数
        total: 0,
        //对话框
        title: '添加品牌',
        //是否显示对话框
        dialogFormVisible: false,
        //新增或修改品牌信息对象
        tmInfo: {
          tmName: '',
          logoUrl: ''
        },
        //表单验证
        rules: {
          // trigger:什么时候触发提示，blur是失去焦点，change是内容改变
          tmName: [{
              required: true,
              message: '请输入品牌名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字符',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字符',
              trigger: 'change'
            }
          ],
          logoUrl: [{
            required: true,
            message: '请选择品牌LOGO',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      // 获取品牌列表
      this.getList()
    },
    methods: {
      //删除品牌
      async deleteMark(id) {
        const result = await this.$API.tradeMark.deleteMark(id)
        if (result.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getList()
        } else {
          this.$message.error('服务器接口错误！！');
        }
      },
      //确定上传
      uploadMark() {
        //判断表单验证是否通过
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            //表单验证通过
            this.dialogFormVisible = false
            const result = await this.$API.tradeMark.getAddMarkOrUpdateMark(this.tmInfo)
            if (result.code === 200) {
              //添加或修改成功
              this.$message({
                message: this.tmInfo.id ? '修改成功！' : '添加成功！',
                type: 'success'
              });
              this.getList()
            } else {
              this.$message.error('服务器接口错误！！');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //logo上传成功的回调
      handleAvatarSuccess(res, file) {
        this.tmInfo.logoUrl = res.data
      },
      //logo上传之前的回调
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //修改品牌
      update(row) {
        this.dialogFormVisible = true
        this.title = '修改品牌'
        this.tmInfo.id = row.id
        this.tmInfo.tmName = row.tmName
        this.tmInfo.logoUrl = row.logoUrl
      },
      //点击添加品牌按钮
      addMark() {
        this.tmInfo = {
          tmName: '',
          logoUrl: ''
        }
        this.dialogFormVisible = true
        this.title = '添加品牌'
      },
      //分页器切换页码
      handleCurrentChange(page) {
        this.page = page
        this.getList()
      },
      //切换每页显示条数
      handleSizeChange(size) {
        this.limit = size
        this.getList()
      },
      //获取品牌列表
      async getList() {
        const {
          page,
          limit
        } = this
        //发送请求
        const result = await this.$API.tradeMark.getMarkList(page, limit)
        if (result.code === 200) {
          //请求成功
          this.total = result.data.total
          this.list = result.data.records
        } else {
          this.$message.error('服务器接口错误！');
        }
      }
    }
  }

</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-dialog {
  background-image: url(~@/assets/443.jpg);
  background-size: 100% 100%;
}
</style>
