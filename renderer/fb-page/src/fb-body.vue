<template>
    <section class="fb-body">
        <template v-for="(node, index) in vNodes">
            <div :class="node.bodyClassName">
                <fb-panel v-if="node.type === 'form'" :title="node.title">
                    <fb-form :schema="node"></fb-form>
                </fb-panel>
                <fb-panel v-else-if="node.type === 'crud'" :title="node.title" >
                    <fb-crud :schema="node"></fb-crud>
                </fb-panel>
                <fb-panel v-else>
                    <el-alert title="调用错误"
                        type="warning"
                        :description="'找不对对应的渲染模型。' + (schema.type ? schema.type : '配置文件错误')"
                        show-icon>
                    </el-alert>
                </fb-panel>
            </div>
        </template>
    </section>
</template>
<script>
    /**
    * @file body.vue
    * @author zengqingzhuang(zengqingzhuang@baidu.com)
    * @description body组件入口
    * @since 2018/02/01
    */
    import {FbForm} from '../../fb-form';
    import FbCrud from '../../fb-crud';
    import mixinSchema from '../../../src/mixin/schema';
    import FbPanel from './fb-panel';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            }
        },
        components: {
            FbPanel,
            FbForm,
            FbCrud
        }
    }
</script>
<style type="text/less" lang="less">
    .fb-body {
        padding: 15px;
    }
</style>