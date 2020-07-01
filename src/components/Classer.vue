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
      <!-- tab 分页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand" label="#">
              <!-- 循环渲染tag 标签 -->
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(i,scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >添加新参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 添加静态属性表格 -->
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand" label="#">
              <!-- 循环渲染tag 标签 -->
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(i,scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >添加新参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText "
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText "
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      cateList: [], // 发请求获取的数据
      props: {
        expandTrigger: "hover",
        checkStrictly: true,
        value: "cat_id", // 此时用户选中的值
        label: "cat_name", // 此时用户看到的值
        cahidren: "children" // 父子节点的嵌套属性
      }, // 指定级联选择器的配置 对象
      selectedCatekeys: [], // 级联选择器 双向绑定到的数组
      activeName: "many",
      manyTabData: [], // 动态参数的数据
      onlyTabData: [], // 静态属性的数据
      addForm: {
        attr_name: "" // 添加参数的名称
      }, // 添加参数的表单 v-model
      editForm: {}, // 修改参数
      addDialogVisible: false, // 控制添加对话框的显示与隐藏
      editDialogVisible: false, // 编辑区域 对话框显示与隐藏
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
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
    // 获取参数的回调函数
    async getParamsData() {
      let { selectedCatekeys } = this;
      if (selectedCatekeys.length !== 3) {
        selectedCatekeys = [];
        (this.manyTabData = []), (this.onlyTabData = []);
        return;
      } else {
        // 根据当前所处的id 和 当前所处的面板 获取对应的参数
        let { data: res } = await this.$ajax.get(
          `categories/${this.cateid}/attributes`,
          {
            params: { sel: this.activeName }
          }
        );
        if (res.meta.status !== 200) {
          return Message.error("参数数据列表获取失败");
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            // 添加布尔值 控制文本框的显示与隐藏
            item.inputVisible = false;
            // 文本框中输入的值
            item.inputValue = "";
          });
          if (this.activeName === "many") {
            this.manyTabData = res.data;
          } else {
            this.onlyTabData = res.data;
          }
        }
      }
    },
    // 级联选择器 中数据发生改变 触发此回调函数
    handleChange() {
      this.getParamsData();
    },
    // 页签点击的回调函数
    handleTabClick() {
      this.getParamsData();
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return Message.error("添加数据不可为空!");
        let { data: res } = await this.$ajax.post(
          `categories/${this.cateid}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          Message.error("参数添加失败,请检查网络设置~");
        } else {
          Message.success("参数添加成功");
          this.getParamsData();
          this.addDialogVisible = false;
        }
      });
    },
    // 点击按钮 dialog 显示
    async showEditDialog(attr_id) {
      const { data: res } = await this.$ajax.get(
        `categories/${this.cateid}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return Message.error("编辑数据获取失败!");
      } else {
        this.editForm = res.data;
        this.editDialogVisible = true;
      }
    },
    // 编辑 参数 回调
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$ajax.put(
          `categories/${this.cateid}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return Message.error("参数修改失败,请检查网络设置~");
        } else {
          Message.success("参数修改成功!");
          this.getParamsData();
          this.editDialogVisible = false;
        }
      });
    },
    // 关闭 预验证
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 根据id删除参数逻辑
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果 不等于 confirm 用户就点击了取消按钮
      if (confirmResult !== "confirm") {
        return Message.info("您已取消删除!");
      } else {
        // 删除的业务逻辑
        const { data: res } = await this.$ajax.delete(
          `categories/${this.cateid}/attributes/${attr_id}`
        );
        if (res.meta.status !== 200) {
          return Message.error("删除数据不成功,请检查网络设置~");
        } else {
          Message.success("删除参数成功!");
          this.getParamsData();
        }
      }
    },
    // tag 文本框 失去焦点或者按下了 enter 键 会触发此函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      } else {
        // 如果 输入了正确数据则进来
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        row.inputVisible = false;
        // 发起请求 保存这次操作
        this.savaAttrVals(row);
      }
    },
    // 控制文本框的显示
    showInput(row) {
      row.inputVisible = true;
      // 自动 或得焦点 nextTick 方法作用 当页面 上元素被从新渲染之后 才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 将 对 attr_vals 的操作 单独抽一个函数
    async savaAttrVals(row) {
      // 发起请求 保存这次操作
      let { data: res } = await this.$ajax.put(
        `categories/${this.cateid}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return Message.error("添加参数项失败!请检查网络设置~");
      } else {
        Message.success("修改参数项成功!");
      }
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.savaAttrVals(row);
    }
  },
  computed: {
    // 如果按钮需要被禁用 则 返回true
    isBtnDisabled() {
      let { selectedCatekeys } = this;
      if (selectedCatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 拿此时的选中的级联选择器的id 为发情求做准备
    cateid() {
      if (this.selectedCatekeys.length === 3) {
        return this.selectedCatekeys[2];
      } else {
        return null;
      }
    },
    // 动态计算标题
    titleText() {
      let { activeName } = this;
      if (activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
</style>