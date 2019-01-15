import {
  REPOS_LIST_REFRESH,
  REPOS_LIST_LOADMORE
} from '../constants/repos'

const INITIAL_STATE = {
  repos: []
}

export default function repos (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REPOS_LIST_REFRESH:
      return {
        ...state,
        repos: action.payload.data
      }
    case REPOS_LIST_LOADMORE:
      return {
        ...state,
        repos: state.repos.concat(action.payload.data)
      }
    default:
      return state
  }
}
