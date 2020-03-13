
<script lang="jsx">
    /**
     * @file static-map.vue
     * @author yuchao03(yuchao03@baidu.com)
     *
     * @since 2017
     */
    import {mixinSchema} from '../../../src/mixin';

    export default {
        mixins: [mixinSchema],
        props: {
        },
        data() {
            return {
            }
        },
        components: {

        },
        render(h){
            let enumName = null;
            try {
                enumName = this.schema.map[this.elValue];
            } catch(e){
                console.warn(e);
            }

            return <div>{enumName}</div>;
        }
    }
</script>
