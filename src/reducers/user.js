import {
  USERINFO,
  DEVELOPERINFO,
  FOLLOW_REFRESH,
  FOLLOW_LOADMORE,
  FOLLOW_CHECK
} from '../constants/user'

const INITIAL_STATE = {
  userInfo: null,
  developerInfo: null,
  followList: [],
  isFollowed: false
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload.data
      }
    case DEVELOPERINFO:
      return {
        ...state,
        developerInfo: action.payload.data
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
    case FOLLOW_CHECK:
      return {
        ...state,
        isFollowed: action.payload.statusCode === 204
      }
    default:
      return state
  }
}
