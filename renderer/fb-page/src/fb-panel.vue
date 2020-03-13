<template>
    <div class="panel panel-default">
        <div v-if="title" class="panel-heading">
            {{title}}
        </div>
        <div class="panel-body">
           <slot></slot>
        </div>
    </div>
</template>
<script>
    /**
     * @file panel.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 容器组件
     * @since 2018/02/01
     */
    export default {
        props: {
            title: {
                type: String
            }
        },
        data() {
            return {
            }
        }
    }
</script>

<style type="text/less" lang="less">
    .panel {
        margin-bottom: 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
        box-shadow: 0 1px 1px rgba(0,0,0,.05);
        .panel-heading {
            background-color: #f5f5f5;
            border-color: #ddd;
            padding: 10px 15px;
            border-bottom: 1px solid #ddd;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }
    }
    .panel-body {
        padding: 15px;
    }
</style>