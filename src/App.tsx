import { Provider } from "react-redux"
import RootNavigation from "./navigation/RootNavigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { TranslationProvider } from "./lib/TranslationContext"
import { Toaster } from "./components/ui/Toaster"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { googleClientId } from "./lib/env"

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TranslationProvider>
            <RootNavigation />
            <Toaster />
          </TranslationProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App
