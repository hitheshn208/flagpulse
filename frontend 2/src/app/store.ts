import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice"
import uiReducer from "../features/uiSlice"
import environmentReducer from "../features/environmentSlice"
import flagReducer from "../features/flagSlice"
import userReducer from "../features/userSlice"
export const store = configureStore({
    reducer: {
        project: projectReducer,
        uiState: uiReducer,
        environment: environmentReducer,
        flag: flagReducer,
        user: userReducer
    },

})

export type RootState = ReturnType<typeof store.getState>