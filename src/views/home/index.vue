<template>
  <el-container>
    <el-header style="display: flex; align-items: center; justify-content: space-between">
      <div>杂念屋</div>
      <div>人生真是寂寞如雪啊~~</div>
    </el-header>

    <el-container>
      <el-aside
        style="overflow: hidden; height: calc(100vh - 115px); margin-top: 8px"
        :width="isCollapse ? '63px' : '200px'"
      >
        <el-menu router :default-active="activePath" :collapse="isCollapse" class="el-menu-vertical-demo">
          <el-menu-item index="/home/table" @click="saveActiveNav('/home/table')">
            <el-icon>
              <House />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Setting />
              </el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="2-1">权限管理</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/home/table" @click="saveActiveNav('/home/table')">
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
        <div
          style="position: absolute; bottom: 30px; border-bottom: 1px solid #e2e2e2; width: 205px"
          :style="{ width: isCollapse ? '63px' : '200px' }"
        ></div>
        <div style="position: absolute; bottom: 0; left: 30px; cursor: pointer" @click="isCollapse = !isCollapse">
          <el-icon :size="20">
            <Expand v-if="isCollapse" />
            <Fold v-if="!isCollapse" />
          </el-icon>
        </div>
      </el-aside>
      <el-main style="height: 100%; margin: 8px; background-color: #f6f7fb; width: 100%; overflow: hidden">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Setting, House, User, Expand, Fold } from '@element-plus/icons-vue';

const activePath = ref('');
const isCollapse = ref(true);

const saveActiveNav = (path: string) => {
  activePath.value = path;
};
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 205px;
  min-height: 400px;
}
</style>
