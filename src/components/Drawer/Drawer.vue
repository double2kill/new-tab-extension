<template>
  <a-drawer
    :title="drawerTitle"
    placement="right"
    width="50%"
    :closable="true"
    :visible="visible"
    @close="closeDrawer"
  >
    <p>
      <a-textarea
        :value="textarea"
        width="50%"
        placeholder="请输入备忘录文本"
        rows="4"
        @change="setTextArea"
      />
    </p>
    <p style="text-align: right">
      <a-button
        type="primary"
        :disabled="isAddToListButtonDisabled"
        @click="addToList"
      >
        添加至列表
      </a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="tableData"
      row-key="id"
      :locale="{
        emptyText:'无数据,请添加至列表'
      }"
    >
      <template #href="{record}">
        <a
          :href="record.href"
          target="__blank"
        >
          {{ record.href }}
        </a>
      </template>
      <template #updateTime="{record}">
        {{ moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #action="{record}">
        <span>
          <a @click="goToDetail(record.id)">详情</a>
          <a-divider type="vertical" />
          <a @click="deleteItem(record.id)">删除</a>
        </span>
      </template>
    </a-table>
    <DetailDrawer />
  </a-drawer>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import Localstorage from 'localstorage'
import moment from 'moment'
import {
  getTableDataFromLocalStorage,
  textarea,
  setTextArea,
  tableData,
  setTableData,
  closeDrawer,
  addToList,
  deleteItem,
  jiraIdText,
  goToDetail,
  isAddToListButtonDisabled,
  drawerTitle
} from './index'
import DetailDrawer from './DetailDrawer.vue'
import { LinkOutlined } from '@ant-design/icons-vue'

const openPage = (href) => {
  window.open(href)
}

const columns = [
  {
    dataIndex: 'text',
    key: 'text',
    title: '备忘录',
    ellipsis: true,
  },
  {
    dataIndex: 'href',
    key: 'href',
    title: '网址',
    slots: { customRender: 'href' },
  },
  {
    dataIndex: 'updateTime',
    key: 'updateTime',
    title: '更新时间',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.updateTime - b.updateTime,
    slots: { customRender: 'updateTime' },
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    slots: { customRender: 'action' },
  },
]

onMounted(() => {
  getTableDataFromLocalStorage()
})

defineProps({
  visible: Boolean,
  onClose: Function,
})
</script>