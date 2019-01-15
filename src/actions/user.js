import { bindActionCreators } from 'redux'
import {
  USERINFO
} from '../constants/user'
import store from '../store'
import { createApiAction } from './index'
import api from '../service/api'

// 请求api
export const getUserInfo = createApiAction(USERINFO, (params) => api.get('/user', params))

export default bindActionCreators({
  getUserInfo
}, store.dispatch)
