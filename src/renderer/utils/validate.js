/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|bar|blog|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/**
 * 对比两个任意类型的变量是否相等(暂不支持Function)
 * @param {*要对比的两个变量} ab
 */
export const equarComplex = (a, b) => {
  // 判断类型
  const typeA = getObjType(a)
  const typeB = getObjType(b)
  if (typeA !== typeB) {
    return false
  } else if (typeA === 'Base') {
    console.log('base', a, b)
    return a === b
  } else if (typeA === 'Array') {
    if (a.length !== b.length) {
      console.log('array', a, b)
      return false
    } else {
      // 循环遍历数组的值进行比较
      for (let i = 0; i < a.length; i++) {
        if (!equarComplex(a[i], b[i])) {
          console.log('array', a[i], b[i])
          return false
        }
      }
      return true
    }
  } else if (typeA === 'Object') {
    if (Object.keys(a).length !== Object.keys(b).length) {
      console.log('Object', a, b)
      return false
    }
    for (var o in a) {
      if (!equarComplex(a[o], b[o])) {
        console.log('Object', a[o], b[o])
        return false
      }
    }
    return true
  } else if (typeA === 'Undefined' || typeA === 'Null') {
    return true
  } else {
    console.log('Type Error')
    return false
  }
}
/**
 * 获取变量的类型
 * @param {*要获取类型的变量} obj
 */
export const getObjType = (obj) => {
  const type = Object.prototype.toString.call(obj)
  switch (type) {
    case '[object Array]':
      return 'Array'
      break
    case '[object Object]':
      return 'Object'
      break
    case '[object Function]':
      return 'Function'
      break
    case '[object Undefined]':
      return 'Undefined'
      break
    case '[object Null]':
      return 'Null'
      break
    case '[object Number]':
    case '[object String]':
    case '[object Boolean]':
      return 'Base'
      break
    default:
      return 'Error'
      break
  }
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
