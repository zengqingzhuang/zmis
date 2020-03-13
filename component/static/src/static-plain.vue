<template>
    <div class="static-plain" v-html="text">
    </div>
</template>

<script>
    /**
     * @file  static-plain.vue
     * @author yuchao03(yuchao03@baidu.com)
     *
     * @since 2017/09/26
     */
    import {mixinSchema} from '../../../src/mixin';
    import {htmlEncode} from '../../../src/encoding/html';
    export default{
        mixins: [mixinSchema],
        computed: {
            text: function() {
                if(this.elValue != null) {
                    return htmlEncode(this.elValue + '')
                } else if(this.schema.text !== undefined && this.schema.text !== null ){
                    return htmlEncode(this.schema.text + '')
                }
                return  '';
            }
        }
    }

</script>

<style type="text/less">
    .static-plain{

    }
</style>
