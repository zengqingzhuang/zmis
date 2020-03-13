<script lang="jsx">
    /**
     * @file extend-component.vue
     * @author zengqingzhuang
     * @desc 扩展组件入口
     * @since 2018/02/24
     */
    import {mixinSchema} from '../../src/mixin';
    export default {
        mixins: [mixinSchema],
        render(h) {
            return h(this.schema.type, {
                props: {
                    schema: this.schema,
                    elValue: this.elValue,
                    value: this.model
                }
            });
        }
    }
</script>
