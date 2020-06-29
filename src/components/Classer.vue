<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <!-- 级联选择器 -->
          <!-- change：选择项改变的回调函数 -->
          <el-cascader
            v-model="selectedCatekeys"
            :options="cateList"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [], // 发请求获取的数据
      props: {
        expandTrigger: "hover",
        checkStrictly: true,
        value:'cat_id',  // 此时用户选中的值
        label:'cat_name', // 此时用户看到的值
        cahidren:'children', // 父子节点的嵌套属性
      }, // 指定级联选择器的配置 对象
      selectedCatekeys:[] , // 级联选择器 双向绑定到的数组
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取 级联选择器数据
    async getCateList() {
      let { data: res } = await this.$ajax.get("categories");
      if (res.meta.status !== 200) {
        return Message.error("参数数据列表获取失败！");
      } else {
        this.cateList = res.data;
      }
    },
    // 级联选择器 中数据发生改变 触发此回调函数
    handleChange(){
      console.log(this.selectedCatekeys)
    }
  }
};
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
</style>