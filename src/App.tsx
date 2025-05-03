import { Provider } from "react-redux"
import RootNavigation from "./navigation/RootNavigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { TranslationProvider } from "./lib/TranslationContext"
import { Toaster } from "./components/ui/Toaster"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TranslationProvider>
          <RootNavigation />
          <Toaster />
        </TranslationProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
