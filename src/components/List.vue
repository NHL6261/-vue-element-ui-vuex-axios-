<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加订单</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- current-page当前的页码值 page-size每页显示多少条数据 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisble" width="50%">
      <!-- 时间线 timestamp时间属性-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import cityData from "@/util/Address/citydata";
export default {
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: "", // 查询条件
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示条数
      },
      orderlist: [], // 请求到的对象
      total: 0, // 总数据条数
      addressVisible: false, // 隐藏对话框
      progressVisble: false, // 物流信息对话框
      addressForm: {
        address1: [], // 级联选择器
        address2: ""
      },
      // 验证规则
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData, // 省市级县联动 数据
      progressInfo: [] // 物流信息
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$ajax.get("orders", {
        params: this.queryInfo
      });
      !!(res.meta.status !== 200) &&
        Message.error("订单数据获取失败,请检查网络设置~");
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    // 每页的显示条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 页码值发生改变 的时候调用的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址对话框
    showBox() {
      this.addressVisible = true;
    },
    // 清空表单操作
    addressClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流信息对话框
    async showProgressBox() {
      const { data: res } = await this.$ajax.get(`/kuaidi/${1106975712662}`);
      !!(res.meta.status !== 200) &&
        Message.erroe("获取物流信息失败,请联系管理员~");
      this.progressInfo = res.data;
      this.progressVisble = true
    }
  }
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-button {
  margin-left: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
<style lang="less" scoped>
</style>