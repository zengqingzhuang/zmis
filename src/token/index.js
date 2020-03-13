/**
 * @file token
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2018/1/9
 */

let seed = (function (constants = window.G.constants || {}) {
    let {token = ''} = constants;

    return token;
})();


export let token = {
    value: seed,
    get key() {
        return this.value;
    },
    set key(token) {

        if (token) {
            this.value = token;
        }
    }
};
