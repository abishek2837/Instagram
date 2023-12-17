import { GET_ADD_POST_IMAGE } from "../constants/constants";

const initialState = {
    AddPostImage: undefined,
    galleryIMages: []
}
const addPostReducer = (state=initialState, action) => {
    switch(action.type){
        case GET_ADD_POST_IMAGE:
            return {...state,AddPostImage: action.payload}
        default:
            return state
    }
}

export default addPostReducer;