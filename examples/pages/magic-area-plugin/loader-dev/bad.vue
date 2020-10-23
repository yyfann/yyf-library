<template lang="html">
  <div class="documentation-container" v-loading="loadingFlag">
    <div v-if="documentationData" style="height: 100%;overflow: hidden;">
      <div>
        <div class="top-bar">
          <h3 class="title">项目文档</h3>
          <div class="btn-group">
            <auth-wrapper auth-key="PROJECT-LINE-DOC-SCWD">
              <el-button type="maiaPrimary" size="small" @click="toggleDocumentDialog">上传文档</el-button>
            </auth-wrapper>
          </div>
        </div>
        <el-form class="search-form alm-form" inline>
          <el-form-item label="名称:">
            <el-input v-model.trim="form.name" size="small"  placeholder="请输入文档名称"></el-input>
          </el-form-item>
          <el-form-item label="标签:">
            <el-select v-model="form.tag" size="small">
              <el-option v-for="(item, index) in tagList" :label="item.name" :value="item.name" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-group">
            <el-button type="maiaPrimary" size="small" @click="fetchData">搜索</el-button>
            <el-button type="maiaPlain" size="small" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="box">
        <div class="documentation-table documentation-list">
          <h4 class="list-title">
            项目：{{documentationData.projectName}}
          </h4>
          <documentation-table
            @refreshData="fetchData"
            tableType="parent"
            :tableData="documentationData.projectDocList">
          </documentation-table>
        </div>
        <div class="documentation-list" v-for="(item, index) in documentationData.subProjectInfoList" :key="index">
          <h4 class="list-title child-title">子项目：{{item.subProjectName}}</h4>
          <div class="list-table">
            <documentation-table
              @refreshData="fetchData"
              tableType="child"
              :tableData="item.subProjectDocList">
            </documentation-table>
          </div>
        </div>
      </div>
      <upload-dialog
        :uploadData="documentationData"
        :visible.sync="documentDialog"
        @refreshUpload="handleSuccessUpload"
        handleType="parentProject">
      </upload-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepCopy } from '@/utils'
import { projectDocList, projectDocTags } from '@/api/project'
import DocumentationTable from '@/components/project/documentation/DocumentationTable.vue'
import UploadDialog from '@/components/project/common/UploadDocumentDialog.vue'
export default {
  components: {
    DocumentationTable,
    UploadDialog
  },
  created () {
    zhuge.track('进入_WEB_项目项目文档')
    this.fetchParams()
    this.fetchData()
  },
  data () {
    return {
      form: {
        name: '',
        tag: '全部'
      },
      documentDialog: false,
      tagList: [],
      documentationData: null,
      uploadProjectList: [],
      uploadTags: {},
      loadingFlag: false
    }
  },
  computed: {
    ...mapGetters('global', ['getProjectId', 'getProjectStatus', 'getProjectCenter' ])
  },
  watch: {
    getProjectId (val) {
      if (+this.getProjectCenter === 0) {
        this.projectId = val
        this.$router.push(`/project/line/documentation/${val}`)
        this.fetchParams()
        this.fetchData()
      } else if (+this.getProjectCenter === 1) {
        this.$router.push(`/project/center/${val}`)
      }
    },
    getProjectStatus (val, oldVal) {
      if (val !== oldVal) {
        this.fetchParams()
        this.fetchData()
      }
    }
  },
  methods: {
    resetForm () {
      this.form = {
        name: '',
        tag: '全部'
      }
      this.fetchData()
    },
    fetchParams () {
      let params = {
        data: {
          projectId: this.$route.params.id
        }
      }
      projectDocTags(params).then(res => {
        if (+res.code === 10000) {
          this.tagList = res.data
        }
      })
    },
    fetchData () {
      let params = {
        data: {
          name: this.form.name,
          tag: this.form.tag,
          projectId: this.$route.params.id
        }
      }
      this.loadingFlag = true
      projectDocList(params).then(res => {
        if (+res.code === 10000) {
          this.documentationData = deepCopy(res.data)
          this.handleUploadProjectList()
        }
        this.loadingFlag = false
      })
    },
    handleUploadProjectList () {
      let obj = {}
      obj.projectName = this.documentationData.projectName
      obj.projectId = this.documentationData.projectId
      obj.isSubProject = false
      this.uploadProjectList.push(obj)
      this.uploadTags[this.documentationData.projectId] = this.documentationData.projectTagList
      this.documentationData.subProjectInfoList && this.documentationData.subProjectInfoList.forEach((sub) => {
        obj = {}
        obj.projectName = sub.subProjectName
        obj.projectId = sub.subProjectId
        obj.isSubProject = true
        this.uploadProjectList.push(obj)
        this.uploadTags[sub.subProjectId] = sub.subProjectTagList
      })
    },
    toggleDocumentDialog () {
      this.documentDialog = !this.documentDialog
    },
    handleSuccessUpload () {
      this.fetchParams()
      this.fetchData()
      this.toggleDocumentDialog()
    }
  }
}
</script>

<style lang="less" scoped>
.documentation-container {
  background: #ffffff;
  padding: 12px;
  min-height: 300px;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .box {
    height: calc(100% - 90px);
    overflow: auto;
  }
  .top-bar {
    overflow: hidden;
    margin-bottom: 7px;
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 500;
      float: left;
      line-height: 32px;
    }
    .btn-group {
      float: right;
    }
  }
  .search-form {
    margin-bottom: 12px;
  }
  .documentation-table {
    margin-bottom: 24px;
  }
  .documentation-list {
    margin-bottom: 24px;
    .list-title {
      color: #333333;
      font-weight: 500;
      line-height: 22px;
      font-size: 14px;
      margin-bottom: 12px;
      &.child-title {
        &::before {
          display: block;
          width: 18px;
          height: 18px;
          background: #5587f0;
          line-height: 15px;
          text-align: center;
          content: '-';
          color: #ffffff;
          float: left;
          margin-top: 2px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
