<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="请添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          @tab-click="tabClicked"
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- v-model 选中时保存的数据  -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品价格" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      activeIndex: "0", // 步骤条的联动 效果 动态参数
      addForm: {
        goods_name: "", // 商品名称
        goods_price: 0, // 商品的价格
        goods_weight: 0, // 商品重量
        goods_number: 0, // 商品数量
        goods_cat: [] // 商品所属的数组
      }, // 添加 商品列表的表单项
      //添加商品验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      catelist: [], // 商品分类列表
      props: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }, // 级联选择器配置项
      manyTableData: [] // 动态参数数据
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$ajax.get("categories");
      if (res.meta.status !== 200) {
        return Message.error("获取数据列表失败!");
      } else {
        this.catelist = res.data;
      }
    },
    // 级联选择器 选中变化 会触发此回调
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //切换标签页 触发的回调函数  activeName:要进入的标签页 oldActiveName:从哪个标签页离开
    beforTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        Message.error("请先选择商品分类!");
        return false;
      }
    },
    // 标签页切换时 触发此回调函数
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$ajax.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return Message.error("获取分类数据失败,请检查网络设置~");
        } else {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          this.manyTableData = res.data;
        }
      }
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    }
  }
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-steps {
  margin: 15px 0px;
}
.el-step__title {
  font-size: 13px;
}
</style>
<style lang="less" scoped>
</style>