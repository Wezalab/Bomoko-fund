import { Provider } from "react-redux"
import RootNavigation from "./navigation/RootNavigation"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { TranslationProvider } from "./lib/TranslationContext"
import { Toaster } from "./components/ui/Toaster"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { googleClientId } from "./lib/env"

if (!googleClientId) {
  console.error(
    '[Bomoko] VITE_GOOGLE_CLIENT_ID is not set. ' +
    'Google Sign-In will fail. Add it to your deployment platform environment variables and redeploy.'
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId ?? ''}>

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
