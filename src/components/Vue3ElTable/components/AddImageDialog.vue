<template>
  <el-dialog
    v-model="computedModelValue"
    append-to-body
    :width="1000"
    :title="titleComputed"
    :confirm-text="nameComputed"
    @close="handlerClose"
  >
    <div class="add-image-dialog">
      <div title="镜像信息">
        <div style="margin-bottom: 12px; margin-top: 12px">
          <el-form ref="fromRef" :model="formData" :rules="imageRules" label-width="100px">
            <el-form-item label="基础镜像：" :prop="isType !== ISTYPE.edit ? 'basicsImage' : ''">
              <el-select
                :disabled="['anew', 'edit'].includes(isType)"
                v-model="formData.basicsImage"
                clearable
                size="small"
                style="width: 300px"
                placeholder="请选择镜像"
                @focus="getBaseImages"
                @clear="handleImageClear"
                @change="handleChange"
              >
                <el-option v-for="(item, index) in basicsImageList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="镜像名称：" prop="imageName" v-if="isType !== ISTYPE.anew">
              <el-input size="small" style="width: 300px" v-model="formData.imageName" placeholder="请输入镜像名称" />
            </el-form-item>
            <el-form-item label="镜像描述：" prop="imageDesc" v-if="isType !== ISTYPE.anew">
              <el-input size="small" style="width: 300px" v-model="formData.imageDesc" placeholder="请输入镜像描述" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div title="包信息">
        <el-row :gutter="20" style="margin-top: 12px">
          <el-col :span="12" v-if="isType !== ISTYPE.edit">
            <el-card shadow="never">
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px">
                <div style="font-weight: 700" v-if="isType !== ISTYPE.edit">包列表</div>
                <div>
                  <el-input
                    @input="handleSelectChange"
                    style="width: 160px"
                    v-model="formData.ImageTableSelectSearch"
                    placeholder="请输入关键字搜索"
                  />
                </div>
              </div>
              <div>
                <el-table
                  ref="multipleTableRef"
                  class="app-list-table"
                  :data="tableComputed"
                  :row-key="getRowKey"
                  :border="true"
                  max-height="500"
                  empty-text="暂无数据"
                  header-cell-class-name="table-header"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    v-if="isType !== ISTYPE.edit"
                    width="50"
                    align="center"
                    :reserve-selection="true"
                    type="selection"
                  />
                  <el-table-column prop="package_name" label="包名"></el-table-column>
                  <el-table-column prop="package_version" label="版本">
                    <template #default="scope">
                      {{ scope.row.package_version || '-' }}
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 100%; margin-top: 12px">
                  <el-pagination
                    small
                    background
                    :page-sizes="[10, 20, 50]"
                    :pager-count="5"
                    v-model:current-page="pageConfig.currentPage"
                    v-model:page-size="pageConfig.pageSize"
                    :total="formData.ImageTableSelectSearch ? filterTableData.length : selectTableData.length"
                    layout="total, sizes, prev, pager, next"
                  />
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="isType !== ISTYPE.edit ? 12 : 24">
            <el-card shadow="never" :style="isType === ISTYPE.edit ? 'border: none;margin-top: -12px;' : ''">
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px">
                <div style="font-weight: 700" v-if="isType !== ISTYPE.edit">已选择包</div>
                <div>
                  <el-input
                    @input="handleInstalledChange"
                    style="width: 160px"
                    v-model="formData.ImageTableSelectedSearch"
                    placeholder="请输入关键字搜索"
                  />
                </div>
              </div>
              <div>
                <el-table
                  class="app-list-table"
                  max-height="500"
                  :data="installedTableComputed"
                  :border="true"
                  empty-text="暂无数据"
                  header-cell-class-name="table-header"
                >
                  <el-table-column prop="package_name" label="包名"></el-table-column>
                  <el-table-column prop="package_version" label="版本">
                    <template #default="scope">
                      {{ scope.row.package_version || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="70" v-if="isType !== ISTYPE.edit">
                    <template #default="scope">
                      <span>
                        <span
                          v-if="!scope.row?.installed"
                          style="color: #f56c6c; cursor: pointer"
                          @click="handleDelRowClick(scope?.row)"
                          >删除</span
                        >
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 100%; margin-top: 12px">
                  <el-pagination
                    small
                    background
                    :page-sizes="[10, 20, 50]"
                    :pager-count="5"
                    v-model:current-page="installedPageConfig.currentPage"
                    v-model:page-size="installedPageConfig.pageSize"
                    :total="formData.ImageTableSelectedSearch ? filterInstalledTableData.length : installedData.length"
                    layout="total, sizes, prev, pager, next"
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <template #footer>
<!--      @on-confirm="handlerSubmit"-->
<!--      @on-close="handlerClose"-->
<!--      @on-cancel="handlerClose"-->
      <el-button type="primary" @click="handlerSubmit">{{nameComputed}}</el-button>
      <el-button @click="handlerClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, nextTick, onMounted, PropType, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
// import div from '@/components/light-context-container/index.vue';
import LightTable from '@/components/light-table/LightTable.vue';
// import {
//   getBaseImagesApi,
//   getBaseImagePackagesApi,
//   createImageApi,
//   rebuildImageApi,
//   editImageApi,
// } from '@/api/application/image/image';

const props = defineProps({
  // 表单回显数据
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  // 弹窗状态
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  type: {
    type: String as PropType<string>,
    default: 'tensorflow',
  },
  // 判断是打包:anew\新建:add\编辑:edit状态
  isType: {
    type: String as PropType<string>,
    default: '',
  },
});
const { data, modelValue, type, isType } = toRefs(props);

const ISTYPE = {
  anew: 'anew', // 打包
  add: 'add', // 新建
  edit: 'edit', // 编辑
};
const emits = defineEmits(['update:modelValue', 'submit', 'close']);
const triggerShowUp = ref({
  basic: true,
  struct: true,
  partition: true,
  bucket: true,
  customProperties: true,
  index: true,
});
const imageRules = ref({
  basicsImage: [{ required: true, message: '请选择镜像', trigger: 'change' }],
  imageName: [{ required: true, message: '请选择输入包名', trigger: 'blur' }],
  imageDesc: [{ required: true, message: '请选择输入包描述', trigger: 'blur' }],
});

const selectTableData = ref<any>([]);
const multipleTableRef = ref(null);
const filterInstalledTableData = ref([]);
const pageConfig = ref({
  currentPage: 1,
  pageSize: 10,
  dataTotal: 0,
});
const titleComputed = computed(() => {
  switch (isType?.value) {
    case ISTYPE.anew:
      return '重新打包';
    case ISTYPE.add:
      return '新建镜像';
    case ISTYPE.edit:
      return '编辑镜像';
    default:
      return '';
  }
});
const nameComputed = computed(() => {
  switch (isType?.value) {
    case ISTYPE.anew:
      return '打包';
    case ISTYPE.add:
      return '新建';
    case ISTYPE.edit:
      return '编辑';
    default:
      return '';
  }
});
const installedPageConfig = ref({
  currentPage: 1,
  pageSize: 10,
  dataTotal: 0,
});
const filterTableData = ref([]);
const installedPackageData = ref([]);
const basicsImageList = ref([]);
// 基础镜像表单
const formData = ref({
  basicsImage: '',
  ImageTableSelectSearch: '',
  ImageTableSelectedSearch: '',
  imageName: '',
  imageDesc: '',
});
const handleChange = async () => {
  await nextTick();
  multipleTableRef.value?.clearSelection();
  await getBaseImagePackages();
};

// 处理已安装包列表数据
const getHaveAlreadyInstalledPackageListData = (data) => {
  const result = data.map((item) => {
    //  有==就截取称数组
    const [package_name, package_version] = item.split('==');
    return { package_name, package_version, installed: 1 };
  });
  return result;
};

// 处理包列表和已安装的包,返回不相同的数据
const getPackageDeWeightList = (arr1: any, arr2: any) => {
  let resultArr = [...arr1, ...arr2].filter((item) => {
    return (
      !arr1.some((prevItem) => JSON.stringify(item.package_version) === JSON.stringify(prevItem.package_version)) ||
      !arr2.some((nextItem) => JSON.stringify(item.package_version) === JSON.stringify(nextItem.package_version))
    );
  });
  return resultArr;
};

const handleImageClear = async (type) => {
  await nextTick();
  selectTableData.value = [];
  installedPackageData.value = [];
  installedDefaultData.value = [];
  if ([ISTYPE.anew, ISTYPE.edit].includes(isType?.value) && data?.value) {
    formData.value.basicsImage = data?.value?.base_image || '';
    formData.value.imageDesc = data?.value?.image_desc;
    formData.value.imageName = data?.value?.image_cname;
    if (isType?.value === ISTYPE.anew) {
      await getBaseImagePackages();
    }
    installedDefaultData.value = getHaveAlreadyInstalledPackageListData(data?.value?.packages);
    installedDefaultData.value = getPackageDeWeightList(selectTableData.value, installedDefaultData.value);
  } else {
    if (type === 'add') {
      fromRef.value?.resetFields();
      formData.value = {
        basicsImage: '',
        ImageTableSelectSearch: '',
        ImageTableSelectedSearch: '',
        imageName: '',
        imageDesc: '',
      };
    }
  }
  await toggleSelection();
};

// 待选择列表前端分页+加搜索分页
const tableComputed = computed(() => {
  return (
    formData?.value?.ImageTableSelectSearch || filterTableData.value.length
      ? filterTableData.value
      : selectTableData.value
  ).slice(
    (pageConfig.value.currentPage - 1) * pageConfig.value.pageSize,
    pageConfig.value.currentPage * pageConfig.value.pageSize,
  );
});

// 已安装的包前端分页
const installedTableComputed = computed(() => {
  return (
    formData?.value?.ImageTableSelectedSearch || filterInstalledTableData.value.length
      ? filterInstalledTableData.value
      : installedData.value
  ).slice(
    (installedPageConfig.value.currentPage - 1) * installedPageConfig.value.pageSize,
    installedPageConfig.value.currentPage * installedPageConfig.value.pageSize,
  );
});

const computedModelValue = computed<boolean>({
  get() {
    if (modelValue?.value) {
      handleImageClear('add');
    }
    return modelValue.value;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});

// 删除弹窗
const handleDelRowClick = (row) => {
  multipleTableRef.value?.toggleRowSelection(row, false);
};
// 勾选所有复选框事件
const handleSelectionChange = (rows) => {
  installedPackageData.value = rows;
};
const toggleSelection = async () => {
  await nextTick();
  if (selectTableData.value.length) {
    selectTableData.value.forEach((item) => {
      multipleTableRef.value?.toggleRowSelection(item, true);
    });
  } else {
    multipleTableRef.value?.clearSelection();
  }
};
const getRowKey = (row) => {
  return row.base_image_package_version;
};

// 待选择搜索事件
const handleSelectChange = (value) => {
  setScreenData('select', value, selectTableData.value);
};
// 已选搜索事件
const handleInstalledChange = (value) => {
  setScreenData('installed', value, installedData.value);
};
/**
 * 筛选数据方法(前端搜索)
 * value: 搜索字段
 * data: 原始数据
 * type：类型：1、select:选择框，2、installed：已安装
 * */
const setScreenData = (type, value, data) => {
  let arr: any = [];
  if (value) {
    const resultArr = data.filter(item => item.includes(value));
    arr = resultArr;
  } else {
    arr = data;
  }
  if (type === 'select') {
    filterTableData.value = arr;
  } else {
    filterInstalledTableData.value = arr;
  }
};
//  获取基础镜像列表
const getBaseImages = async () => {
  const res = await getBaseImagesApi({
    image_type: type.value,
  });
  if (res.result) {
    basicsImageList.value = res.data;
  } else {
    ElMessage.error(`获取基础镜像失败：${res?.message}`);
  }
};
const installedData = computed(() => {
  const arr = installedDefaultData.value.concat(installedPackageData.value);
  return arr.reverse();
});
const installedDefaultData = ref([]);
const getBaseImagePackages = async () => {
  if (formData.value.basicsImage) {
    // const res = await getBaseImagePackagesApi({
    //   base_image: formData.value.basicsImage,
    // });
    const res = {
      result: true,
      code: 0,
      message: 'success',
      data: [
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'aiohttp',
          package_version: '3.8.4',
          installed: 0,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'grpcio',
          package_version: '1.32.0',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'h5py',
          package_version: '2.10.0',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'Markdown',
          package_version: '3.3.3',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'numpy',
          package_version: '1.19.4',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'pandas',
          package_version: '1.1.5',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'protobuf',
          package_version: '3.14.0',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'PyYAML',
          package_version: '5.4.1',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'redis',
          package_version: '4.3.5',
          installed: 0,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'requests',
          package_version: '2.25.0',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'scikit-learn',
          package_version: '0.24.2',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'scipy',
          package_version: '1.5.4',
          installed: 1,
        },
        {
          base_image: 'tf_2.4.4_hdfs_3.2_gpu',
          package_name: 'six',
          package_version: '1.15.0',
          installed: 1,
        },
      ],
      request_id: '5cc16c93b3859c8707737ff25409cb57',
    };
    if (res.result) {
      selectTableData.value = [];
      installedPackageData.value = [];
      installedDefaultData.value = [];
      const arr = []; // 自定义数据
      let arrNew = []; // 已勾选的数据
      res.data.forEach((item, index) => {
        item.id = index;
        item.base_image_package_version = `${item.base_image}_${item.package_version}_${index}`;
        if (item.installed) {
          arr.push(item);
        } else {
          arrNew.push(item);
        }
      });
      selectTableData.value = arrNew;
      installedDefaultData.value = arr;
      pageConfig.value.dataTotal = selectTableData.value.length;
      // 默认勾选
      // await toggleSelection();
    } else {
      ElMessage.error(`获取基础镜像对应的依赖包失败：${res?.message}`);
    }
  }
};

//  重新打包
const rebuildImage = async () => {
  const arr = [];
  if (installedData?.value?.length) {
    installedData.value.forEach((item) => {
      if (item?.package_version) {
        arr.push(`${item.package_name}==${item.package_version}`);
      } else {
        arr.push(item.package_name);
      }
    });
  }
  const res = await rebuildImageApi({
    image_name: data?.value.image_name,
    packages: arr,
  });
  if (res.result) {
    ElMessage.success('重新打包成功!');
    handlerClose();
    emits('submit', true);
  } else {
    ElMessage.error(`重新打包失败:${res.message}`);
  }
};

// 编辑镜像
const editImage = async () => {
  const res = await editImageApi({
    base_image: formData.value.basicsImage,
    image_cname: formData.value.imageName,
    image_desc: formData.value.imageDesc,
    image_name: data?.value?.image_name,
  });
  if (res.result) {
    ElMessage.success('编辑成功!');
    handlerClose();
    emits('submit', true);
  } else {
    ElMessage.error(`编辑失败:${res.message}`);
  }
};

// 新建镜像
const createImage = async () => {
  const arr = [];
  if (installedData?.value?.length) {
    installedData.value.forEach((item) => {
      if (item?.package_version) {
        arr.push(`${item.package_name}==${item.package_version}`);
      } else {
        arr.push(item.package_name);
      }
    });
  }
  const res = await createImageApi({
    base_image: formData.value.basicsImage,
    image_cname: formData.value.imageName,
    image_desc: formData.value.imageDesc,
    packages: arr,
  });
  if (res.result) {
    ElMessage.success('创建成功!');
    handlerClose();
    emits('submit', true);
  } else {
    ElMessage.error(`创建镜像失败:${res.message}`);
  }
};

// 点击确定事件
const handlerSubmit = async () => {
  if (isType?.value === ISTYPE.anew) {
    await rebuildImage();
  } else if (isType?.value === ISTYPE.add) {
    if (!judgeForm()) return;
    await createImage();
  } else if (isType?.value === ISTYPE.edit) {
    await editImage();
  }
};
// 点击取消事件
const handlerClose = () => {
  computedModelValue.value = false;
  fromRef.value?.resetFields();
  multipleTableRef.value?.clearSelection();
  selectTableData.value = [];
  installedPackageData.value = [];
  installedDefaultData.value = [];
  formData.value = {
    basicsImage: '',
    ImageTableSelectSearch: '',
    ImageTableSelectedSearch: '',
    imageName: '',
    imageDesc: '',
  };
  filterInstalledTableData.value = [];
  filterTableData.value = [];
};
const fromRef = ref(null);
// 判断新建项目表单是否填写
const judgeForm = () => {
  let result = true;
  if (fromRef.value) {
    fromRef.value.validate((res) => {
      result = res;
    });
  }
  return result;
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.add-image-dialog {
  :deep(.el-card__body) {
    padding: 12px;
  }
}
</style>
