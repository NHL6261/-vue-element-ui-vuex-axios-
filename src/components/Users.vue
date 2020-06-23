<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 使用作用域插槽来解决每行的状态 如果使用 scope 则不需要 prop -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="useStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" circle placement="top" :enterable="false">
              <el-button type="warning" circle icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- layout用来展示 分页的效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户dload框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主题区域 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormrules"
        ref="addUserFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  data() {
    //  自定义验证 用户名
    var checkUser = (rule, value, callback) => {
      const regUser = /^[a-z]+$/i;
      if (regUser.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入3-10位小写字母"));
      }
    };
    // 自定义密码
    var checkPwd = (rule, value, callback) => {
      const regPwd = /^\d{6,10}$/;
      if (regPwd.test(value)) {
        return callback();
      } else {
        callback(new Error("密码是由英文,数字,下划线组成"));
      }
    };
    //  自定义验证规则 验证email
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法邮箱"));
      }
    };
    // 自定义手机号 验证规则
    var checkMobil = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法手机号"));
      }
    };
    return {
      queryInfo: {
        query: "", // 查询参数,
        pagenum: 1, //当前页数 和 分页 current-page 相结合
        pagesize: 2 //每页的显示条数 和 page-size 相结合
      },
      // 添加用户的表单数据
      addUserForm: {
        username: "", //用户名
        password: "", // 密码
        email: "", // 邮箱
        mobile: "" // 电话
      },
      editForm: {}, // 根据id 存放用户信息
      userlist: [], //所有的用户列表
      total: 0, // 总的数据条数
      addDialogVisible: false, //控制弹出框的显示与隐藏
      editDialogVisible:false, // 修改信息
      // 添加表单验证的规则区域
      addUserFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkUser, trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10个字母之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobil, trigger: "blur" }
        ]
      },
      // 修改信息验证
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobil, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
    let pagenum = window.sessionStorage.getItem("pagenum");
    this.pagenum = pagenum;
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$ajax.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听 页面数 改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      window.sessionStorage.setItem("pagenum", newpage);
      this.getUserList();
    },
    // 监听switch开关的状态改变
    async useStateChange(userinfo) {
      let { data: res } = await this.$ajax.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return Message.error("状态更新失败,请检查网络设置!");
      } else {
        Message.success("状态更新成功!");
      }
    },
    // 添加用户
    addUsers() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid !== false) {
          let { data: res } = await this.$ajax.post("users", this.addUserForm);
          if (res.meta.status !== 201) {
            Message.error("添加用户失败,请检查网络设置~");
          } else {
            Message.success("添加用户成功!");
            this.addDialogVisible = false;
            // 从新刷新列表
            this.getUserList();
          }
        } else {
          Message.error("请输入合法数据!");
        }
      });
    },
    // 对话框 关闭监听事件
    addDialogClose() {
      this.$refs.addUserFormRef.resetFields();
    },

    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$ajax.get("users/" + id);
      if (res.meta.status !== 200) {
        return Message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$ajax.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          return Message.error("更新用户信息失败！");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        Message.success("更新用户信息成功！");
      });
    }
  }
};
</script>

<style lang="less">
// .box-card {
//   width: 480px;
// }
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
<style lang="less" scoped>
</style>