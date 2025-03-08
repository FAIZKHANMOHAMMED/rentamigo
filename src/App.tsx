import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import BlogDetail from "./components/BlogDetail"
import CreateBlogPage from "./pages/CreateBlogPage"
import UserDashboard from "./pages/UserDashboard"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { AuthProvider } from "./context/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateBlogPage />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

