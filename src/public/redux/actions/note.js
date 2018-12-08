import axios from 'axios';

const IP = 'http://192.168.0.13:3000/notes';

export const fetch = () => {
    return {
        type: "FETCH_NOTE",
        payload: axios.get(IP)
    }
}

export const addNote = (data) => {
    return {
        type: "ADD_NOTE",
        payload: axios.post(IP, data)
    }
}

export const editNote = (id, data) => {
    return {
        type: "EDIT_NOTE",
        payload: axios.put(`${IP}/${id}`, data)
    }
}

export const removeNote = (id) => {
    return {
        type: "REMOVE_NOTE",
        payload: axios.delete(`${IP}/${id}`)
    }
}

export const removeAllNotes = () => {
    return {
        type: "REMOVE_ALL_NOTES",
        payload: axios.delete(IP)
    }
}

export const toggleGrid = () => ({ type: "TOGGLE_GRID" })