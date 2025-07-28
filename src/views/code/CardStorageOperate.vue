<template>
  <div class="card-storage-operations">
    <el-header><h1 class="title">晟思资产流转——出入库操作管理系统</h1>
    </el-header>
    <div style="height: 20px;"></div>
    <div class="button-container"><el-button class="add-button" type="primary" @click="openDialog">添加资产</el-button>
      <el-input v-model="searchQuery" placeholder="根据资产模块或资产类型编码" style="width: 300px;"></el-input>
      <el-button type="primary" @click="searchOperations">模糊查询</el-button>
<!--      <el-select v-model="searchQuery.category" placeholder="请选择对应的分类查询" style="margin-left: 10px;">-->
<!--        <el-option-->
<!--          v-for="item in categories"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-input-->
<!--        v-model="searchQuery.content"-->
<!--        placeholder="请输入要查找的内容"      style="margin-left: 10px; width: 200px;"-->
<!--        :disabled="!searchQuery.category"-->
<!--      ></el-input>-->
<!--      <el-button type="primary" @click="searchOperations" :disabled="!searchQuery.category || !searchQuery.content">分类查询</el-button>-->
<!--      <el-button type="primary" @click="searchOperations">分类查询</el-button>-->
      <el-button type="primary" @click="resetSearch">重置查询</el-button>
      <el-button type="primary" @click="goUerCardStorageOperate">查看用户操作详情</el-button>
    </div>
    <el-table :data="operations" stripe>
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">{{ scope.$index + 1 + (currentPage - 1) * pageSize }}</template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码"></el-table-column>
      <el-table-column prop="moduleName" label="资产模块"></el-table-column>
      <el-table-column prop="operationType" label="资产使用类型"></el-table-column>
      <el-table-column prop="operationContent" label="资产名称"></el-table-column>
      <el-table-column prop="operationCode" label="资产类型编码"></el-table-column>
      <el-table-column prop="stockQuantity" label="入库数量"></el-table-column>
      <el-table-column prop="usageQuantity" label="领用数量"></el-table-column>
      <el-table-column prop="purchaseQuantity" label="采购数量"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">{{ new Date(scope.row.createTime).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editOperation(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteOperation(scope.row.id)">删除</el-button>
          <el-button type="text" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
    ></el-pagination>
    <el-dialog :title="isEdit ? '编辑资产信息' : '新增资产信息'" :visible.sync="dialogVisible">
      <el-form :model="form" ref="form" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称:" prop="projectName" :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]" class="form-item">
              <el-autocomplete
                v-model="form.projectName"
                :fetch-suggestions="querySearch"
                placeholder="请输入项目名称"
                clearable
                @select="handleSelect"
              >
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编码:" prop="projectCode" class="form-item">
              <el-autocomplete
                v-model="form.projectCode"
                :fetch-suggestions="querySearchForCode"
                placeholder="请输入项目编码"
                clearable
                @select="handleSelectForCode"
              >
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资产模块:" prop="moduleName" class="form-item">
              <el-autocomplete
                v-model="form.moduleName"
                :fetch-suggestions="querySearchForModuleName"
                placeholder="请输入资产模块名称"
                clearable
                @select="handleSelectForModuleName"
              >
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产使用类型:" prop="operationType" class="form-item">
              <el-select v-model="form.operationType" placeholder="请选择资产使用类型">
                <el-option
                  v-for="item in operationTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资产名称:" prop="operationContent" class="form-item">
              <el-input
                v-model="form.operationContent"
                placeholder="请确保输入名称唯一不变"
                clearable
                class="custom-placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产类型编码:" prop="operationCode" class="form-item">
              <el-input
                v-model="form.operationCode"
                placeholder="若无编码可不填，默认显示为 /"
                clearable
                class="custom-placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 新增表单项 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购人:" prop="purchasers" class="form-item">
              <el-input
                v-model="form.purchaser"
                placeholder="可不填，若多人采购，用逗号分隔"
                clearable
                class="custom-placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="采购数量:" class="form-item">
                <el-input type="number" v-model="form.purchaseQuantity"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
          <el-form-item label="采购信息:" prop="purchaseInfo" class="form-item">
            <el-input
              type="textarea"
              v-model="form.purchaseInfo"
              placeholder="可不填，默认显示为 /"
              clearable
              class="custom-placeholder"
            ></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:" class="form-item">
              <el-input
                type="textarea"
                v-model="form.remarks"
                placeholder="可不填，默认显示为 /"
                clearable
                class="custom-placeholder"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOperation">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情对话框 后续升级加上 领用人 这一列 -->
    <el-dialog title="资产详细信息" :visible.sync="detailsVisible">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目名称">{{ form.projectName }}</el-descriptions-item>
        <el-descriptions-item label="项目编码">{{ form.projectCode }}</el-descriptions-item>
        <el-descriptions-item label="资产模块">{{ form.moduleName }}</el-descriptions-item>
        <el-descriptions-item label="资产使用类型">{{ form.operationType }}</el-descriptions-item>
        <el-descriptions-item label="资产名称">{{ form.operationContent }}</el-descriptions-item>
        <el-descriptions-item label="资产类型编码">{{ form.operationCode }}</el-descriptions-item>
        <el-descriptions-item label="入库数量">{{ form.stockQuantity }}</el-descriptions-item>
        <el-descriptions-item label="采购人">{{ form.purchaser }}</el-descriptions-item>
        <el-descriptions-item label="采购数量">{{ form.purchaseQuantity }}</el-descriptions-item>
        <el-descriptions-item label="采购信息">{{ form.purchaseInfo }}</el-descriptions-item>
        <el-descriptions-item label="领用人">{{ form.project_user }}</el-descriptions-item>
        <el-descriptions-item label="领用数量">{{ form.usageQuantity }}</el-descriptions-item>
        <el-descriptions-item label="领用信息">{{ form.project_usage_info }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ new Date(form.createTime).toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ form.remarks }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <footer class="footer">
