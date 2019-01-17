import {
  USERINFO,
  FOLLOW_REFRESH,
  FOLLOW_LOADMORE
} from '../constants/user'

const INITIAL_STATE = {
  userInfo: null,
  followList: []
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload.data
      }
    case FOLLOW_REFRESH:
      return {
        ...state,
        followList: action.payload.data
      }
    case FOLLOW_LOADMORE:
      return {
        ...state,
        followList: state.followList.concat(action.payload.data)
      }
    default:
      return state
  }
}
