import { bindActionCreators } from 'redux'
import {
  REPOSTRENDING,
  DEVELOPERSTRENDING,
  LANGUAGE
} from '../constants/trending'
import store from '../store'
import { createApiAction } from './index'
import api from '../service/api'

// 请求api
export const getReposTrendingList = createApiAction(REPOSTRENDING, params => api.get('https://gitter-weapp.herokuapp.com/repositories', params))
export const getDevelopersTrendingList = createApiAction(DEVELOPERSTRENDING, params => api.get('https://gitter-weapp.herokuapp.com/developers', params))
export const getLanguageList = createApiAction(LANGUAGE, params => api.get('https://gitter-weapp.herokuapp.com/languages', params))

export default bindActionCreators({
  getReposTrendingList,
  getDevelopersTrendingList,
  getLanguageList
}, store.dispatch)
