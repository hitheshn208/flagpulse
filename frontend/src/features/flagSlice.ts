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

        setEditValue: (state, action)=>{
            const flags = state.flagsByEnv[action.payload.envId]
            const flag = flags?.find(flag => flag.id === action.payload.flagId);
            if (flag) {
                Object.assign(flag, action.payload.data);
            }
            console.log(action.payload.envId, action.payload.flagId, action.payload.data, flag);
        },
        
        setCurrentFlag: (state, action)=>{
            state.selectedFlag = action.payload
        },

        addNewFlag: (state, action)=>{
            action.payload.envIds.forEach((envId: {environment_id :string}) => {
                if(state.flagsByEnv[envId.environment_id] && envId.environment_id)
                    state.flagsByEnv[envId.environment_id]?.push({
                        id: action.payload.flag_id,
                        name: action.payload.data.name,
                        key: action.payload.data.key,
                        type: action.payload.data.type,
                        description: action.payload.data.description,
                        environment_id: envId.environment_id,
                        is_enabled: false,
                        default_value: action.payload.data.default_value,
                        rollout_percentage: null,
                        targeting_attribute: null,
                        targeting_value: null,
                        targeting_return_value: action.payload.data.default_value,
                        updated_at: String(new Date().toISOString()),
                        created_at: String(new Date().toISOString())})
            });
        },

        removeFlag: (state, action)=>{
            action.payload.envIds.filter((env: {environment_id : string})=>{
                state.flagsByEnv[env.environment_id] = state.flagsByEnv[env.environment_id]?.filter(flag=> flag.id !== action.payload.flagId)
            })
        }
    }
})


export default flagSlice.reducer;
export const {setFlags, setToggleValue, setCurrentFlag, addNewFlag, removeFlag, setEditValue} = flagSlice.actions