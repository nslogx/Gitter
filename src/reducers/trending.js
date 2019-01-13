import {
  REPOSTRENDING,
  DEVELOPERSTRENDING
} from '../constants/trending'

const INITIAL_STATE = {
  repos: [],
  developers: []
}

export default function trending (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REPOSTRENDING:
      return {
        ...state,
        repos: action.payload.data
      }
    case DEVELOPERSTRENDING:
      return {
        ...state,
        developers: action.payload.data
      }
    default:
      return state
  }
}
