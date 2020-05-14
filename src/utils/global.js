// 倒数3秒
export function countDown (second = { number: 3 }, cb) {
  const index = setInterval(() => {
    second.number--
    if (second.number === 0) {
      cb && cb()
      clearInterval(index)
    }
  }, 1000)
}
