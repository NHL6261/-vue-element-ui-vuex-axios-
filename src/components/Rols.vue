<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 角色列表区域 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-col :span="6">
          <el-button
            style="margin-bottom: 15px"
            type="primary"
            @click="addRolesDialogVisible = true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop': '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '': 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row,item3.id)"
                    >
                      {{item3.authName}}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色列表" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 dialog 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRolesDialogVisible"
      width="40%"
      @close="addRolesDialogClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormrules"
        ref="addRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="editRolesDialogClose"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    
    <el-dialog
      title="分配权限"
      @close="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        default-expand-all
        ref="treeRef"
        :default-checked-keys="defkeys"
        node-key="id"
        show-checkbox
        :data="rightsList"
        :props="treeProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    //   自定义 角色名称
    var checkRole = (rule, value, callback) => {
      const regRole = /^[\u4e00-\u9fa5]+$/;
      if (regRole.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入3-10位的角色名称"));
      }
    };
    var checkDesc = (rule, value, callback) => {
      const regDesc = /^[\u4e00-\u9fa5]+$/;
      if (regDesc.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入2-10位的角色描述"));
      }
    };
    return {
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      //   编辑区域
      editRoleForm: {},

      roleList: [], // 角色列表区域
      rightsList: [], // 所有权限的数据
      addRolesDialogVisible: false, // 点击添加角色 控制dialog 显示与隐藏
      setRightDialogVisible: false, // 控制分配权限对话框显示与隐藏
      editRoleDialogVisible: false, //编辑角色对话框显示与隐藏
      treeProps: {
        label: "authName",
        children: "children"
      },
      addRolesFormrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { validator: checkRole, trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名称长度在2-10个字母之间",
            trigger: "blur"
          }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { validator: checkDesc, trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色描述长度在2-10个汉字之间",
            trigger: "blur"
          }
        ]
      },
      // 编辑
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },

      // 默认 选中的id值
      defkeys: [],
      roleId: "" //当前即将分配角色的id
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   添加角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$ajax.post("roles", this.addRolesForm);
        if (res.meta.status !== 201) {
          Message.error("添加角色失败！");
        }
        Message.success("添加角色成功！");
        this.addRolesDialogVisible = false;
        this.getRolesList();
      });
    },
    // 重置 添加角色 弹出框数据
    addRolesDialogClose() {
      this.$refs.addRolesFormRef.resetFields();
    },
    // 编辑角色 重置
    editRolesDialogClose() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 编辑角色
    async showEditDialog(id) {
      const { data: res } = await this.$ajax.get("roles/" + id);
      if (res.meta.status !== 200) return Message.error("查询角色信息失败！");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },
    // 点击确定后
    editRoles() {
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$ajax.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          Message.error("更新角色信息失败！");
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false;
        Message.success("更新角色信息成功！");
        this.getRolesList();
      });
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return Message.info("已取消删除");
      }
      const { data: res } = await this.$ajax.delete("roles/" + id);
      if (res.meta.status !== 200) return Message.error("删除角色失败！");
      Message.success("删除用户成功！");
      this.getRolesList();
    },
    // 获取角色列表方法
    async getRolesList() {
      let { data: res } = await this.$ajax.get("roles");
      if (res.meta.status !== 200) {
        return Message.error("角色列表获取失败,请检查网络设置~");
      } else {
        this.roleList = res.data;
      }
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框提示 是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "警告!",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return Message.info("取消删除");
      } else {
        const { data: res } = await this.$ajax.delete(
          `roles/${role.id}:roleId/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return Message.error("删除权限失败!");
        } else {
          role.children = res.data;
          Message.success("删除成功!");
        }
      }
    },
    // 分配权限展示对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      let { data: res } = await this.$ajax.get("rights/tree");
      if (res.meta.status !== 200) {
        return Message.error("分配权限获取失败,请检查网络设置~");
      } else {
        // 获取到的权限数据,保存到data中
        this.rightsList = res.data;

        // 递归获取三级节点的id
        this.getLeafkeys(role, this.defkeys);
        this.setRightDialogVisible = true;
      }
    },
    // 通过递归 获取三级id 保存到 数组中
    getLeafkeys(node, arr) {
      if (!node.children) {
        // 如果不是 三级就把这个id放到 arr当中
        return arr.push(node.id);
      } else {
        node.children.forEach(item => this.getLeafkeys(item, arr));
      }
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 解决重复选择后 数组中数据过多显示重复问题
      this.defkeys = [];
    },
    // 分配权限
    async allotRights() {
      // 拿半选
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // 逗号分隔
      const idStr = keys.join(",");
      let { data: res } = await this.$ajax.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      });
      if (res.meta.status !== 200) {
        return Message.error("分配权限失败,请检查网络设置~");
      } else {
        Message.success("分配角色成功!");
        this.getRolesList();
        this.setRightDialogVisible = false;
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
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
<style lang="less" scoped>
</style>