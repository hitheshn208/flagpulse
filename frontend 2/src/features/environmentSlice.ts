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
        },
        addEnvironment: (state, action)=>{
            state.environments.push(action.payload.environment);
        },
        removeEnvironment: (state, action)=>{
            if(state.currentEnv?.id === action.payload.id)
                state.currentEnv = undefined;
            state.environments = state.environments.filter(env=>env.id !== action.payload.id)
        },
        changeEnvironmentKey: (state, action)=>{
            const environment = state.environments.find(env => env.id === action.payload.id);
            if(environment)
                environment.sdk_key = action.payload.sdk_key;
        }
    }
})

export default environmentSlice.reducer;
export const {setEnvironments, setCurrentEnv, addEnvironment, removeEnvironment, changeEnvironmentKey} = environmentSlice.actions;