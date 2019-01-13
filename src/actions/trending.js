import { bindActionCreators } from 'redux'
import {
  REPOSTRENDING,
  DEVELOPERSTRENDING
} from '../constants/trending'
import store from '../store'
import { createApiAction } from './index'
import api from '../service/api'

// 请求api
export const getReposTrendingList = createApiAction(REPOSTRENDING, params => api.get('https://github-trending-api.now.sh/repositories', params))
export const getDevelopersTrendingList = createApiAction(DEVELOPERSTRENDING, params => api.get('https://github-trending-api.now.sh/developers', params))

export default bindActionCreators({
  getReposTrendingList,
  getDevelopersTrendingList
}, store.dispatch)
