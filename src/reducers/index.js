import { combineReducers } from 'redux'
import user from './user'
import trending from './trending'

export default combineReducers({
  user,
  trending
})
