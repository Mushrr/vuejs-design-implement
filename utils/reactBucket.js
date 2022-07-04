// 响应式系统数据结构
/**
 * reactive({})
 * // 传递一个{}对象，支持对对象数据修改，并触发更新
 * 递归调用，如果某个属性的值是对象，就需要将其转化为响应式
 */


function reactive(obj) {
    let data = new Proxy(obj, {
        // 处理函数
        get(target, handler) {
             
    })
}
