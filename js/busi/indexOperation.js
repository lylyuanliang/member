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
        //key 开头
        this.keyStart = "*";
        //key 子节点
        this.key4Children = "children";
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
            let result = this.getSaveDataFromPage(".file-content");
            console.log(result);
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
        //结果数组
        let resultArray = [];
        //循环遍历所有的li
        $.each(lis, (index, li) => {
            //创建resultArray
            this.createObj4ParentArray($(li), resultArray);
        });
        return resultArray;
    }

    /**
     * 创建resultArray
     * @param $li li元素
     * @param resultArray 目标resultArray数组
     */
    createObj4ParentArray($li, resultArray) {
        let key = $li.attr("key");
        let keyArray = key.split("|");
        console.log(keyArray);
        //当前对象在resultArray中的位置
        let currObj = null;
        //先循环创建数组key对应的对象
        $.each(keyArray, (index, keyName) => {
            //特别说明：在本循环中，keyName的取值为*、数字、和children，
            //      *表示为顶层数组
            //      数字表示为顶层数组或子节点素组中对应的元素
            //      children表示为子节点数组
            //      例如：*|0 为resultArray[0]
            if(this.keyStart == keyName) {
                //表示为顶层
                currObj = resultArray;
            }else if(!currObj[keyName]) {
                if(keyName == this.key4Children) {
                //创建对象节点，children为数组
                    currObj[keyName] = new Array();
                }else {
                    //创建对象节点，非children为对象，即数组中的元素
                    currObj[keyName] = new Object();
                }
                //currObj指向修改为currObj[keyName]，进行下一次循环
                currObj = currObj[keyName];
            }else {
                //currObj指向修改为currObj[keyName]，进行下一次循环
                currObj = currObj[keyName];
            }
        });
        //给resultArray赋值
        this.setValue4ParentArray($li, currObj);
    }

    /**
     * 给resultArray赋值
     * @param $li
     * @param currObj 当前指针指向的对象
     */
    setValue4ParentArray($li, currObj) {
        let spans = $li.find("span");
        //循环遍历spans
        $.each(spans, function (index, span) {
            let $span = $(span);
            let key = $span.attr("key");
            let value = $span.html();
            currObj[key] = value;
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
            success (data){
                let parent = $("#main-content");
                _this.buildView(parent, data, _this.keyStart);
            }
        });
    }

    /**
     * 展示数据
     *      采用递归实现
     * @param parentNode 父级节点
     * @param dataArray 数据数组
     * @param pre 主要是属性在json数组中位置的一个记录
     *              例如：[{a:"0"}]，那么0的pre值就为0|a
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
            pre += `|${index}`;
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
                this.buildView(li, children, `${pre}|${this.key4Children}`);
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
