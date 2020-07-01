<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      // 分页时 向后台 请求时候传入的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [], // 商品列表数据
      total: 0 // 分页的总数据
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取相应数据
    async getGoodsList() {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中,请耐心等待~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let { data: res } = await this.$ajax.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return Message.error("获取数据失败,请检查网络设置~");
      } else {
        loading.close();
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 删除商品逻辑 根据ID
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        Message.info("您已取消删除!");
      } else {
        const { data: res } = await this.$ajax.delete(`goods/${id}`);
        if(res.meta.status !== 200){
          Message.error('删除失败!')
        }else{
          Message.success('删除成功!')
          this.getGoodsList()
        }
      }
    },
    goAddPage(){
      this.$router.push('/shop/add')
    }
  }
};
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-row{
  margin-bottom: 15px;
}
</style>

<style lang="less" scoped>
</style>