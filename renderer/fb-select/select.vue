
<script lang="jsx">
    /**
     * @file select-base.vue
     * @author yuchao03(yuchao03@baidu.com)
     *
     * @since 2017
     */
    import {mixinSchema} from '../../src/mixin';
    import SelectBase from './src/select-base';
    import SelectAsync from './src/select-async';
    export default {
        mixins: [mixinSchema],
        data() {
            return {

            }
        },
        components: {
            SelectBase,
            SelectAsync
        },
        render(h){
            if(this.schema.source) {
                return  <select-async disabled={this.disabled} elValue={this.elValue} schema={this.schema} v-model={this.model}></select-async>;
            }
            return <select-base disabled={this.disabled} schema={this.schema} v-model={this.model}></select-base>;
        }
    }
</script>
