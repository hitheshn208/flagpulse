import { ActualEnvironment } from "@/data";
import { createSlice } from "@reduxjs/toolkit";

interface EnvironmentState {
    environments: ActualEnvironment[]
    currentEnv: ActualEnvironment | undefined
}

const initialState : EnvironmentState = {
    environments: [],
    currentEnv: undefined
}

const environmentSlice = createSlice({
    name: "environments",
    initialState,
    reducers: {
        setEnvironments: (state, action)=>{
            state.environments = action.payload
            state.currentEnv = action.payload[0]
        },
        setCurrentEnv: (state, action)=>{
            state.currentEnv = action.payload
        }
    }
})

export default environmentSlice.reducer;
export const {setEnvironments, setCurrentEnv} = environmentSlice.actions;