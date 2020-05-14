import { request } from '../utils/request'

// 分页获取文章
export function getArticleByPage (currentPage = 1, pageSize = 10) {
  return request.get('/article/page/' + currentPage + '?pageSize=' + pageSize)
}
