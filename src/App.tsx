import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Navbar from "./components/Navbar"
import BlogDetail from "./components/BlogDetail"
import CreateBlogPage from "./pages/CreateBlogPage"
import UserDashboard from "./pages/UserDashboard"

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateBlogPage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

