<template>
  <el-drawer
    title="修改策略"
    :visible.sync="showStrategy"
    :show-close="false"
    class="drawer"
    direction="ttb"
    :size="'60%'"
  >
    <el-table
      class="toscroll"
      ref="singleTable"
      :height="height"
      :data="allStrategy.concat([{ name: '', strategy: '', new: true }])"
      @row-click="rowClick"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column property="key" width="50"> </el-table-column>
      <el-table-column property="name" label="名称" width="120">
        <template slot-scope="scope">
          <span v-if="scope.$index === editRowIndex">
            <el-input
              v-model="scope.row.name"
              maxlength="300"
              placeholder="请输入名称"
            />
          </span>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column property="strategy" label="策略">
        <template slot-scope="scope">
          <span v-if="scope.$index === editRowIndex">
            <el-input
              v-model="scope.row.strategy"
              maxlength="400"
              placeholder="请输入策略"
            />
          </span>
          <el-button
            style="margin-left: 30%"
            v-else-if="scope.row.new"
            type="primary"
            circle
            icon="el-icon-plus"
            @click="addRowIndex = editRowIndex = scope.$index"
          ></el-button>
          <span v-else>{{ scope.row.strategy }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-col class="windows-icon-bg" :span="9">
              <i
                v-show="
                  scope.$index === editRowIndex &&
                  scope.row.name != '' &&
                  scope.row.strategy != ''
                "
                @click.stop="
                  editRowIndex === addRowIndex
                    ? addOneStrategy(scope.row)
                    : editOneStrategy(scope.row)
                "
                class="el-icon-check"
              />
              <i
                v-show="
                  scope.$index !== editRowIndex &&
                  scope.row.name != '' &&
                  scope.row.strategy != ''
                "
                @click.stop="() => (editRowIndex = scope.$index)"
                class="el-icon-edit-outline"
              />
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col class="windows-icon-bg" style="margin-left: 10px" :span="9">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                placement="top"
                title="确认删除该策略？"
                @confirm="delOneStrategy(scope)"
              >
                <i
                  slot="reference"
                  v-show="
                    !scope.row.new ||
                    (addRowIndex === editRowIndex && addRowIndex != '')
                  "
                  @click.stop
                  class="el-icon-close"
                />
              </el-popconfirm>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="margin: 20px 0 0 40%">
      <el-button type="primary" circle icon="el-icon-plus" @click="setCurrent()"></el-button>
    </div> -->
    <div style="margin: 20px 0 0 40%">
      <el-button type="primary" @click="setCurrent()">选择</el-button>
      <el-button type="primary" @click="handleCancel()">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  retryDownloadFile,
  getDownloadPath,
  newDownloadFile,
  openFileDialog,
} from '../ipc-renderer'

export default {
  props: {
    show: Boolean,
    searchUrl: String,
    onClose: Function
  },
  watch: {
    async show (val) {
      if (val) {
        this.showStrategy = this.show
        this.rowClick(this.currentStrategy)
      }
    }
  },
  data () {
    return {
      showStrategy: false,
      clickCurrentRow: '',
      editRowIndex: '',
      addRowIndex: '',
      loading: false,
      strategy: '',
      resourceData: [],
      formData: {
        url: '',
        path: ''
      },
      height: '80%'
    }
  },
  computed: {
    ...mapGetters(['allStrategy', 'currentStrategy'])
  },
  methods: {
    ...mapActions(['addStrategy', 'selectStrategy', 'editStrategy', 'delStrategy']),
    tableRowClassName (row) {
      if (this.clickCurrentRow != "" && this.clickCurrentRow.name == row.row.name) {
        return 'select-row'
      } else {
        return ''
      }
    },
    rowClick (row, column, event) {
      if (row.new) return
      this.clickCurrentRow = row;
    },
    addOneStrategy (row) {
      //改变icon并清除添加行标志
      this.addRowIndex = this.editRowIndex = ''
      this.addStrategy(row)
    },
    editOneStrategy (row) {
      //改变icon
      this.editRowIndex = ''
      this.editStrategy(row)
    },
    delOneStrategy (scope) {
      //删除行刚好是添加的行 则不进行 删除操作
      if (this.addRowIndex == scope.$index) {
        this.addRowIndex = this.editRowIndex = ''
        return
      }
      this.delStrategy(scope.row)
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    },
    setCurrent () {
      if (this.editRowIndex) {
        this.$message({
          message: '请先保存',
          type: 'warning'
        });
        return
      }
      if (this.clickCurrentRow != '') {
        this.selectStrategy(this.clickCurrentRow)
        this.handleCancel()
      } else {
        this.$message({
          message: '请选择一条策略',
          type: 'warning'
        });
      }
    },
    // 关闭新建对话框
    handleCancel () {
      this.showStrategy = false
      this.onClose()
    },
    getAutoHeight () {
      debugger
      let el = this.$refs.singleTable,
        elParent = el.parentNode,
        pt = this.getStyle(elParent, "paddingTop"),
        pb = this.getStyle(elParent, "paddingBottom");
      // 一定要使用 nextTick 来改变height 不然不会起作用
      debugger
      this.$nextTick(() => {
        this.height = elParent.clientHeight - (pt + pb) + "px";
      });
    },
    getStyle (obj, attr) {
      // 兼容IE浏览器
      let result = obj.currentStyle
        ? obj.currentStyle[attr].replace("px", "")
        : document.defaultView
          .getComputedStyle(obj, null)[attr].replace("px", "");
      return Number(result);
    }
  },
  mounted () {
    this.getAutoHeight()
  },
  created () {

  },
}
</script>
<style rel='stylesheet/scss' lang='scss'scoped>
.drawer {
  width: 40%;
  margin: 0 auto;
  /* overflow-y: scroll; */
  /* height: 100%; */
}
.windows-icon-bg {
  display: inline-block;
  -webkit-app-region: no-drag;
  height: 100%;
  width: 17%;
  font-size: 30px;
  color: rgba(129, 129, 129, 0.6);
}
.windows-icon-bg:hover {
  background-color: rgba(182, 182, 182, 0.2);
  color: #333;
}
</style>
