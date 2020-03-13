<template>
    <el-tree
        v-if="treeData.length"
        :data="treeData" 
        v-loading="loading" 
        element-loading-text="Loading" 
        :expand-on-click-node="false" 
        :empty-text="emptyText" 
        highlight-current default-expand-all 
        @node-click="handleNodeClick">
    </el-tree>
</template>
<script>
    /**
     * @file tree
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 树结构
     * @since 2017/10/10
     */
    import url from 'url';
    import {mixinSchema} from '../../../src/mixin';
    import {getFilterData} from '../../../src/util/filterObject';
    import {changeURLPar} from '../../../src/util/modelObject';
    import apify from '../../../src/request/apify';
    export default{
        mixins: [mixinSchema],
        data() {
            return{
                loading: false,
                treeData: [],
                emptyText: ''
            }
        },
        async created() {
            this.loading = true;
            try {
                let result = await apify(this.schema.source).initApi();
                this.treeData = result.data;
                this.loading = false;
            } catch(e) {
                this.loading = false;
                this.emptyText = '暂无数据';
            }
        },
        methods: {
            handleNodeClick(data) {
                if (!data.id) return;
                let pageSchema = this.$store.state.pageSchema;
                let controls = [];
                let body = pageSchema.body;
                if (Array.isArray(body)) {
                    for (let i = 0; i < body.length; i++) {
                        if (body[i].name === this.schema.target) {
                            controls = body[i].filter.controls;
                            break;
                        }
                    }
                } else if (body instanceof Object) {
                    controls = body.filter && body.filter.controls;
                }
                let formData = getFilterData(controls, this.model);
                // 要刷新的目标对象
                formData.target = this.schema.target;
                // 修改地址栏参数
                changeURLPar(window.location.href, this.schema.name, data.id);
                this.$store.dispatch('filter', formData);
            }
        }
    }
</script>
