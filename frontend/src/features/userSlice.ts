import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    name: string | null
    email: string | null
}

const initialState: UserState = {
    name: null,
    email : null
}

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        initialiseUser: (state, action)=>{
            state.name = action.payload.name;
            state.email = action.payload.email
        }
    }
})

export const {initialiseUser} = userSlice.actions;
export default userSlice.reducer;