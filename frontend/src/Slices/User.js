import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    name: "",
    email: "",
    role: "",

}


const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        setUserLogin: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        clearUser(state) { 
            state.name = "";
            state.email = "";
            state.role = "";
        }

    }
});

export const { setUserLogin,clearUser } = userSlice.actions;
export default userSlice.reducer;