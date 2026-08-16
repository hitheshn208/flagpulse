import { ActualFlag } from "@/data";
import { createSlice } from "@reduxjs/toolkit";

interface FlagState {
    flagsByEnv: Record<string, ActualFlag[] | undefined>
    selectedFlag : ActualFlag | null
}

const initialState : FlagState = {
    flagsByEnv: {},
    selectedFlag: null
}

const flagSlice = createSlice({
    name: "flags",
    initialState,
    reducers:{
        setFlags: (state, action)=>{
            state.flagsByEnv[action.payload.envId] = action.payload.flags
        },

        setToggleValue: (state, action)=>{
            const flags = state.flagsByEnv[action.payload.envId]
            const flag = flags?.find(flag => flag.id === action.payload.flagId)
            if(flag)
                flag.is_enabled = action.payload.value
            console.log(action.payload.envId, action.payload.flagId, action.payload.value, flag);
        },
        
        setCurrentFlag: (state, action)=>{
            state.selectedFlag = action.payload
        }
    }
})


export default flagSlice.reducer;
export const {setFlags, setToggleValue, setCurrentFlag} = flagSlice.actions