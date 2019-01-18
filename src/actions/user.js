import { bindActionCreators } from 'redux'
import {
  USERINFO,
  DEVELOPERINFO,
  FOLLOW_REFRESH,
  FOLLOW_LOADMORE,
  FOLLOW_CHECK
} from '../constants/user'
import store from '../store'
import { createApiAction } from './index'
import api from '../service/api'

// 获取个人信息
export const getUserInfo = createApiAction(USERINFO, (params) => api.get('/user', params))

// 获取 Followers/Following 列表
export const followListRefresh = createApiAction(FOLLOW_REFRESH, params => api.get(params.url, params.data))
export const followListLoadMore = createApiAction(FOLLOW_LOADMORE, params => api.get(params.url, params.data))

// 获取开发者信息
export const getDeveloperInfo = createApiAction(DEVELOPERINFO, (params) => api.get(params.url, params.data))
export const checkFollowing = createApiAction(FOLLOW_CHECK, (params) => api.get(params.url, params.data))

export default bindActionCreators({
  getUserInfo,
  getDeveloperInfo,
  followListRefresh,
  followListLoadMore,
  checkFollowing
}, store.dispatch)
