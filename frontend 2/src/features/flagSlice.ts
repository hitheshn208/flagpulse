import { ActualFlag } from "@/data";
import { createSlice } from "@reduxjs/toolkit";

interface FlagState {
    flagsByEnv: Record<string, ActualFlag[] | undefined>
}

const initialState : FlagState = {
    flagsByEnv: {}
}

const flagSlice = createSlice({
    name: "flags",
    initialState,
    reducers:{
        setFlags: (state, action)=>{
            state.flagsByEnv[action.payload.envId] = action.payload.flags
        }
    }
})


export default flagSlice.reducer;
export const {setFlags} = flagSlice.actions