/**
 * @file eventHub.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc 事件中心
 * @since 2017/09/14
 */
import Vue from 'vue';
export default {
    props: {
        eventHubName:{
            type: String,
            default: 'default'
        },
        // 指定的处理函数
        eventHubHandleName: {
            type: String
        }
    },
    data() {
        return {
            eventHub$: new Vue().GLOBAL.eventHub
        };
    },
    methods: {
        triggerSomeEvent(event) {
            const eventHandler = this.$options.__proto__.eventHub.handlers[event.type];
            eventHandler && eventHandler.call(this, event);
        }
    },
    created() {
        if (this.$options.__proto__.eventHub instanceof Object) {
            // 从各组件注册的事件中心中获取事件中心名称
            const name = this.$options.__proto__.eventHub.name;
            const triggerEventName = 'triggerSomeEvent' + name;
            // 防止多次注册
            if(!Object.keys(this.eventHub$.$events._events).includes(triggerEventName)) {
                this.eventHub$.$events.$on(triggerEventName, this.triggerSomeEvent);
            }
        }
    },
    beforeDestroy: function () {
        if (this.$options.__proto__.eventHub instanceof Object) {
            const name = this.$options.__proto__.eventHub.name;
            const triggerEventName = 'triggerSomeEvent' + name;
            delete this.eventHub$.$events._events[triggerEventName];
            this.eventHub$.$events.$off('triggerSomeEvent' + name, this.triggerSomeEvent);
        }
    }
};
