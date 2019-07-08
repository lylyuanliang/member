/**
 * 这是常量类
 *  注：在用const定义了常量c后，需在Constants类里面用static get 定义c();
 *      如：const c="c";则在Constants中，static get c() {return c;}
 */
/**
 * json文件数据模板
 *  JSON_OB_TEMPLATE的key表示json对像的属性名，
 *  JSON_OB_TEMPLATE的值表示json对象里面每个属性的类型，
 *      空表示基本数据类型，比如字符串、数字
 *      []表示数组
 */
const JSON_OB_TEMPLATE = {
    key: "",
    name:"",
    value: "",
    children: "[]"
};
/**
 * 展示一条记录的标签的class名
 * @type {string}
 */
const CLASS_FOR_ONE_RECORD = "one-record";
/**
 * 定义常量类
 */
export default class Constants {
    /**
     * 使用get关键字获取JSON_OB_TEMPLATE常量
     * @returns {{children: string, name: string, value: string, key: string}}
     * @constructor
     */
    static get JSON_OB_TEMPLATE() {
        return JSON_OB_TEMPLATE;
    }

    /**
     * 使用get关键字获取CLASS_FOR_ONE_RECORD
     * @returns {string}
     * @constructor
     */
    static get CLASS_FOR_ONE_RECORD() {
        return CLASS_FOR_ONE_RECORD;
    }
}