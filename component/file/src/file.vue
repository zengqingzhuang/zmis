<template>
    <div class="fb-upload-file">
        <div v-if="!disabled||false">
            <el-upload
                       class="fb-el-upload-file"
                       :file-list="modelArry"
                       name="image"
                       :data="uploadExtraData"
                       :action="vNodes.reciever ? vNodes.reciever : '/access/imageupload'"
                       :accept="vNodes.accept ? vNodes.accept : 'text/plain'"
                       :multiple="vNodes.multiple === false ? vNodes.multiple : true"
                       :auto-upload="vNodes.autoUpload === false ? vNodes.autoUpload : true"
                       :before-upload="beforeUpload"
                       :on-success="uploadSuccess"
                       :on-error="uploadFail"
                       :on-remove="removeItem"
                       ref="upload">
                <el-button size="middle" type="primary">请选择文件</el-button>
            </el-upload>
            <div>
                <ul class="el-upload-list el-upload-list--picture">
                    <li v-for="(item, index) in imageList" class="el-upload-list__item is-success">
                        <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
                        <a class="el-upload-list__item-name">
                            <i class="el-icon-document"></i>
                            {{item.filename}}
                        </a>
                        <label class="el-upload-list__item-status-label">
                            <i class="el-icon-upload-success el-icon-check"></i>
                        </label>
                        <i class="el-icon-close" @click="removeImage(index)"></i>
                    </li>

                </ul>
            </div>
        </div>
        <div v-else>
            <span v-if="!value || value.length === 0">
                    暂无
            </span>
            <div v-else>
                <ul class="el-upload-list el-upload-list--text">
                    <li v-for="item in modelArry" class="el-upload-list__item is-ready">
                        <a v-if="supportDownload" class="el-upload-list__item-name" :href="item.url" download>
                            <i class="el-icon-document"></i>
                            {{item.name}}
                        </a>
                        <span v-else class="el-upload-list__item-name">
                            <i class="el-icon-document"></i>
                            {{item.name}}
                        </span>
                    </li>
                </ul>
                <ul class="el-upload-list el-upload-list--picture">
                    <li v-for="(item, index) in imageList" class="el-upload-list__item is-success">
                        <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
                        <a v-if="supportDownload" class="el-upload-list__item-name" :href="item.url" download>
                            <i class="el-icon-document"></i>
                            {{item.filename}}
                        </a>
                        <span v-else class="el-upload-list__item-name">
                            <i class="el-icon-document"></i>
                            {{item.name}}
                        </span>
                    </li>

                </ul>
            </div>
            
        </div>
        <div class="el-upload-tip">
            <div>{{ vNodes.desc }}</div>
        </div>
    </div>
</template>

<script>
    /**
     * @file  file
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     *
     * @since 2017/10/20
     */
    import {mixinSchema} from '../../../src/mixin';


    export default {
        mixins: [mixinSchema],
        data() {
            return {
                activeName: 'file',
                fileList: [],
                imageList: [],
                supportDownload: this.schema.supportDownload === false ? this.schema.supportDownload : true,
                modelArry: this.value && Array.isArray(this.value) ? this.value : [],
                vNodes: this.schema,
                uploadExtraData: {
                    category: 'image'
                }
            }
        },
        components: {

        },
        methods: {
            // 自定义删除图片事件
            removeImage(index) {
                this.removeFileValue(this.imageList[index].filename);
                this.imageList.splice(index, 1);
            },
            // 判断该文件是否为图片
            isImage(filename){
                const reg = /\.(png|jpeg|jpg|gif)$/;
                return reg.test(filename);
            },
            // 当上传文件的时候出发
            beforeUpload(file) {
                if (this.vNodes.maxSize) {
                    if (file.size - this.vNodes.maxSize >= 0) {
                        this.$message.error('您传入的文件过大，请重新上传');
                        return false;
                    }
                }
                if (this.vNodes.maxLength && (this.fileList.length + this.imageList.length)- this.vNodes.maxLength > 0) {
                    this.$message.error('超出上传文件数量限制');
                    return false;
                }
            },
            // 上传成功事件
            uploadSuccess(res, file, fileList) {
                if (this.isImage(file.name)){
                    let index = fileList.indexOf(file);
                    if (index > -1) {
                        fileList.splice(index, 1);
                        this.imageList.push(res.retdata);
                    }
                }
                this.updateFileValue(res.retdata);
            },
            // 更新组件value
            updateFileValue(file) {
                this.fileList.push(file);
                this.model[this.schema.name] = this.fileList;
            },
            // 删除条目事件
            removeItem(file, fileList){
                this.removeFileValue(file.name);
            },
            removeFileValue(filename){
                for(let i = 0; i< this.fileList.length; i++) {
                    let item = this.fileList[i];
                    if(item.filename === filename) {
                        this.fileList.splice(i,1);
                        if (this.fileList.length === 0) {
                            this.model[this.schema.name] = null;
                        } else {
                            this.model[this.schema.name] = this.fileList;
                        }
                        return;
                    }
                }
            },
            // 上传失败事件
            uploadFail(err, file, fileList){
                this.$message.error('上传失败，请重新上传');
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (this.value && Array.isArray(this.value)) {
                    this.modelArry = [];
                    this.imageList = [];
                    this.value.forEach(item => {
                        if(this.isImage(item.filename)){
                            this.imageList.push(item);
                        } else {
                            this.modelArry.push({
                                name: item.filename,
                                url: item.url
                            });
                        }
                        if(!this.disabled) {
                            this.fileList = this.value;
                            this.model[this.schema.name] = this.fileList;
                        }
                    })
                }
            })
        }

    }
</script>

<style lang="less">
    .fb-upload-file {
        .fb-el-upload-file {
            .el-button--primary {
                background-color: #23b7e5;
                border-color: #23b7e5;
                color: #fff;
            }
            .el-upload {
                text-align: left;
            }
            .el-button {
                border-radius: 2px;
            }



        }
        .el-upload-tip {
            margin-top: 5px;
            margin-bottom: 10px;
            color: #737373;
            div {
                font-size: 14px;
                line-height: 1.6;
                word-wrap: break-word;
            }
        }
        .el-upload-list__item {
            a {
                text-decoration: none;
            }
        }
    }
</style>
