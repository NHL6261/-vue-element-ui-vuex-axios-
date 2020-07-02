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
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的api接口 -->
            <!-- :on-preview 指定预览事件 -->
            <!-- :on-remove 处理删除的逻辑 -->
            <!-- file-list 从文件里选择 -->
            <!-- list-type指定预览图片的呈现方式 -->
            <!-- 此组件在内部封装了一个ajax请求 需要 token则需要配置headers -->
            <el-upload
              :action="uploadurl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">
                <i class="el-icon-upload el-icon--right"></i>点击上传
              </el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品区域 -->
            <el-button class="btn" type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="pictureUrl" alt="此图片暂时无法显示" />
    </el-dialog>
  </div>
</template>
<script>
import { Message } from "element-ui";
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0", // 步骤条的联动 效果 动态参数
      addForm: {
        goods_name: "", // 商品名称
        goods_price: 0, // 商品的价格
        goods_weight: 0, // 商品重量
        goods_number: 0, // 商品数量
        goods_cat: [], // 商品所属的数组
        pics: [], // 图片数组
        goods_introduce: "", // 商品的描述 富文本
        attrs: [] //  动态参数列表 和 静态属性列表
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
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态参数数据
      uploadurl: "http://127.0.0.1:8888/api/private/v1/upload", //上传的图片的url地址
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      }, // 图片上传组件的headers去欧诺个请求头对象
      pictureUrl: "", // 预览的回显地址
      previewVisible: false // 预览 dialog 默认 不显示
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
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$ajax.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return Message.error("静态数据获取失败!请检查网络设置~");
        } else {
          this.onlyTableData = res.data;
        }
      }
    },
    // 预览的事件回调函数
    handlePreview(file) {
      console.log("预览的图片是:", file);
      this.pictureUrl = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理删除的逻辑
    handleRemove(file) {
      // 获取图片临时路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中找到这个图片对应的索引值 查到 相同的索引值
      const i = this.addForm.pics.findIndex(x => x.pics === filePath);
      // 调用数组的splice方法将 相同的数据删掉
      this.addForm.pics.splice(i, 1);
    },
    // 图片上传成功的事件
    handleSuccess(response) {
      // 拼接得到一个 对象
      const picInfo = { pics: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 添加商品处理函数
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return Message.error("请输入合法的表单数据数据!");
        } else {
          // 执行添加的业务逻辑  和 级联选择器 产生矛盾 因为 级联选择器指定的就是 数组不可以强行拆,解决:深拷贝 lodash cloneDeep(obj)
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          // 处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.addForm.attrs.push(newInfo);
          });
          // 处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;
          console.log("此时的数组是:", form);
          // 发起请求 添加商品 商品名称必须是唯一的
          const { data: res } = await this.$ajax.post("goods", form);
          if (res.meta.status !== 201) {
            return Message.error("添加商品失败,请检查网络设置~");
          } else {
            Message.success("添加商品成功!");
            this.$router.push('/shop')
          }
        }
      });
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
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.ql-editor {
  min-height: 300px;
}
</style>
<style lang="less" scoped>
.previewImg {
  width: 100%;
}
.btn {
  margin-top: 15px;
}
</style>