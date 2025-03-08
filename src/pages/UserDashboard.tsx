"use client"

import type React from "react"
import { useState } from "react"
import { blogPosts } from "../data/blogData"
import ProfileSection from "../components/dashboard/ProfileSection"
import StatisticsSection from "../components/dashboard/StatisticsSection"
import RecentBlogsSection from "../components/dashboard/RecentBlogsSection"
import BlogManagementSection from "../components/dashboard/BlogManagementSection"
import DashboardNavigation from "../components/dashboard/DashboardNavigation"

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "blogs" | "stats" | "settings">("overview")

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinDate: "January 2023",
    bio: "Content creator and real estate enthusiast. I write about modern living spaces and rental tips.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "San Francisco, CA",
    website: "alexjohnson.com",
    socialLinks: {
      twitter: "@alexj",
      instagram: "@alex.writes",
      linkedin: "alexjohnson",
    },
  }

  // Mock statistics
  const stats = {
    totalBlogs: 24,
    totalViews: 45892,
    totalLikes: 2134,
    totalComments: 847,
    viewsThisMonth: 5280,
    likesThisMonth: 312,
    commentsThisMonth: 98,
    mostViewedBlog: "Modern Luxury Villa with Ocean View",
    mostLikedBlog: "Urban Loft in Downtown District",
    mostCommentedBlog: "Charming Cottage in the Countryside",
  }

  // Use the existing blog posts as user's blogs
  const userBlogs = blogPosts.map((blog) => ({
    ...blog,
    status: Math.random() > 0.3 ? "published" : "draft",
    views: Math.floor(Math.random() * 10000),
    lastEdited: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {activeTab === "overview" && (
              <div className="space-y-8">
                <ProfileSection user={user} />
                <StatisticsSection stats={stats} />
                <RecentBlogsSection blogs={userBlogs.slice(0, 3)} />
              </div>
            )}

            {activeTab === "blogs" && <BlogManagementSection blogs={userBlogs} />}

            {activeTab === "stats" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>

                {/* Expanded statistics view */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Content Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Blogs:</span>
                        <span className="font-bold">{stats.totalBlogs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Published:</span>
                        <span className="font-bold">{userBlogs.filter((b) => b.status === "published").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Drafts:</span>
                        <span className="font-bold">{userBlogs.filter((b) => b.status === "draft").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Word Count:</span>
                        <span className="font-bold">1,245</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Engagement</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Views:</span>
                        <span className="font-bold">{stats.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Likes:</span>
                        <span className="font-bold">{stats.totalLikes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Comments:</span>
                        <span className="font-bold">{stats.totalComments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Engagement Rate:</span>
                        <span className="font-bold">6.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Growth (This Month)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Views:</span>
                        <span className="font-bold text-green-600">+{stats.viewsThisMonth.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Likes:</span>
                        <span className="font-bold text-green-600">+{stats.likesThisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Comments:</span>
                        <span className="font-bold text-green-600">+{stats.commentsThisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth Rate:</span>
                        <span className="font-bold text-green-600">+12.3%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top performing content */}
                <h3 className="text-xl font-bold mb-4">Top Performing Content</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blog Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Engagement Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userBlogs.slice(0, 5).map((blog) => (
                        <tr key={blog.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{blog.views?.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{blog.likes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{blog.comments}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {(((blog.likes + blog.comments) / (blog.views || 1)) * 100).toFixed(1)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                <div className="space-y-8">
                  {/* Profile Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.name}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.email}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.location}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.website}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          rows={4}
                          defaultValue={user.bio}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.socialLinks.twitter}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.socialLinks.instagram}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          defaultValue={user.socialLinks.linkedin}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