<!--      <p>&copy; 2024 晟思资产流转管理系统 V2.0.6</p>-->
      <p> &nbsp; &copy; 2024 焊接站控制系统 V2.0.6</p>
    </footer>
  </div>
</template>

<script>import SensorBorderRequest from "../../utils/sensorBorder.js";
import { debounce } from 'lodash'; // 引入 lodash 的 debounce 函数
export default {
  data() {
    return {
      searchQuery: '', // 查询输入框的值
      operations: [], // 存储所有操作数据
      currentPageData: [], // 当前页面的数据
      dialogVisible: false,
      detailsVisible: false, // 查看详情对话框的显示状态

      // searchQuery: {
      //   category: '',
      //   content: ''
      // },

      form: {
        projectName: '',
        projectCode: '',
        moduleName: '',
        operationType: '',
        operationContent: '',
        operationCode: '',
        stockQuantity: null,
        usageQuantity: null,
        purchaseQuantity: 0,
        purchaser:'',//采购人
        purchaseInfo:'',//采购信息
        remarks: '',
        project_user:'', // 领用人
        project_usage_info:'' // 领用信息
      },
      isEdit: false,
      currentId: null,
      currentPage: 1, // 当前页数
      pageSize: 5, // 每页显示的数据量
      totalItems: 0, // 总数据量
      // 假设这是历史项目名称数据
      projectNames: [],
      projectCodes: [], // 新增项目编码数据
      projectModules: [],
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        projectCode: [
          { required: true, message: '请输入项目编码', trigger: 'blur' }
        ]
      },
      operationTypes: [ // 定义下拉框的选项
        { value: '消耗品', label: '消耗品' },
        { value: '焊接', label: '焊接' },
        { value: '装配', label: '装配' },
        { value: '测试', label: '测试' },
        { value: '焊接/装配', label: '焊接/装配' },
        { value: '装配/测试', label: '装配/测试' },
        { value: '焊接/装配/测试', label: '焊接/装配/测试' },
        { value: '其他', label: '其他' }
      ],      categories: [
        { value: 'category1', label: '分类1' },
        { value: 'category2', label: '分类2' },
        { value: 'category3', label: '分类3' }
      ]
    };
  },
  mounted() {
    console.log('项目名称列表:', this.projectNames);
    console.log('项目编码列表:', this.projectCodes);
  },
  watch: {
    'form.projectName': function(newVal) {
      console.log('项目名称变化:', newVal);
      this.$refs.form.validateField('projectName'); // 手动触发验证
    },
    'form.projectCode': function(newVal) {
      console.log('项目编码变化:', newVal);
      this.$refs.form.validateField('projectCode'); // 手动触发验证
    }
  },
  created() {
    this.fetchOperations(this.currentPage, this.pageSize);
  },
  methods: {
    // 用于查询历史项目名称
    querySearch: debounce(function(queryString, cb) {
      console.log('查询字符串:', queryString);
      // 过滤项目名称
      const results = queryString ? this.projectNames.filter(item => {
        return item.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      }) : this.projectNames;

      // 将结果转换为对象数组
      const formattedResults = results.map(item => ({ value: item, label: item }));
      console.log('projectNames 过滤结果:', formattedResults);
      // 调用回调函数
      cb(formattedResults);
    }, 100),

    querySearchForCode: debounce(function(queryString, cb) {
      console.log('查询字符串:', queryString);
      // 过滤项目名称
      const results = queryString ? this.projectCodes.filter(item => {
        return item.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      }) : this.projectCodes;

      // 将结果转换为对象数组
      const formattedResults = results.map(item => ({ value: item, label: item }));
      console.log('projectCodes 过滤结果:', formattedResults);
      // 调用回调函数
      cb(formattedResults);
    }, 100),


    querySearchForModuleName: debounce(function(queryString, cb) {
      console.log('查询字符串:', queryString);
      // 过滤项目名称
      const results = queryString ? this.projectModules.filter(item => {
        return item.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      }) : this.projectModules;

      // 将结果转换为对象数组
      const formattedResults = results.map(item => ({ value: item, label: item }));
      console.log('projectModules 过滤结果:', formattedResults);
      // 调用回调函数
      cb(formattedResults);
    }, 100),

    handleSelect(item) {
      console.log('选择的项目名称:', item);
      this.$refs.form.validateField('projectName'); // 手动触发验证
    },
    handleSelectForCode(item) {
      console.log('选择的项目编码:', item);
      this.$refs.form.validateField('projectCode'); // 手动触发验证
    },

    handleSelectForModuleName(item) {
      console.log('选择的资产模块:', item);
      this.$refs.form.validateField('projectCode'); // 手动触发验证
    },

    fetchOperations(pageNum, pageSize) {
      let param = { 'pageNum': pageNum, 'pageSize': pageSize };
      SensorBorderRequest.fetchOperations(param, // 传递页码和每页大小
        (response) => {
          console.log(response); // 打印响应

          this.operations = response.records || [];
          this.totalItems = response.total;


          // 提取项目名称并添加到 projectNames 列表中
          const newProjectNames = this.operations.map(operation => operation.projectName).filter(name => name);
          this.projectNames = [...new Set([...this.projectNames, ...newProjectNames])]; // 去重

          // 提取项目code并添加到 newProjectCodes 列表中
          const newProjectCodes = this.operations.map(operation => operation.projectCode).filter(name => name);
          this.projectCodes = [...new Set([...this.projectCodes, ...newProjectCodes])]; // 去重

          // 提取项目code并添加到 newProjectCodes 列表中
          const newProjectModules = this.operations.map(operation => operation.moduleName).filter(name => name);
          this.projectModules = [...new Set([...this.projectModules, ...newProjectModules])]; // 去重

          console.log('项目名称列表:', this.projectNames);
          console.log('项目编码列表:', this.projectCodes);
          console.log('资产模块列表:', this.projectModules);

          this.updateCurrentPageData();
        },
        (error) => {
          console.error('获取操作记录失败:', error);
        }
      );
    },

    updateCurrentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.currentPageData = this.operations.slice(start, end);
    },

    openDialog() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.resetForm();
    },

    editOperation(operation) {
      this.currentId = operation.id;
      this.form = { ...operation };
      this.dialogVisible = true;
      this.isEdit = true;
    },

    viewDetails(operation) {
      this.currentId = operation.id;
      this.form = { ...operation };
      this.detailsVisible = true;
      this.isEdit = false;
    },

    saveOperation() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message({
            message: '请检查输入项',
            type: 'error'
          });
          return;
        }
        const param = this.form;
        SensorBorderRequest.saveOperation(
          this.isEdit,
          this.currentId,
          param,
          () => {
            this.fetchOperations(this.currentPage, this.pageSize);
            this.dialogVisible = false;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          },
          (error) => {
            console.error(error);
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        );
      });
    },
    deleteOperation(id) {
      let param = { 'id': id };
      this.$confirm('确认删除该操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SensorBorderRequest.deleteOperation(
          param,
          () => {
            this.fetchOperations(this.currentPage, this.pageSize);
          },
          (error) => {
            console.error(error);
          }
        );
      });
    },
    resetForm() {
      this.form = {
        projectName: '',
        projectCode: '',
        moduleName: '',
        operationType: '',
        operationContent: '',
        stockQuantity: 0,
        usageQuantity: 0,
        purchaseQuantity: 0,
        remarks: ''
      };
      this.currentId = null;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
      this.fetchOperations(this.currentPage, this.pageSize);
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchOperations(this.currentPage, this.pageSize);
    },
    // 分页按照条件查询
    searchOperations() {
      if (this.searchQuery.trim() === '') {
        this.$message({
          message: '请输入查询内容！',
          type: 'error'
        });
        this.fetchOperations(this.currentPage, this.pageSize);
      } else {
        const query = this.searchQuery.trim();
        let param = { 'query': query, 'pageNum': this.currentPage, 'pageSize': this.pageSize };
        console.log(query);
        SensorBorderRequest.searchOperations(param, (response) => {
          this.$message({
            message: '查询成功',
            type: 'success'
          });
          this.operations = response.records || [];
          this.totalItems = response.total;
          this.updateCurrentPageData();
        }, (error) => {
          console.error(error);
          this.$message({
            message: error,
            type: 'error'
          });
        });
      }
    },
    resetSearch() {
      this.searchQuery = '';
      this.fetchOperations(this.currentPage, this.pageSize);
      this.$message({
        message: '重置成功！',
        type: 'success'
      });
    },
    goUerCardStorageOperate() {
      this.$router.push({path:'/ddinguia/web/userCardStorageOperate'})},
  }
};
</script>

<style scoped>

.card-storage-operations {
  padding: 20px;
}

.title {
  margin: 0;
  font-size: 24px;
  line-height: 1.5;
}

.button-container {
  text-align: left; /* 确保按钮左对齐 */
  margin-bottom: 20px; /* 添加按钮与表格的间距 */
}

.add-button {
  margin: 0; /* 确保按钮没有额外的外边距 */
}

.dialog-footer {
  text-align: right;
}

.el-header {
  background-color: #f5f7fa;
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
}


input, select, textarea {
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #ccc; /* 自定义边框 */
  border-radius: 4px; /* 圆角 */
  padding: 10px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  /* 添加其他自定义样式 */
}

/* 针对其他现代浏览器 */
input, select, textarea {
  appearance: none; /* 标准语法 */
}

.footer {
  margin-top: 20px;
  font-size: 15px;
  color: #666;
}
</style>
