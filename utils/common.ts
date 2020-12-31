export const spacingUnit = 8

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const flattenParams = (obj, accObj = {}) => {
  if (!obj) return null
  for (let key in obj) {
    if (key === 'params') {
      flattenParams(obj.params, accObj)
    } else {
      accObj[key] = obj[key]
    }
  }
  return accObj
}
