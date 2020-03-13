<template>
    <div class="date-range-less" style="width:100%; min-width: 234px; overflow: hidden">
        <el-date-picker
                type="date"
                :editable="false"
                v-model="beginValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="handleInputBegin"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
                :value-format="valueFormat"
                style="width: 47%; min-width: 100px">
        </el-date-picker>
        <span class="el-range-separator" style="width: 2%; display: inline-block">-</span>
        <el-date-picker
                type="date"
                :editable="false"
                v-model="endValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="handleInputEnd"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
                :value-format="valueFormat"
                style="width: 47%; min-width: 100px">
        </el-date-picker>
    </div>
</template>

<script>
    /**
     * @file finbox/component/date/src/date-range-less.vue
     * @author yuchao03(yuchao03@baidu.com)
     * @desc
     * @since 2017
     */
    import {mixinSchema} from '../../../src/mixin';
    import _ from 'lodash';
    import Vue from 'vue';

    export default {
        mixins: [mixinSchema],
        inject: {
            elForm: {
                default: ''
            },
            elFormItem: {
                default: ''
            }
        },
        props: {
            value: {
                type: Array,
                default: []
            },
            "valueFormat": {
                type: String,
                default: "yyyy-MM-dd"
            },
            placeholder: String,
            size: String,
            resize: String,
            form: String,
            id: String,
            name: {
                default: ''
            },
            disabled: Boolean,
            type: {
                type: String,
                default: 'text'
            },

            max: {},
            min: {},
            validateEvent: {
                type: Boolean,
                default: true
            },
            suffixIcon: String,
            prefixIcon: String,
            label: String
        },
        data() {
        return {
            currentValue: this.value || ['',''],
            beginValue: (this.value || ['',''])[0],
            endValue: (this.value || ['',''])[1],
            rangeErrMessage: '最小时间不可大于最大时间' // 自定义类型 无法被form接管处理, 需自行处理

        }
    },
    methods: {
        handleInputBegin: _.debounce(function(date) {
            this.beginValue = date;
            this.setCurrentValue();
        }, 300),
        handleInputEnd: _.debounce(function(date) {
            this.endValue = date;
            this.setCurrentValue();
        }, 300),

        rangeValidate: function() {
            const slef = this;
            if(this.beginValue && this.endValue) {
             //   setTimeout(function(){
                    if(new Date(slef.beginValue).valueOf() > new Date(slef.endValue).valueOf()) {
                        slef.elFormItem.showMessage = true;
                        slef.elFormItem.validateState = 'error';
                        slef.elFormItem.validateMessage = slef.rangeErrMessage;
                    }
              //  },100);
            }
        },
        setCurrentValue() {
            if (this.validateEvent) {
                let value = [this.beginValue||'', this.endValue||''];
                this.$emit('input', value);
            }
        },

        handleChange(event) {

            this.$emit('change', this.value);
        },
        handleBlur(event) {
            if (this.elFormItem.validateState === 'error' && this.elFormItem.validateMessage === this.rangeErrMessage ) {
               // this[event.target.name] = '';
                this.setCurrentValue();
            }
            this.$emit('blur', this.value);
        },
        handleFocus(event) {
            this.$emit('focus', this.value);
        }
    },

    watch: {
        'value'(val, oldVal) {
            this.currentValue = this.value || ['',''],
                    this.beginValue =  this.currentValue[0];
            this.endValue = this.currentValue[1];
        },
        beginValue(val, oldVal) {
           // this.rangeValidate();
        },
        endValue(val, oldVal) {
          //  this.rangeValidate();
        }
    },
    created() {
        this.$emit('input', this.value);
    },
    updated() {
      const self = this;
        self.$nextTick(function () {
            self.rangeValidate();
            this.$emit('input', this.value);
        })
    }
    };
</script>

<style type="text/less">
    .date-range-less  .el-input--prefix .el-input__inner {
        padding-left: 25px;
    }

    .date-range-less .el-input--suffix .el-input__inner {
        padding-right: 10px;
    }

</style>