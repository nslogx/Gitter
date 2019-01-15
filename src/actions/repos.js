import { bindActionCreators } from 'redux'
import {
  REPOS_LIST_REFRESH,
  REPOS_LIST_LOADMORE
} from '../constants/repos'
import store from '../store'
import { createApiAction } from './index'
import api from '../service/api'

// 请求api
export const reposListRefresh = createApiAction(REPOS_LIST_REFRESH, (url, params) => api.get(url, params))
export const reposListLoadMore = createApiAction(REPOS_LIST_LOADMORE, (url, params) => api.get(url, params))

export default bindActionCreators({
  reposListRefresh,
  reposListLoadMore
}, store.dispatch)
