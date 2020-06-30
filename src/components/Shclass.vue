<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 指定数据源 -->
          <el-cascader
            v-model="slectedKey"
            :options="parentCateList"
            :props="props"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <tree-table
      :data="catList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      stripe
      :show-row-hover="false"
    >
      <!-- 是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
        <i class="el-icon-error" style="color: red" v-else></i>
      </template>
      <!-- 排序插槽 -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="showEditCateDialog(scope.row.cat_id)"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="removeCate(scope.row.cat_id)"
        >删除</el-button>
      </template>
    </tree-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      catList: [], // 商品分类 所有数据
      queryInfo: {
        pagenum: 1, //当前的页码值
        pagesize: 5 // 每页显示多少数据
      },
      // 添加分类的数据对象
      addCateForm: {
        cat_pid: 0, // 父级分类的id 添加一级分类
        cat_name: "",
        cat_level: 0 // 当前添加一级分类
      },
      total: 0, // 总数据条数
      addCateDialogVisible: false, // 控制添加分类对话框 显示与隐藏
      editCateDialogVisible: false, // 编辑分类对话框
      parentCateList: [], // 父级分类的列表
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template", // 列类型，可选值有 'template'(自定义列模板)
          template: "isok" // 对应的作用域插槽
        },
        {
          label: "排序",
          type: "template", // 列类型，可选值有 'template'(自定义列模板)
          template: "order"
        },
        {
          label: "操作",
          type: "template", // 列类型，可选值有 'template'(自定义列模板)
          template: "opt"
        }
      ], // 为 table 指定 列的定义
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // cascadeProps:{
      //   value:'cat_pid',
      //   label:'cat_name',
      //   children:'children'
      // },
      slectedKey: [], // 选中的父级分类的id数组
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      }, // 指定级联选择器的配置 对象
      editCateForm: "" // 编辑表单绑定对象
    };
  },
  created() {
    this.getCatList();
  },
  methods: {
    async getCatList() {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中,请耐心等待~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let { data: res } = await this.$ajax.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return Message.error("获取数据失败");
      } else {
        loading.close();
        this.catList = res.data.result;
        this.total = res.data.total;
      }
    },
    // 监听 用户点击每页 显示多少条的 回调函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCatList();
    },
    // 监听 用户点击页码 跳转至所少页的 回调函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCatList();
    },
    // 点击按钮展示 添加分类对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表 然后在 弹出 对话框
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      let { data: res } = await this.$ajax.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return Message.error("获取父级分类数据失败~");
      } else {
        this.parentCateList = res.data;
      }
    },
    // 级联选择器 发生改变的回调函数
    parentCateChange() {
      let { slectedKey, addCateForm } = this;
      if (slectedKey.length > 0) {
        addCateForm.cat_pid = slectedKey[slectedKey.length - 1];
        // 为当前父级分类的等级赋值
        addCateForm.cat_level = slectedKey.length;
        return;
      } else {
        addCateForm.cat_pid = 0;
        addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        let { data: res } = await this.$ajax.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return Message.error("添加分类失败");
        } else {
          Message.success("添加分类成功!");
          this.getCatList();
          this.addCateDialogVisible = false;
        }
      });
    },
    // 监听对话框关闭事件 重置表单 重置 selected 级联 选择框
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.slectedKey = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 显示编辑对话框
    async showEditCateDialog(id) {
      const { data: res } = await this.$ajax.get("categories/" + id);
      if (res.meta.status !== 200) return Message.error("获取分类失败！");
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 编辑分类名
    eidtCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$ajax.put(
          "categories/" + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          }
        );
        if (res.meta.status !== 200) return Message.error("更新分类名失败！");
        Message.success("更新分类名成功！");
        this.getCatList();
        this.editCateDialogVisible = false;
      });
    },
    async removeCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return Message.info("已取消删除！");
      }
      const { data: res } = await this.$ajax.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return Message.error("删除商品分类失败！");
      }
      Message.success("删除商品分类成功！");
      this.getCatList();
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
</style>