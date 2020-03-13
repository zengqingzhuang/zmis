/**
 * @file eventHub.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @desc 注册事件中心
 * @since 2017/11/1
 */

export default {
    install(vue) {

        // 注册到vue原型
        const vue$$ = vue.prototype;
        vue$$.GLOBAL = vue$$.GLOBAL || {};

        // 注册事件中心
        vue$$.GLOBAL.eventHub = vue$$.GLOBAL.eventHub || {
            $eventEl: document.createElement('p'),
            $events: new vue(),
            $dispatch: (pVm, handleFun) => {
                const eventHubName = pVm.eventHubName;
                if (eventHubName === undefined || typeof eventHubName !== 'string') {
                    throw 'the "eventHubName" must be defined and String type!';
                }
                const handleName = pVm.eventHubHandleName;
                const eventEl = vue$$.GLOBAL.eventHub.$eventEl;
                const events = vue$$.GLOBAL.eventHub.$events;
                if (handleName === undefined || typeof handleName !== 'string') {
                    throw 'the "eventHubHandleName" must be defined and  String type!';
                }
                // if (handleFun === undefined || typeof handleFun !== 'function') {
                //     throw 'the "handleFun" must be defined and Function type!';
                // }
                let event = new Event(handleName);
                // 调用者
                event.$target = pVm;
                // 事件调用参数
                event.argument = {};
                handleFun && eventEl.addEventListener(handleName, handleFun);
                events.$emit('triggerSomeEvent' + eventHubName, event);
                handleFun && eventEl.removeEventListener(handleName, handleFun);
            }
        };
    }
};
