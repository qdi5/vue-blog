// 格式化日期
export function formatTime (time, formatType) {
  time = new Date(time)
  const date = {
    Y: time.getFullYear(),
    M: time.getMonth() + 1,
    D: time.getDate(),
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds()
  }
  let d = '' // 初始化接受日期变量的对象
  let r = false // 判断是否存在待替换的字符
  let reg = null // 正则
  let _d = '' // 日期
  for (d in date) { // 过滤日期标示符
    reg = new RegExp('[' + d + ']{1,}', 'g')// 判断是否有待格式化的字符
    r = reg.test(formatType)
    // 验证是否存在
    if (r) {
      _d = date[d] // 被替换的日期
      formatType = formatType.replace(reg, _d < 10 ? ('0' + _d) : _d)
    }
  }
  return formatType
}
