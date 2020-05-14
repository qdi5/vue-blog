// 获取body部分
export function getRootFirstChild () {
  let rootFirstChild = null
  if (document.documentElement) {
    rootFirstChild = document.documentElement
  } else if (document.body) {
    rootFirstChild = document.body
  }
  return rootFirstChild
}
