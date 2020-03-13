<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="tab.title" v-for="(tab, index) in vNodes[0].tabs" :key="index" :name="tab.title">
            {{tab.title}}
           <div class="wrapper"> <el-button type="primary">提交</el-button> </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    /**
     * @file  tabs
     * @author yuchao03(yuchao03@baidu.com)
     *
     * @since 2017/09/08
     */
    import {mixinSchema} from '../../../src/mixin';
    export default{
        mixins: [mixinSchema],
        props: {

        },
        data() {
            return {
                activeName: 'tab1'
            }
        },
        components: {

        }
    }
</script>

<style type="text/less">


</style>
