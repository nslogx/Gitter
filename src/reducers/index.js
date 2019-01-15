import { combineReducers } from 'redux'
import user from './user'
import trending from './trending'
import repos from './repos'

export default combineReducers({
  user,
  trending,
  repos
})
