import { Navigate, Route, Routes } from "react-router"
import Navbar from "./components/Navbar"
import HomePage from "./Pages/HomePage"
import ProductPage from "./Pages/ProductPage"
import ProfilePage from "./Pages/ProfilePage"
import CreatePage from "./Pages/CreatePage"
import EditProductPage from "./Pages/EditProductPage"
import useAuthReq from "./hooks/useAuthReq"
import { useUserSync } from "./hooks/useUserSync"

function App() {
  const { isLoaded, isSignedIn } = useAuthReq();

  useUserSync();
  if (!isLoaded) return null;
  return (
    <>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={isSignedIn ? <CreatePage /> : <Navigate to={"/"} />} />
            <Route path="/edit/:id" element={<EditProductPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
