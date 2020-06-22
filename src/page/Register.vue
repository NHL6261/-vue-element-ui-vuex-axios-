<template>
  <div id="register_container">
    <!-- 注册页面 -->
    <div class="register_content">
      <nav class="header">
        <h3>欢迎注册</h3>
        <div class="login">
          <span>已有账号?</span>
          <p @click="$router.push('/login')">登录</p>
        </div>
      </nav>
      <el-form
        status-icon
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请设置用户名" v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item ref="phone" label="手机号" prop="phone">
          <el-input placeholder="可用于登录和找回密码" v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            type="password"
            placeholder="请设置登录密码"
            v-model="registerForm.pwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="verification">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="验证码" prop="verification">
                <el-input maxlength="6" placeholder="请输入验证码" v-model="registerForm.verification"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button class="btn" @click="getCode">获取验证码</el-button>
        </div>
      </el-form>
      <el-row>
        <el-button class="btnsetting" type="primary" round @click.prevent="goregister">注册</el-button>
      </el-row>
    </div>
    <div class="record_text">
      <div class="text-detail">
        <p>鲁公网安备 3754125221566号 | Copyright © 2010-2020 倪皓林网络科技股份有限公司 鲁ICP备248376261号 股票代码:1581055</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Message } from "element-ui";
export default {
  data() {
    // 自定义用户名 验证规则
    var checkUser = (rule, value, callback) => {
      // 验证用户名的正则表达式
      const regMobile = /^[\u4e00-\u9fa5]+$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法用户名"));
      }
    };
    var checkMobil = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    // 自定义 密码
    var checkPwd = (rule, value, callback) => {
      const regPwd = /^[a-zA-Z][0-9a-zA-Z_]{3,17}/;
      if (regPwd.test(value)) {
        return callback();
      } else {
        callback(new Error("密码是由英文,数字,下划线组成"));
      }
    };
    var checkVerification = (rule, value, callback) => {
      // 验证验证码
      const regMobile = /^^[0-9]{6}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确验证码"));
      }
    };
    return {
      registerForm: {
        username: "", //用户名
        pwd: "", //密码
        verification: "", //验证码
        phone: ""
      },
      registerRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkUser, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobil, trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" }
        ],
        verification: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: checkVerification, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    document.onkeypress = e => {
      var keycode = document.all ? event.keyCode : e.which;
      let login;
      login = this.$route.path;
      this.login = login;
      if (this.$route.path !== login) {
        return;
      } else if (keycode === 13) {
        this.goregister(); // 登录方法
        return false;
      }
    };
  },
  methods: {
    getCode() {
      // 前端预验证
      this.$refs.registerForm.validateField("phone", async phoneDetail => {
        if (!phoneDetail) {
          Message.success("验证码发送成功,请注意查收!");

          //   let { phone } = this.registerForm;
          //   let result = await this.$http.getCodeDetail({ phone });
          //   if (result.status === 200) {
          //     Message.success("验证码发送成功,请注意查收!");
          this.$refs.registerForm.resetFields();
          //   } else {
          //     Message.error("访问出错,请联系管理员!");
          //   }
          // } else {
          //   Message.error("请输入合法数据!");
        }
      });
    },
    goregister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid !== false) {
          Message.success("恭喜您,注册成功!");
          this.$router.push("/login");
          //   let { username, pwd, verification, phone } = this.registerForm;
          //   let result = await this.$http.getRegisterDetail({
          //     username,
          //     pwd,
          //     verification,
          //     phone
          //   });
          //   if (result.status === 200) {
          //     Message.success("恭喜您,注册成功");
          //     this.$router.push("/login");
          //   } else {
          //     Message.error("访问出错,请联系管理员!");
          //   }
        } else {
          Message.error("请输入合法数据!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#register_container {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/2.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.register_content {
  width: 600px;
  height: 500px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 90px 80px 0 10px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-top: 5px solid blue;
  box-shadow: 0 0 9px 0 rgba(92, 128, 255, 0.17);
  position: relative;
}
.record_text {
  width: 100%;
  position: absolute;
  left: 20%;
  bottom: 5px;
  .text-detail > p {
    font-family: "微软雅黑";
    font-size: 16px;
    color: #fff;
  }
}
.header > h3 {
  position: absolute;
  top: -5%;
  left: 3%;
  transform: translate(-5%, -10%);
  font-size: 36px;
  font-family: "微软雅黑";
}
.header > .login {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 3%;
  top: 11%;
}
.header > .login > span {
  font-size: 14px;
  color: #9b9b9b;
}
.header > .login > p {
  color: #2e58ff;
  cursor: pointer;
  font-size: 14px;
  margin-left: 7px;
}
.header > .login > p:hover {
  color: #0f3cf2;
  font-weight: 500;
}
.btn {
  position: absolute;
  top: 56.5%;
  right: 13%;
  width: 145px;
}
.el-row {
  margin-left: 19%;
  margin-top: 5%;
  text-align: center;
}
.btnsetting {
  width: 400px;
}

</style>