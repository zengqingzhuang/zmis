<template>
    <el-breadcrumb separator="/">
        <template v-for="(item, index) in this.value">
            <el-breadcrumb-item :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>
<script>
    /**
     * @file breadcrumb.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @since 2017/10/18
     */
    import mixinSchema from '../../../src/mixin/schema';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            };
        }
    };
</script>
<style type="text/less" lang="less">
</style>