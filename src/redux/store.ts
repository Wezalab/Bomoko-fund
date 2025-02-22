import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist';
import projectReducer from './slices/projectSlice'
import userReducer from './slices/userSlice'
import splitApi from './services/api';

// import { encryptTransform } from 'redux-persist-transform-encrypt';
// import { thunk } from 'redux-thunk';

// const encryptor = encryptTransform({
//   secretKey: `${process.env.ENCRYPT_PERSIT_KEY}`,
//   onError: function (error:any) {
//     // Handle the error.
//     console.log("encryped persist data errror->",error)
//   },
// });


const persistConfig = {
  key: 'root', // key for the persisted data in localStorage
  storage,     // storage mechanism, here it's localStorage
  
};

// Combine your reducers
const reducers = combineReducers({
    projectReducer,
    userReducer,
    [splitApi.reducerPath]:splitApi.reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(splitApi.middleware),
  
})

export const persistor = persistStore(store);

// import {setupSSE} from './sse'
// setupSSE(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
