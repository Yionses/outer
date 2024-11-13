import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Home from "@/pages/Home"
import Query from "./pages/Query"
import ErrorPage from "./pages/Error"
import { UserStatusProvider } from "./Contexts/UserStatus"
import Limit from "./pages/Limit"
import Indexer from "./pages/Index/indexer"
import Outer from "./pages/Outer"
import Insert from "./pages/Insert"
import YearQuery from "./pages/YearQuery"
export default function App() {
  return (
    <UserStatusProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route
            path="home"
            element={
              <Limit>
                <Home />
              </Limit>
            }
          >
            <Route
              index
              path="index"
              element={
                <Limit>
                  <Indexer />
                </Limit>
              }
            />
            <Route
              path="query"
              element={
                <Limit>
                  <Query />
                </Limit>
              }
            />
            <Route
              path="yearQuery"
              element={
                <Limit>
                  <YearQuery />
                </Limit>
              }
            />
            <Route
              path="outer"
              element={
                <Limit>
                  <Outer />
                </Limit>
              }
            />
            <Route
              path="insert"
              element={
                <Limit>
                  <Insert />
                </Limit>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserStatusProvider>
  )
}
