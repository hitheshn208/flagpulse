import { createSlice } from "@reduxjs/toolkit";

type Page = 'projects' | 'flags' | 'environments' | 'settings' | 'audit' | 'create-flag'

interface UiSlice {
    page: Page
}

const initialState : UiSlice = {
    page: 'projects'
} 

export const uiSlice = createSlice({
    name: "uUIState",
    initialState,
    reducers: {
        setPage: (state, action)=>{
            state.page = action.payload
        }
    }
})

export default uiSlice.reducer;
export const {setPage} = uiSlice.actions