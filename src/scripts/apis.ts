import { doPost } from './fetch'
import {
    doAlert,
} from './utils'

export const getPost = ({ id }) => {
    doPost('/apis/getPost', {
        id,
    }).then((data) => {
        if (data.errorCode) {
            doAlert({ text: data.errorMsg })
            return
        }
    })
}
