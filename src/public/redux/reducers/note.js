import { FETCH_NOTE_FULFILLED, FETCH_NOTE_PENDING, FETCH_NOTE_REJECTED,
        ADD_NOTE_FULFILLED, ADD_NOTE_PENDING, ADD_NOTE_REJECTED,
        EDIT_NOTE_FULFILLED, EDIT_NOTE_PENDING, EDIT_NOTE_REJECTED,
        REMOVE_NOTE_PENDING, REMOVE_NOTE_REJECTED, REMOVE_NOTE_FULFILLED, TOGGLE_GRID } from '../../../constants/actionTypes';

const initialState = {
    notes: [],
    isLoading: false,
    isFinish: false,
    isError: false,
    isGrid: false
}

export default notesReducer = (state = initialState, action) => {
    switch (action.type) {
        /// FETCH NOTE ------------------
        case FETCH_NOTE_PENDING:
        return {
            ...state,
            isLoading: true
        }
        case FETCH_NOTE_FULFILLED: 
        return {
            ...state,
            isLoading: false,
            isFinish: true,
            notes: action.payload.data
        }
        case FETCH_NOTE_REJECTED:
        return {
            ...state,
            isLoading: false,
            isError: true
        }

        /// ADD NOTE ------------------
        case ADD_NOTE_PENDING:
        return {
            ...state,
            isLoading: true
        }
        case ADD_NOTE_FULFILLED:
        return {
            ...state,
            isLoading: false,
            isFinish: true,
            notes: [...state.notes, action.payload.data]
        }
        case ADD_NOTE_REJECTED:
        return {
            ...state,
            isLoading: false,
            isError: true
        }

        /// EDIT NOTE ------------------
        case EDIT_NOTE_PENDING:
        return {
            ...state,
            isLoading: true
        }
        case EDIT_NOTE_FULFILLED:
        return {
            ...state,
            isLoading: false,
            isFinish: true,
            notes: state.notes.map(note => 
                (note.id == action.payload.data.id) ? 
                    action.payload.data : note
            )
        }
        case EDIT_NOTE_REJECTED:
        return {
            ...state,
            isLoading: false,
            isError:true
        }

        /// REMOVE NOTE ------------------
        case REMOVE_NOTE_PENDING:
        return {
            ...state,
            isLoading: true
        }
        case REMOVE_NOTE_FULFILLED:
        return {
            ...state,
            isLoading: false,
            isFinish: true,
            notes: state.notes.filter(note => note.id !== action.payload.data.id)
        }
        case REMOVE_NOTE_REJECTED:
        return {
            ...state,
            isLoading: false,
            isError: true
        }

        case TOGGLE_GRID:
            return {
                ...state,
                notes: [...state.notes],
                isGrid: !state.isGrid
            }

        default:
            return state;
    }
}