<template>
  <div ref="refGroupContent" class="box">
    <div class="header">
      <t-form ref="refForm" :data="searchFormData">
        <t-row>
          <t-col
            v-for="searchItem in searchFormCol"
            :key="searchItem.index"
            :span="4"
            class="search-col"
          >
            <t-form-item :label="searchItem.colName" :name="searchItem.index">
              <t-input v-model="searchFormData[searchItem.index]"></t-input>
            </t-form-item>
          </t-col>
          <t-col :offset="8" :span="4" style="text-align: right">
            <t-space size="small">
              <t-button theme="primary" @click="handleClickAdd">新增</t-button>
              <t-button theme="primary" type="submit" @click="handleClickSearch"
                >查询</t-button
              >
              <t-button
                theme="default"
                variant="base"
                type="reset"
                @click="() => refForm.reset()"
                >重置</t-button
              >
            </t-space>
          </t-col>
        </t-row>
      </t-form>
    </div>

    <t-divider ref="refTDivider" />

    <div class="main">
      <t-table
        row-key="index"
        :data="tableData"
        :columns="columns"
        :bordered="true"
        :hover="true"
        :maxHeight="tableHeight"
        :pagination="tablePagination"
        cell-empty-content="-"
        resizable
        lazy-load
        @change="handleTableChange"
        @cellClick="handleClickCell"
      >
        <template #action="{ row }">
          <t-space>
            <t-link
              theme="primary"
              @click="
                () =>
                  refContentOperationDrawer.showDrawer({
                    drawerType: 2,
                    ...row,
                  })
              "
              >编辑</t-link
            >
            <t-popconfirm
              theme="danger"
              content="确认删除吗"
              @confirm="handleClickDel(row)"
            >
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>

  </div>

  <ContentOperationDrawer
    ref="refContentOperationDrawer"
    @clickConfirm="onClickDrawerConfirm"
  />
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch, inject, onMounted, nextTick } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { clipboardText } from "@/api/electron.ts";
import ContentOperationDrawer from "./ContentOperationDrawer.vue";
import { queryTextItemList, delTextItem } from "@/api/textItem";

const groupInfo: any = inject("groupInfo");

// 组内容ref
const refGroupContent = ref<any>(null);
// 分割线ref
const refTDivider = ref<any>(null);

window.addEventListener("resize", function () {
  nextTick(() => {
    setTableHeight();
  })
});

onMounted(() => {
  setTableHeight();
});

function setTableHeight() {
  tableHeight.value = refGroupContent.value.offsetHeight - 74 - 49 - 64;
}

// 搜索表单ref
const refForm = ref<any>(null);
// 搜索表单条件
const searchFormCol = computed(() => {
  if (groupInfo.value && groupInfo.value.groupData.length) {
    return groupInfo.value.groupData.filter(
      (val: any) => val.colType !== "encryptText"
    );
  } else {
    return [];
  }
});
// 搜索表单
const searchFormData = reactive(<any>{});
// 搜索
const handleClickSearch = () => {
  tablePagination.value = {
    total: 0,
    pageSize: 10,
    current: 1,
  };
  getTableData();
};
// 搜索表单清除无效数据
const clearSearchFormData = () => {
  for (const key in searchFormData) {
    if (
      searchFormData[key] === "" ||
      searchFormData[key] === undefined ||
      searchFormData[key] === null
    ) {
      delete searchFormData[key];
    }
  }
};

// 表格高度
const tableHeight = ref(0);
// 表格数据
const tableData = ref(<any>[]);
// 表格列
const columns = computed(() => {
  if (groupInfo.value && groupInfo.value.groupData.length) {
    return [
      ...groupInfo.value.groupData.map((val: any) => {
        return {
          title: val.colName,
          colKey: val.index,
          align: "center",
          ellipsis: true,
          cell: (h: any, { row }: any) => {
            return h("span", row[val.index] || "-");
          },
          width: 200,
        };
      }),
      {
        title: "操作",
        colKey: "action",
        align: "center",
        width: 150,
        fixed: "right",
        cell: "action",
      },
    ];
  } else {
    return [];
  }
});
// 分页
const tablePagination = ref({
  total: 0,
  pageSize: 10,
  current: 1,
});
// 表格分页修改
const handleTableChange = ({ pagination }: any) => {
  tablePagination.value.current = pagination.current;
  tablePagination.value.pageSize = pagination.pageSize;
  getTableData();
};
// 表格点击单元格
const handleClickCell = ({ col, row }: any) => {
  if (col.colKey === "action") return;
  if (row[col.colKey]) {
    clipboardText(row[col.colKey]).then(() => {
      MessagePlugin.success("复制成功");
    });
  } else {
    MessagePlugin.warning("该单元格无内容");
  }
};
// 获取表格数据
const getTableData = () => {
  clearSearchFormData();
  queryTextItemList({
    pageSize: tablePagination.value.pageSize,
    current: tablePagination.value.current,
    groupId: groupInfo.value._id,
    ...searchFormData,
  }).then((res: any) => {
    tableData.value = res.data.list;
    tablePagination.value.total = res.data.count;
  });
};
// 删除
const handleClickDel = (row: any) => {
  delTextItem({ _id: row._id }).then(() => {
    MessagePlugin.success("删除成功");
    getTableData();
  });
};

// 点击新增
const handleClickAdd = () => {
  refContentOperationDrawer.value.showDrawer({ drawerType: 1 });
};

// 操作抽屉ref
const refContentOperationDrawer = ref<any>(null);
const onClickDrawerConfirm = () => {
  getTableData();
};

watch(
  groupInfo,
  () => {
    handleClickSearch();
  },
  { deep: true, immediate: true }
);
</script>
<style lang="less" scoped>
.box {
  height: 100%;
  overflow: hidden;
}
.search-col {
  margin-bottom: 10px;
}
</style>
