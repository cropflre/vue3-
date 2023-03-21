<template>
  <div>
    <!--    <LightBreadcrumb class="user-breadcrumb" :date="[{ content: '脚本管理' }, { content: '镜像文件' }]" />-->
    <div class="application-task-script-container">
      <div class="application-task-script-container-nav">
        <div
          v-for="item in navList"
          :key="item.value"
          class="application-task-script-container-nav-item"
          :class="{ active: navActive === item.value, disabled: Boolean(item.disabled) }"
          @click="handleClickForNav(item)"
        >
          <el-tooltip content="敬请期待" effect="dark" placement="top" :disabled="!item.disabled">
            <div class="application-task-script-container-nav-item-main">
              <span>{{ item.label }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="application-task-script-container-content">
        <div class="application-task-script-container-content-main">
          <div class="application-task-script-container-content-filter">
            <div class="application-task-script-container-content-filter-option">
              <el-button type="primary" @click.stop="handleClickImageDialog"> 新建镜像 </el-button>
            </div>
            <div>
              镜像名称：
              <el-input
                @input="handleSelectChange"
                style="width: 300px"
                v-model="formData.ImageTableSelectSearch"
                placeholder="请输入关键字搜索"
              />
            </div>
          </div>
          <div class="application-task-script-container-content-filter-controller">
            <div class="application-task-script-container-content-table">
              <el-table
                class="app-list-table"
                :data="tableComputed"
                :column="scriptTableColumn"
                v-loading="loading"
                :border="true"
                empty-text="暂无数据"
                element-loading-text="拼命加载中......"
                header-cell-class-name="table-header"
              >
                <template #status="scope">
                  <el-button
                    type="text"
                    style="color: #374774; cursor: default"
                    :loading="scope.row?.status === 'packing'"
                  >
                    {{ getStatus(scope.row) }}</el-button
                  >
                </template>
                <template v-for="item in scriptTableColumn">
                  <el-table-column :label="item.label" :prop="item.prop"> </el-table-column>
                </template>
                <el-table-column>
                  <template #default="scope">
                    <div class="application-task-script-container-content-table-operation">
                      <el-button
                        :disabled="scope.row?.status === 'packing'"
                        type="text"
                        @click="handleClickForAddVersion(scope?.row)"
                        >编辑</el-button
                      >
                      <el-button
                        :disabled="scope.row?.status === 'packing'"
                        type="text"
                        @click="handleClickAnew(scope?.row)"
                        >重新打包</el-button
                      >
                      <el-button
                        :disabled="scope.row?.status === 'packing'"
                        type="text"
                        :style="scope.row?.status === 'packing' ? '' : 'color: #f56c6c'"
                        @click="handleClickRemove(scope?.row)"
                        >删除</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div style="width: 100%; margin-top: 12px; text-align: right">
                <el-pagination
                  background
                  v-if="imageTableData.length >= 10"
                  :page-sizes="[5, 10, 20, 50]"
                  :pager-count="5"
                  v-model:current-page="pageConfig.currentPage"
                  v-model:page-size="pageConfig.pageSize"
                  :total="formData?.ImageTableSelectSearch ? filterTableData?.length : imageTableData?.length"
                  layout="total, sizes, prev, pager, next,jumper"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddImageDialog
      v-model="imageDialog"
      :data="dataEditInfo"
      :type="navActive"
      @submit="handleSubmit"
      :is-type="isType"
    />
  </div>
</template>

<script lang="ts" setup>
import { arrayNavList, useComputedNavListLabelMapToValue, ScriptTableColumn } from './index.hook';
import { ElMessage, ElMessageBox } from 'element-plus';
import { INavItem, INavList, IStringMap, MirrorImageScriptType } from './type';
import { cloneDeep } from 'lodash';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { demoData } from './mock';
// import LightTable from '../light-table/LightTable.vue';
// import LightBreadcrumb from '../light-breadcrumb/index.vue';
// import { getPersonalImageListApi, deleteImageApi } from '@/api/application/image/image';
import AddImageDialog from './components/AddImageDialog.vue';
import {GetTableListApi} from "../../api/home/list";
const navList = ref<INavList>(cloneDeep(arrayNavList)); // 导航列表
const navActive = ref<MirrorImageScriptType>('tensorflow'); // 选中的tab
const imageDialog = ref<boolean>(false); // 新建弹窗状态
const loading = ref<boolean>(false); // 列表加载状态
const imageTableData = ref<any>([]);
// 限制类型
const computedNavListLabelMapToValue = computed<IStringMap<MirrorImageScriptType>>(
  useComputedNavListLabelMapToValue(navList),
);
// 点击tab事件
function handleClickForNav(target: INavItem) {
  if (target.disabled) return;
  if (target.value === navActive.value) return;
  const targetValue = computedNavListLabelMapToValue.value[target?.label];
  if (targetValue) {
    navActive.value = targetValue;
    dataEditInfo.value = null;
    getPersonalImageList();
  }
}

const xxxoo = async ()=>{
  const res = await GetTableListApi()
  console.log(res)
}
xxxoo()
const formData = ref({
  ImageTableSelectSearch: '',
});
const pageConfig = ref({
  currentPage: 1,
  pageSize: 10,
  dataTotal: 0,
});
// 待选择列表前端分页+加搜索分页
const tableComputed = computed(() => {
  return (
    formData?.value?.ImageTableSelectSearch || filterTableData.value.length
      ? filterTableData.value
      : imageTableData.value
  ).slice(
    (pageConfig.value.currentPage - 1) * pageConfig.value.pageSize,
    pageConfig.value.currentPage * pageConfig.value.pageSize,
  );
});
const handleSelectChange = (value) => {
  setScreenData(value, imageTableData.value);
};
const filterTableData = ref([]);
const setScreenData = (value, data) => {
  let arr = [];
  if (value) {
    data.filter((item) => {
      if ('image_cname' in item) {
        if (item.image_cname.toUpperCase().indexOf(value.toUpperCase()) > -1 || item.image_cname.indexOf(value) > -1) {
          arr.push(item);
        }
      }
    });
    filterTableData.value = arr;
  } else {
    filterTableData.value = data;
  }
};
//  获取镜像列表
const getPersonalImageList = async (isLoading?: boolean) => {
  clearTimeout(rushTimer.value);
  try {
    if (!isLoading) loading.value = true;
    // const res = await getPersonalImageListApi({
    //   image_type: navActive.value,
    // });

    const res = demoData;
    if (res.result) {
      imageTableData.value = res.data;
    }
  } finally {
    loading.value = false;
    createRushTimer();
  }
};
const rushTimer = ref<any>(null);
// 轮询
const createRushTimer = () => {
  if (imageTableData.value.length) {
    rushTimer.value = setTimeout(() => getPersonalImageList(true), 5000);
  }
};

const getStatus = (row) => {
  if (row.status === 'packing') {
    return '构建中';
  } else if (row.status === 'failed') {
    return '构建失败';
  } else if (row.status === 'succeed') {
    return '构建成功';
  }
};
const scriptTableColumn = ref(cloneDeep(ScriptTableColumn));
const handleSubmit = (item) => {
  if (item) getPersonalImageList();
};
const deleteImage = async (name) => {
  // const res = await deleteImageApi({
  //   image_name: name,
  // });
  const res = null;
  if (res.result) {
    ElMessage.success('删除成功');
    await getPersonalImageList();
  } else {
    ElMessage.error(`删除失败:${res.message}`);
  }
};
const handleClickRemove = (row) => {
  console.log(row, 'row,');
  ElMessageBox.alert(`确定要删除${row?.image_cname}吗?`, '提示', {
    confirmButtonText: '删除',
    type: 'error',
  })
    .then(() => {
      deleteImage(row?.image_name);
    })
    .catch((e) => {
      console.log(e);
    });
};
// 编辑数据
const dataEditInfo = ref(null);
const isType = ref('');
function handleClickForAddVersion(row) {
  if (row) {
    dataEditInfo.value = row;
    imageDialog.value = true;
    isType.value = 'edit';
  } else {
    dataEditInfo.value = null;
  }
}
const handleClickAnew = (row) => {
  if (row) {
    dataEditInfo.value = row;
    imageDialog.value = true;
    isType.value = 'anew';
  } else {
    dataEditInfo.value = null;
  }
};

// 点击新建镜像
function handleClickImageDialog() {
  isType.value = 'add';
  dataEditInfo.value = null;
  imageDialog.value = true;
}

onBeforeUnmount(() => {
  clearTimeout(rushTimer.value);
  rushTimer.value = null;
});
onMounted(getPersonalImageList);
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
