import { doPost } from './fetch'
import {
    doAlert,
    doToast,
    refreshPage,
} from './utils'

export const getPost = ({ id }) => {
    doPost('/apis/getPost', {
        id,
    }).then((data) => {
        if (data.errorCode) {
            doAlert({ text: data['errorMsg' + l] })
            return
        }
    })
}
