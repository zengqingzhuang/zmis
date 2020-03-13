<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="model.currentPage"
        :page-sizes="model.pageSizes"
        :page-size="model.pageSize"
        :layout="getControls()"
        :total="model.total">
    </el-pagination>
</template>
<script>
    /**
     * @pagination.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 分页组件
     * @since 2017/09/19
    */
    import mixinSchema from '../../../src/mixin/schema';
    import {changeURLPar} from '../../../src/util/modelObject';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            };
        },
        methods: {
            // 每页显示行数改变回调方法
            handleSizeChange(size) {
                this.model.pageSize = size;
                this.$emit('handle-size-change');
                changeURLPar(window.location.href, this.model.perPageField, size);
            },
            // 当前页码改变回调方法
            handleCurrentChange(currentPage) {
                this.model.currentPage = currentPage;
                this.$emit('handle-current-change');
                changeURLPar(window.location.href, this.model.pageField, currentPage);
            },
            // 获取分页功能按钮，必须按照此顺序
            getControls() {
                let layouts = ['prev', 'pager', 'next'];
                // 是否可修改每页显示多少个
                if (this.model.switchPerPage !== false) {
                    layouts.unshift('sizes');
                }
                // 是否显示列表信息，比如一共多少页，有多少条数据
                if (this.model.showPageInfo !== false) {
                    layouts.unshift('total');
                }
                // 显示跳页
                if (this.model.showJumper !== false) {
                    layouts.push('jumper');
                }
                return layouts.join(',');
            }
        }
    }
</script>
        