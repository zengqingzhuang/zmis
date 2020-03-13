<template>
    <div class="toolbar">
        <div class="col" v-if="schema.title || schema.subTitle || schema.remark">
            <h1 v-if="schema.title"> {{schema.title}} </h1>
            <small v-if="schema.subTitle"> {{schema.subTitle}} </small>
        </div>
        <div class="col" v-if="schema.actions">
            <fb-action :schema="schema.actions"></fb-action>
        </div>
    </div>
</template>
<script>
    /**
    * @file toolbar.vue
    * @author zengqingzhuang(zengqingzhuang@baidu.com)
    * @description 工具栏
    * @since 2018/02/01
    */
    import mixinSchema from '../../../src/mixin/schema';
    import FbAction from '../../fb-action';
    export default{
        mixins: [mixinSchema],
        data() {
            return{
            }
        },
        components: {
            FbAction
        }
    }
</script>

<style type="text/less" lang="less">
    .toolbar {
        display: table;
        table-layout: fixed;
        border-spacing: 0;
        width: 100%;
        height: 57px;
        background-color: #edf1f2;
        border-bottom: 1px solid #dee5e7;
        .col {
            display: table-cell;
            vertical-align: middle;
            height: 100%;
            padding: 10px 15px;
            h1 {
                font-weight: 300;
                color: #000;
                font-size: 24px;
            }
            small {
                color: #98a6ad;
                font-size: 13px;
            }
        }
    }
</style>