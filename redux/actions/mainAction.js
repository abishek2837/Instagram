import { GET_ADD_POST_IMAGE, GET_GALLERY_IMAGE, GET_ALL_POST } from "../constants/constants"
export const getAddPostImage = (data) => {
    return {
        type: GET_ADD_POST_IMAGE,
        payload: data
    }
}

export const getProfileDetails = (data) => {
    return {
        type: GET_ALL_POST,
        payload: data
    }
}
