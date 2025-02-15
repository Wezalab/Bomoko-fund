
import { Provider } from "react-redux"
import RootNavigation from "./navigation/RootNavigation"
import {Toaster} from 'react-hot-toast'
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigation />
        <Toaster />
      </PersistGate>
    </Provider>
  )
}

export default App
