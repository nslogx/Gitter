import {
  REPOSTRENDING,
  DEVELOPERSTRENDING,
  LANGUAGE
} from '../constants/trending'

const INITIAL_STATE = {
  repos: [],
  developers: [],
  languages: {},
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
    case LANGUAGE:
      return {
        ...state,
        languages: action.payload.data
      }
    default:
      return state
  }
}
