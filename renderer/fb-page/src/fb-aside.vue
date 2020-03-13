<template>
    <aside class="aside">
        <template v-for="node in vNodes">
            <div :class="node.asideClassName">
                <fb-form v-if="node.type==='form'" :schema="node"></fb-form>
                <div v-else>
                    <el-alert title="调用错误" type="warning" :description="'找不对对应的渲染模型.path: page/'+node.type"  show-icon></el-alert>
                </div>
            </div>
        </template>
  </aside>
</template>
<script>
    /**
    * @file aside.vue
    * @author zengqingzhuang(zengqingzhuang@baidu.com)
    * @description 侧边栏组件
    * @since 2018/02/01
    */
    import {FbForm} from '../../fb-form';
    import mixinSchema from '../../../src/mixin/schema';
    export default {
        mixins: [mixinSchema],
        data() {
            return{
            }
        },
        components:{
            FbForm
        }
    }
</script>
<style type="text/less" lang="less">
    .aside {
        width: 220px;
        padding: 10px;
        height: auto;
        display: table-cell;
        vertical-align: top;
        float: none;
        background-color: #edf1f2;
        &:before {
            content: "";
            position: absolute;
            width: inherit;
            top: 0;
            bottom: 0;
            z-index: -1;
            background-color: inherit;
            border: inherit;
        }
    }
</style>