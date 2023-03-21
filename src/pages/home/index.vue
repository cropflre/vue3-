<template>
  <el-container>
    <el-aside width="200px">
    </el-aside>
    <el-main>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
        <el-breadcrumb-item
        ><a href="/">promotion management</a></el-breadcrumb-item
        >
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view></router-view>
    </el-main>
  </el-container>


</template>


<script lang="ts" setup>
import {ref} from 'vue'
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'

const arr1 = [
    {
        "base_image": "tf_2.4.4_hdfs_3.2_gpu",
        "package_name": "aiohttp",
        "package_version": "3.8.4",
        "installed": 0,
        "id": 0,
        "base_image_package_version": "tf_2.4.4_hdfs_3.2_gpu_3.8.4_0"
    },
    {
        "base_image": "tf_2.4.4_hdfs_3.2_gpu",
        "package_name": "redis",
        "package_version": "4.3.5",
        "installed": 0,
        "id": 8,
        "base_image_package_version": "tf_2.4.4_hdfs_3.2_gpu_4.3.5_8"
    }
]
const arr2 = [
    {
        "package_name": "redis",
        "package_version": "4.3.5",
        "installed": 1
    },
    {
        "package_name": "aiohttp",
        "package_version": "3.8.4",
        "installed": 1
    },
    {
        "package_name": "six",
        "package_version": "1.15.0",
        "installed": 1
    },
    {
        "package_name": "scipy",
        "package_version": "1.5.4",
        "installed": 1
    },
    {
        "package_name": "scikit-learn",
        "package_version": "0.24.2",
        "installed": 1
    },
    {
        "package_name": "requests",
        "package_version": "2.25.0",
        "installed": 1
    },
    {
        "package_name": "PyYAML",
        "package_version": "5.4.1",
        "installed": 1
    },
    {
        "package_name": "protobuf",
        "package_version": "3.14.0",
        "installed": 1
    },
    {
        "package_name": "pandas",
        "package_version": "1.1.5",
        "installed": 1
    },
    {
        "package_name": "numpy",
        "package_version": "1.19.4",
        "installed": 1
    },
    {
        "package_name": "Markdown",
        "package_version": "3.3.3",
        "installed": 1
    },
    {
        "package_name": "h5py",
        "package_version": "2.10.0",
        "installed": 1
    },
    {
        "package_name": "grpcio",
        "package_version": "1.32.0",
        "installed": 1
    }
]
let newArr = [...arr1, ...arr2];
// 利用 filter() 和 some() 函数进行去重，并将对象转换为字符串再比较
let resultArr = newArr.filter((item, index) => {
  return !newArr.slice(0, index).some(prevItem => JSON.stringify(prevItem.package_name) === JSON.stringify(item.package_name));
});

console.log(resultArr); // 输出结果为：[{ a: '11' }, { a: 22 }]
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>



