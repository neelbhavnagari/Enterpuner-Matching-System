// Global state management store placeholder (e.g. Redux / Zustand / React Context)
export const initialState = {
  user: null,
  matches: [],
  activeChat: null,
  language: 'en',
};

export function storeReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}
