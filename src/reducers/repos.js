import {
  REPOS_LIST_REFRESH,
  REPOS_LIST_LOADMORE,
  REPO_INFO,
  REPO_README,
  STARRED_REPO_REFRESH,
  STARRED_REPO_LOADMORE
} from '../constants/repos'

const INITIAL_STATE = {
  repo: {
    data: null,
    readme: null
  },
  repos: [],
  starrdRepos: [],
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
    case STARRED_REPO_REFRESH:
      return {
        ...state,
        starrdRepos: action.payload.data
      }
    case STARRED_REPO_LOADMORE:
      return {
        ...state,
        starrdRepos: state.repos.concat(action.payload.data)
      }
    case REPO_INFO:
      return {
        ...state,
        repo: {
          ...state.repo,
          data: action.payload.data
        }
      }
    case REPO_README:
      return {
        ...state,
        repo: {
          ...state.repo,
          readme: action.payload.data
        }
      }
    default:
      return state
  }
}
