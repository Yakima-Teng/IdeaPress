import { promiseQuery } from '../../scripts/sql'

export const getCategoryList = async () => {
    const list = (await promiseQuery(
        'SELECT t.*, tt.* ' +
        'FROM wp_terms AS t ' +
        'INNER JOIN wp_term_taxonomy AS tt ON t.term_id = tt.term_id ' +
        'WHERE tt.taxonomy IN (\'category\') ' +
        'ORDER BY t.name ASC;'
    )).map((item) => ({ ...item }))

    const categoryList = (() => {
        const objRoots = {}
        const traverseNode = (node, item) => { // 遍历节点
            if (!node) { return false }
            if (node.term_id === item.parent) {
                if (!node.next) { node.next = {} }
                node.next[`t${item.term_id}`] = item
                return true // 表示成功找到父元素并将item挂载到父元素上
            }
            if (!node.next) { return false }
            const keys = Object.keys(node.next)
            for (let i = 0, len = keys.length; i < len; i++) {
                if (traverseNode(node.next[keys[i]], item)) {
                    return true
                }
            }
            return false
        }
        let count = 0
        while (list.length > 0) {
            for (let i = list.length - 1; i >= 0; i--) {
                count++
                if (count > 1000) {
                    throw new Error('Too many times')
                }
                const item = list[i]
                const parent = item.parent
                const term_id = item.term_id
                if (item.traverseCounter === void 0) {
                    item.traverseCounter = 0
                }
                item.traverseCounter++
                if (parent === 0) {
                    objRoots[`t${term_id}`] = item
                    list.splice(i, 1)
                } else if (item.traverseCounter > 100) { // 如果一个节点被遍历了100次还没找到父节点，就认为是原始数据有问题，直接将其作为根节点之一绑到objRoots上
                    objRoots[`t${term_id}`] = item
                    list.splice(i, 1)
                } else if (Object.keys(objRoots).filter((key) => traverseNode(objRoots[key], item)).length > 0) {
                    list.splice(i, 1)
                }
            }
        }
        const visitNode = (node) => {
            delete node.traverseCounter
            if (!node.next) {
                node.childs = []
                delete node.next
                return node
            }
            const childs = Object.keys(node.next).map((key) => node.next[key])
            delete node.next
            node.childs = childs.map((child) => visitNode(child))
            return node
        }
        return Object.keys(objRoots).map((key) => visitNode(objRoots[key]))
    })()

    return categoryList
}
