import { GET_ALL_POST } from "../constants/constants"
const initialState = {
    postsCount: 0
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_POST:
            return { ...state, postsCount: action.payload }
        default:
            return state
    }
}

export default profileReducer
