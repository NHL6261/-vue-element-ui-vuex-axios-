<template>
  <div id="home_container">
    <div class="home_header">
      <div class="left_contianer">
        <div class="img_container">
          <img src="@/assets/images/2.jpg" alt />
        </div>
        <div class="text_container">
          <p>欢迎回来倪皓林</p>
        </div>
      </div>
      <div class="right_exit">
        <el-button class="btn" @click="Exitdialog = true" type="warning">退出</el-button>
      </div>
    </div>
    <!-- 页面主要布局 -->
    <el-container id="container_main">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'250px'">
        <!-- 折叠与展开 -->
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <!-- 侧边栏区域 -->
        <el-menu
          background-color="#333"
          text-color="#fff"
          active-text-color="#ff7500"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" >
            <!-- 一级菜单的模板区域 -->

            <template slot="title">
              <i :class="IconObj[item.id]"></i>
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + submenu.path "
              v-for="submenu in item.children"
              :key="submenu.id"
              @click="savaNavState('/' + submenu.path)"
            >
              <template slot="title">
                <i :class="RolesObj[submenu.id]"></i>
                <span>{{submenu.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <!-- 退出提醒 -->
    <el-dialog title="警告!" id="exit_setting" :visible.sync="Exitdialog" width="20%">
      <span>您确定要退出吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Exitdialog = false">取 消</el-button>
        <el-button type="primary" @click="exitfn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Col, Message } from "element-ui";
export default {
  data() {
    return {
      Exitdialog: false,
      menuList: [],
      activePath:'', //被激活的链接地址
      isCollapse:false,
      // 一级菜单
      IconObj: {
        "101": "iconfont icon-yonghu",
        "102": "iconfont icon-lifangtilitiduomiantifangkuai2",
        "103": "iconfont icon-shangpinguanli",
        "104": "iconfont icon-dingdanguanli",
        "105": "iconfont icon-baobiao"
      },
      // 二级菜单menber
      RolesObj: {
        "1": "iconfont icon-jiaose",
        "2": "iconfont icon-quanxian",
        "3": "iconfont icon-shangpinliebiao",
        "4": "iconfont icon-shangpin",
        "5": "iconfont icon-leimupinleifenleileibie2",
        "10": "iconfont icon-querylist",
        "12": "iconfont icon--shangpinfenlei-gai",
        "13": "iconfont icon-shuju"
      }
    };
  },
  created() {
    this.getLeftMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    exitfn() {
      this.$router.push("/login");
      Message.success("退出成功!");
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
      this.Exitdialog = false;
    },
    async getLeftMenuList() {
      let result = await this.$http.getLeftMenuInfo();
      
      if (result.meta.status !== 200) return Message.error("网络开小差了~");
      this.menuList = result.data;
    },
    // 点击按钮的折叠与展开
    toggleCollpase(){
     this.isCollapse = !this.isCollapse 
    },
    // 保存链接的激活状态
    savaNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      // 改变点击的active颜色
      this.activePath = activePath
    }
  }
};
</script>

<style lang="less">
#exit_setting .el-dialog {
  margin-top: 30vh !important;
}

#exit_setting .el-dialog__header .el-dialog__title {
  font-size: 26px;
  color: #ff9900;
  font-family: "微软雅黑";
}

#container_main {
  width: 100%;
  height: 100%;
}
#container_main > .el-aside {
  height: 100%;
  background-color: #333;
}
#container_main > .el-main {
  height: 100%;
  background-color: #eee;
}

.iconfont {
  margin-right: 10px;
}
.el-menu {
  border: none;
}
</style>

<style lang="less" scoped>
#home_container {
  width: 100%;
  height: 100%;
}
.home_header {
  width: 100%;
  height: 70px;
  background-color: #333;
  padding: 0 120px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #6666FF;
}
.left_contianer {
  width: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left_contianer > .img_container > img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  line-height: 80px;
}
.text_container > p {
  width: 140px;
  height: 70px;
  font-size: 20px;
  color: burlywood;
  font-family: "微软雅黑";
  line-height: 70px;
  animation: scintillation 2s 0s infinite linear;
}
.right_exit {
  line-height: 70px;
}
.right_exit > .btn {
  width: 100px;
}
.toggle-button{
  width: 100%;
  height: 40px;
  background-color: #333;
  font-size: 15px;
  letter-spacing: 0.2em;
  line-height: 40px;
  color: #fff;
  text-align: center;
}
.toggle-button:hover{
  cursor: pointer;
}
// @keyframes scintillation {
//   0% {
//     opacity: 0.2;
//   }
//   30% {
//     opacity: 0.4;
//   }
//   40% {
//     opacity: 0.6;
//   }
//   50% {
//     opacity: 0.8;
//   }
//   90% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// }
</style>