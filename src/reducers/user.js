import { USERINFO } from '../constants/user'

const INITIAL_STATE = {
  userInfo: null
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload.data
      }
    default:
      return state
  }
}
