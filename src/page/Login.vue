<template>
  <div id="login_container">
    <!-- 登录页面 -->
    <div class="login_content">
      <nav class="header">
        <h3>用户名密码登录</h3>
      </nav>
      <el-form
        status-icon
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="手机/邮箱/用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="密码" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <div class="login_scan">
              <div class="scan_code">
                <p @click="ScanningArea = true">扫码登录</p>
              </div>
              <div class="register">
                <p @click="$router.push('/register')">立即注册</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-button class="btnsetting" type="primary" round @click.prevent="goLogin">登录</el-button>
      </el-row>
    </div>
    <div class="no_number">
      <p>{{Accountnumber}}</p>
    </div>
    <!-- 扫码登录页面弹出页面 -->
    <el-dialog class="qr_content"  :visible.sync="ScanningArea" id="achieve_dialog" width="20%">
      <img class="img_setting" src="../assets/images/qr.jpg" alt />
    </el-dialog>

    <div class="record_text">
      <div class="text-detail">
        <p>鲁公网安备 3754125221566号 | Copyright © 2010-2020 倪皓林网络科技股份有限公司 鲁ICP备248376261号 股票代码:1581055</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Message } from "element-ui";
import { mapState } from "vuex";
export default {
  data() {
    // 自定义用户名 验证规则
    var checkUser = (rule, value, callback) => {
      // 验证用户名的正则表达式
      // ^[\u4e00-\u9fa5]+$
      const regMobile = /^[a-z]+$/i;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法用户名"));
      }
    };
    // 自定义 密码
    var checkPwd = (rule, value, callback) => {
      const regPwd = /^\d{6,10}$/;
      if (regPwd.test(value)) {
        return callback();
      } else {
        callback(new Error("密码6~10位数字组成"));
      }
    };
    return {
      Accountnumber:'还没有账号?',
      loginForm: {
        username: "", //用户名
        password: "", //密码
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkUser, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" }
        ]
      },
      ScanningArea: false
    };
  },
  created() {
    document.onkeypress = e => {
      var keycode = document.all ? event.keyCode : e.which;
      let login;
      login = this.$route.path;
      this.login = login;
      if (this.$route.path !== '/login') {
        return;
      } else if (keycode === 13) {
        this.goLogin(); // 登录方法
        return false;
      }
    };
  },
  mounted() {
    this.$store.dispatch("getLoginInfoAction");
  },
  methods: {
    goLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid !== false) {
         let {data: res} = await this.$ajax.post("login",this.loginForm);
         if(res.meta.status !== 200) return Message.error('用户名或密码错误,请从新输入!')
         window.sessionStorage.setItem('token',res.data.token)
         Message.success('恭喜您登录成功!')
         this.$router.push('/home')
        } else {
          Message.error("请输入合法数据!");
        }
      });
    }
  },
  computed: {
    ...mapState({
      loginInfo: state => state.userInfo
    })
  }
};
</script>

<style lang="less">
#achieve_dialog .el-dialog{
  height: 50%;
  margin-top: 20vh !important;
}

</style>
<style lang="less" scoped>
#login_container {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/2.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.login_content {
  width: 500px;
  height: 400px;
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
.btn {
  position: absolute;
  top: 56.5%;
  right: 13%;
  width: 145px;
}
.el-row {
  margin-left: 23%;
  margin-top: 5%;
  text-align: center;
}
.btnsetting {
  width: 290px;
}
.login_scan {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: -126px;
}
.login_scan > .scan_code > p {
  font-size: 14px;
  font-family: "微软雅黑";
  color: #2e82ff;
  letter-spacing: 1px;
  cursor: pointer;
}
.login_scan > .register > p {
  font-size: 14px;
  font-family: "微软雅黑";
  color: #2e82ff;
  letter-spacing: 1px;
  cursor: pointer;
}
.login_scan > .register > p:hover {
  color: #9dc5ff;
}
.login_scan > .scan_code > p:hover {
  color: #9dc5ff;
}


.img_setting{
  width: 270px;
  height: 268px;
}
.no_number{
  width: 77px;
  height: 14px;
  position: absolute;
  right: 43.5%;
  bottom: 29.6%;
}
.no_number >p{
  font-size: 14px;
  color: #9b9b9b;
}



</style>