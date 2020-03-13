<template>
    <div>
        <div class="bottom top">
            <fb-action
                    v-if="this.schema.bulkActions"
                    v-model="model"
                    :schema="this.schema.bulkActions"
                    :disabled="disabledBottom"
                    :elValue="selectRows"
                    :callFunc="filterChangeHandler">
            </fb-action>
            <div class="pagination">
                <fb-pagination
                    v-if="showPagination"
                    v-model="pagination"
                    v-on:handle-current-change="handleCurrentChange"
                    v-on:handle-size-change="handleSizeChange">
                </fb-pagination>
            </div>
        </div>
        <el-table
                :highlight-current-row=true
                :span-method="objectSpanMethod"
                :row-class-name="setSelectedRow"
                :data="tableData"
                :show-overflow-tooltip="true"
                v-loading="loading"
                element-loading-text="Loading"
                :border ="schema.border || schema.border==undefined"
                :height="this.schema.height"
                @select="selectRow"
                @sort-change="sortChange"
                @select-all="selectAllRow"
                @selection-change="selectionChange">
            <el-table-column
                    v-if="this.schema.bulkActions && this.schema.bulkActions.length > 0"
                    type="selection" width="55">
            </el-table-column>
            <template v-for="column in this.showColumns">
                <!-- 按钮列 -->
                <el-table-column
                        fixed="right"
                        :align="column.align"
                        v-if="column.type == 'operation'"
                        :label="column.label"
                        :width="column.width">
                    <template slot-scope="scope">
                        <fb-action
                            v-model="model"
                            :elValue="scope.row"
                            :schema="column.buttons"
                            :callFunc="filterChangeHandler">
                        </fb-action>
                    </template>
                </el-table-column>

                <!-- 单选按钮 -->
                <el-table-column
                     v-else-if="column.type == 'radios'"
                        :align="column.align"
                        :prop="column.name"
                        :label="column.label"
                        :width="column.width">
                    <template slot-scope="scope">
                        <el-radio
                                :label="scope.$index"
                                @change.native="getCurrentRow(scope.row)"
                                v-model="radio"
                                >&nbsp;</el-radio>
                    </template>
                </el-table-column>

                <!-- map列 -->
                <el-table-column
                        v-else-if="column.type == 'map'"
                        :align="column.align"
                        :prop="column.name"
                        :label="column.label"
                        :sortable="column.sortable"
                        :width="column.width">
                    <template slot-scope="scope">
                        <div v-html="column.map[scope.row[column.name]]"></div>
                    </template>
                </el-table-column>

                <!-- tpl列 -->
                <el-table-column
                        v-else-if="column.type == 'tpl'"
                        :align="column.align"
                        :prop="column.name"
                        :label="column.label"
                        :sortable="column.sortable"
                        :width="column.width">
                    <template slot-scope="scope">
                        <div v-if="!column.bubble" v-html="formatTpl(scope.row, column.tpl)"></div>
                        <el-popover v-else trigger="hover" placement="top">
                            <p>{{ scope.row[column.name] }}</p>
                            <div slot="reference" class="name-wrapper">
                                <div v-html="formatTpl(scope.row, column.tpl)"></div>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- diff -->
                <el-table-column
                        v-else-if="column.type == 'diff'"
                        :align="column.align"
                        :label="column.label"
                        :sortable="column.sortable"
                        :width="column.width">
                    <template slot-scope="scope">
                        <div>{{scope.row[column.name]}} <span style="color:red"> {{scope.row[column.diffName]}} </span></div>
                    </template>
                </el-table-column>

                <!-- 普通显示文案列 -->
                <el-table-column
                        v-else
                        :align="column.align"
                        :label="column.label"
                        :prop="column.name"
                        :sortable="column.sortable"
                        :width="column.width"
                        :show-overflow-tooltip="column.overFlowTip">
                </el-table-column>
            </template>
        </el-table>
        <div class="bottom">
            <fb-action
                    v-if="schema.bulkActions"
                    v-model="model"
                    :schema="schema.bulkActions"
                    :disabled="disabledBottom"
                    :elValue="selectRows"
                    :callFunc="filterChangeHandler">
            </fb-action>
            <div class="pagination">
                <fb-pagination
                    v-if="showPagination"
                    v-model="pagination"
                    v-on:handle-current-change="handleCurrentChange"
                    v-on:handle-size-change="handleSizeChange">
                </fb-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     * @crud.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @since 2017/09/19
    */
    import _ from 'lodash'
    import FbAction from '../../fb-action';
    import FbPagination from '../../fb-pagination';
    import '../../../src/tpl';
    import {mixinSchema} from '../../../src/mixin';
    import apify from '../../../src/request/apify';
    import stateHandler from '../../../src/util/stateHandler';
    import {getFilterData} from '../../../src/util/filterObject';
    import {changeURLPar} from '../../../src/util/modelObject';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
                loading: false, // 加载loading
                showPagination: false, // 是否显示分页
                pagination: { // 分页数据
                    pageSizes: this.schema.pageSizes || [10, 20, 30, 40, 50],
                    pageSize: 10,
                    total: 0,
                    currentPage: 1,
                    switchPerPage: true, // 显示每页行数
                    showPageInfo: true, // 显示总页数
                    showJumper: true // 显示跳转到第几页
                },
                showColumns: [], // 真实显示的列
                tableData: [], // 表格数据
                spans: null, // 合并单元格数据
                selectRows: [], // 选择的行数据
                disabledBottom: true, // 底部按钮是否可用
                sortData: {}, // 后端排序所需要的数据
                radio: null
            };
        },
        components: {
            FbAction,
            FbPagination
        },
        created() {
            let node = this.schema;
            node.pageField = node.pageField || 'curPage'; // 分页页码字段名
            node.perPageField = node.perPageField || 'pageSize'; // 每页显示多少条数据字段名
            node.defaultParams = node.defaultParams || {}; // 默认传入参数
            // 优先取url每页行数,再取json配置的,最后取默认值
            let pageSize = parseInt(this.model[node.perPageField]) || parseInt(node.defaultParams[node.perPageField]) || 10;
            // 优先取url页码,再取json配置的,最后取默认值
            let currentPage = parseInt(this.model[node.pageField]) || parseInt(node.defaultParams[node.pageField]) || 1;
            _.assign(this.pagination, {
                pageSize: pageSize,
                currentPage: currentPage,
                pageField: node.pageField,
                perPageField: node.perPageField,
                switchPerPage: node.switchPerPage,
                showPageInfo: node.showPageInfo,
                showJumper: node.showJumper
            });
            this.getData(this.getAjaxParams());
            changeURLPar(window.location.href, node.pageField, currentPage);
            changeURLPar(window.location.href, node.perPageField, pageSize);
        },
        methods: {
            filterChangeHandler(filterData) {
                if (filterData && filterData.target && this.schema.name !== filterData.target) { // 只刷新目标对象
                    return;
                }
                this.pagination.currentPage = 1; // 点击查询，默认查第一页数据
                filterData && delete filterData.target;
                this.getData(this.getAjaxParams());
            },
            // 每页显示行数改变回调方法
            handleSizeChange() {
                this.pagination.currentPage = 1;
                this.getData(this.getAjaxParams());
            },
            // 当前页码改变回调方法
            handleCurrentChange() {
                this.getData(this.getAjaxParams());
            },
            getCurrentRow(val){
                this.$set(this.model[this.schema.name], 'radioRow', val);
            },
            // 获取数据
            async getData(params) {
                try {
                    if (this.loading) return;
                    let node = this.schema;
                    let store = this.$store;
                    this.loading = true;
                    this.disabledBottom = true; // 底部按钮不可点击
                    this.getShowColumns(); // 获取显示的列
                    node.filter && _.assign(params, getFilterData(node.filter.controls, this.model), this.sortData);
                    if (node.api) { // crud中调用api取值
                        store.dispatch('formDisabled', true);
                        let res = await apify(node.api).initApi(params);
                        this.tableData = res.data.rows;
                        this.spans = res.data.spans;
                        this.pagination.total = res.data.count;
                        if (this.pagination.total > node.defaultParams[node.perPageField]) {
                            this.showPagination = true;
                        } else {
                            this.showPagination = false;
                        }
                        this.$set(this.model, node.name, res.data);
                        store.dispatch('formDisabled', false);
                    } else if (node.name) { // form中initApi接口中返回的数据
                        let data = this.model[node.name];
                        if (data) {
                            this.tableData = data;
                        } else { // 当表单中有table，数据依赖异步接口所以要监听
                            this.$watch('model.' + node.name, (val) => {
                                this.tableData = val;
                            });
                        }
                    }
                    this.loading = false;
                } catch (e) { 
                    this.loading = false;
                    store.dispatch('formDisabled', false);
                }
            },
            // 列表tpl列数据处理
            formatTpl(rowData, express) {
                window.pageData = _.assign({}, this.model, rowData);
                return _.template(express)(window.pageData);
            },
            // 选择单行事件
            selectRow(selection, row) {
                this.selectRows = selection;
                this.$set(this.model, 'selectedRows', selection);
            },
            // 选择所有行事件
            selectAllRow(selection) {
                this.selectRows = selection;
                this.$set(this.model, 'selectedRows', selection);
            },
            selectionChange(selection) {
                if (selection.length > 0) {
                    this.disabledBottom = false; // disabledBottom可用
                } else {
                    this.disabledBottom = true; // disabledBottom不可用
                }
            },
            // 选中行数据，添加背景色
            setSelectedRow(data) {
                if (this.schema.selectedRow && data.row.id && data.row.id == this.model.id) {
                    return 'current-row';
                }
            },
            // 合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                let spans = this.spans;
                let rowData = null;
                if (spans && spans.length > 0) {
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (span.rowNum) { // 合并行
                            if (rowIndex >= span.rowNum - 1 && columnIndex === (span.col - 1)) {
                                if ((rowIndex - span.rowNum + 1) % span.row === 0) {
                                    rowData = {
                                        rowspan: span.row,
                                        colspan: span.col
                                    }
                                    break;
                                }
                            }
                        } else if (span.colNum) { // 合并列
                            if (columnIndex === span.colNum - 1 && (columnIndex - span.colNum + 1) % span.col === 0) {
                                rowData = {
                                    rowspan: span.row,
                                    colspan: span.col
                                }
                                break;
                            }
                        }
                    }
                }
                if (rowData) {
                    return rowData;
                }
            },
            // 列的sortable属性为custom时开启后端排序
            sortChange(sortObj) {
                let orderBy = sortObj.order == 'ascending' ? 'asc' : 'desc';
                let sortParam = sortObj.prop;
                this.sortData = {orderBy, sortParam};
                this.pagination.currentPage = 1;
                this.getData(this.getAjaxParams());
            },
            // 以下方法非模板调用方法
            // 获取分页数据-默认表格显示第一页，每页10条数据
            getAjaxParams() {
                let node = this.schema;
                let pagination = this.pagination;
                let data = _.cloneDeep(node.defaultParams); // 传入默认参数
                data[node.pageField] = pagination.currentPage;
                data[node.perPageField] = pagination.pageSize;
                return data;
            },
            // 获取table显示的列
            getShowColumns() {
                this.showColumns = [];
                this.schema.columns.forEach(column => {
                    let state = stateHandler({
                        vNode: column,
                        pageData: this.model
                    });
                    if (state.visible) {
                        this.showColumns.push(column);
                    }
                });
            }
        }
    }
</script>
<style type="text/less" lang="less">
    .bottom {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .pagination {
            flex: 1;
        }
    }
    .top {
        margin-top: 0;
        margin-bottom: 10px;
    }
    .el-table {
        th {
            padding: 6px 0;
        }
        td {
            padding: 8px 0;
        }
    }
</style>