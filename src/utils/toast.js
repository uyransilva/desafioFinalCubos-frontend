import { toast } from 'react-toastify'

export const toastError = (message) => {
    toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        theme: 'colored',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
    })
}


export const toastSucess = (message) => {
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        theme: 'colored',
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false
    })
}
