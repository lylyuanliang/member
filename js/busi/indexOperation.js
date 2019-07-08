/**
 * 操作js
 * @author liurl
 *
 */
import Common from "../public/common.js";
import {saveAs as fileSave} from "../static/fileSave.js";
import Constants from "../public/constants.js";
export default class IndexOperation {
    /**
     * 构造函数
     */
    constructor() {
        //定义属性，父级元素
        this.parentElementStr = "<ul></ul>";
        //子元素
        this.childrenElementStr = `<li class="${Constants.CLASS_FOR_ONE_RECORD}"></li>`;
    }

    /**
     * 初始化函数
     */
    init() {
        //读取文件并初始化页面
        this.readFile("json/file.json");
        //初始化点击事件绑定
        this.bindClick4OperationButton();
    }

    /**
     * 给按钮绑定点击事件
     */
    bindClick4OperationButton() {
        Common.bindEvent4Element("click", $(".operation-button"), () => {
            this.getSaveDataFromPage(".file-content");
        });
    }

    /**
     * 获取页面数据
     * @param contentRootElement 内容根元素
     */
    getSaveDataFromPage(contentRootElement) {
        //获取所有的class=`"${Constants.CLASS_FOR_ONE_RECORD}"`的元素
        let lis = $(`${contentRootElement} .${Constants.CLASS_FOR_ONE_RECORD}`);
        if(!lis || lis.length <= 0) {
            Common.showMessage("你确定有数据？？");
            return null;
        }
        //循环遍历所有的li
        $.each(lis, function (index, li) {
            let key = li.attr("key");

        });
    }

    /**
     * 文件路径
     * @param url 文件路径
     */
    readFile(url) {
        let _this = this;
        Common.$ajax({
            url: url,
            success(data) {
                let parent = $("#main-content");
                _this.buildView(parent, data, "*");
            }
        });
    }

    /**
     * 展示数据
     *      采用递归实现
     * @param parentNode 父级节点
     * @param dataArray 数据数组
     * @param pre 主要是属性在json数组中位置的一个记录
     *              例如：[{a:"0"}]，那么0的pre值就为[0]|{a}
     */
    buildView(parentNode, dataArray, pre) {
        //pre的初始值
        let preOld = pre;
        //创建ul标签
        let ul = Common.createJQElement(this.parentElementStr);
        $.each(dataArray, (index, obj) => {
            //每次循环开始时都重新给pre赋值为初始值
            pre = preOld;
            //创建li
            let li = Common.createJQElement(this.childrenElementStr);
            //为li添加属性
            pre += `|[${index}]`;
            li.attr("key", pre);
            let name = obj.name;
            let value = obj.value;
            let children = obj.children;
            let nameSpan =this.createElement4Content("key", `name`, name);
            let valueSpan =this.createElement4Content("key", `value`, value);
            li.append(nameSpan)
                .append(":")
                .append(valueSpan);
            ul.append(li);
            //判断是否还有子节点
            if(children.length > 0) {
                //递归遍历子节点
                this.buildView(li, children, `${pre}|children`);
            }
        });
        parentNode.append(ul);
    }

    /**
     * 创建内容标签节点
     * @param attrName 属性名
     * @param attrValue 属性值
     * @param content 内容
     * @returns {undefined|null|*|jQuery}
     */
    createElement4Content(attrName, attrValue, content) {
        let span = Common.createJQElement("<span></span>").attr(attrName, attrValue);
        span.append(content);
        return span;
    }

    /**
     * 文件保存
     * @param data
     */
    saveFile(data) {
        let blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
        fileSave.saveAs(blob, "文件导出测试.txt");
    }
}
