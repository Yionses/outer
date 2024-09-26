import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.less"
import { QueryClient, QueryClientProvider } from "react-query"
import Query from "./pages/Query/index.tsx"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
