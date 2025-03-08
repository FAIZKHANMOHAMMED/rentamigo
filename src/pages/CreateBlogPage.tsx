"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LucideImage, X, Upload, Check, AlertCircle } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TipTapImage from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { getBlogById, createBlog, updateBlog } from "../services/blogService"
import TagInput from "../components/editor/TagInput"
import EditorMenuBar from "../components/editor/EditorMenuBar"
import type { Blogpost } from "../types"

const CreateBlogPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [category, setCategory] = useState("Lifestyle")
  const [readTime, setReadTime] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
      TipTapImage.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())

      // Clear error when content is edited
      if (errors.content) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.content
          return newErrors
        })
      }
    },
  })

  // Load blog data if editing
  useEffect(() => {
    if (isEditing && id) {
      const blogId = Number.parseInt(id)
      const blog = getBlogById(blogId)

      if (blog) {
        setTitle(blog.title)
        setContent(blog.content)
        setExcerpt(blog.excerpt || "")
        setTags(blog.tags)
        setCoverImage(blog.coverImage)
        setCategory(blog.category)
        setReadTime(blog.readTime)

        // Update editor content
        if (editor) {
          editor.commands.setContent(blog.content)
        }
      }
    }
  }, [isEditing, id, editor])

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")

      // Clear error when tags are added
      if (errors.tags) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.tags
          return newErrors
        })
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)

        // Clear error when image is uploaded
        if (errors.coverImage) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.coverImage
            return newErrors
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!content.trim() || content === "<p></p>") {
      newErrors.content = "Content is required"
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required"
    }

    if (!coverImage) {
      newErrors.coverImage = "Cover image is required"
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0]
      const element = document.getElementById(firstError)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsSubmitting(true)

    try {
      // Create author object (in a real app, this would come from auth context)
      const author = {
        name: "Alex Johnson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      }

      const blogData: Omit<Blogpost, "id"> = {
        title,
        content,
        excerpt,
        tags,
        coverImage: coverImage || "",
        category,
        readTime,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        author,
        likes: 0,
        comments: 0,
        commentsList: [],
        reviews: [],
        shares: 0,
      }

      if (isEditing && id) {
        // Update existing blog
        const updated = updateBlog(Number.parseInt(id), blogData)
        if (updated) {
          setSuccessMessage("Blog updated successfully!")
          setTimeout(() => {
            navigate(`/blog/${id}`)
          }, 1500)
        }
      } else {
        // Create new blog
        const newBlog = createBlog(blogData)
        setSuccessMessage("Blog created successfully!")
        setTimeout(() => {
          navigate(`/blog/${newBlog.id}`)
        }, 1500)
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      setErrors({ submit: "Failed to save blog. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImageToEditor = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        addImageToEditor(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h1>

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.title
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              placeholder="Enter a catchy title..."
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value)
                if (errors.excerpt) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.excerpt
                    return newErrors
                  })
                }
              }}
              rows={3}
              className={`w-full px-4 py-2 border ${
                errors.excerpt ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              placeholder="Write a brief summary of your blog post..."
            />
            {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
            <p className="mt-1 text-sm text-gray-500">This will be displayed in blog cards and search results.</p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="coverImage"
            />

            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={triggerImageUpload}
                className={`w-full h-64 border-2 border-dashed ${
                  errors.coverImage ? "border-red-500" : "border-gray-300"
                } rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400`}
              >
                <LucideImage size={48} className={errors.coverImage ? "text-red-400" : "text-gray-400"} />
                <p className={`mt-2 text-sm ${errors.coverImage ? "text-red-500" : "text-gray-500"}`}>
                  Click to upload cover image
                </p>
              </div>
            )}
            {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
          </div>

          {/* Category and Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="Lifestyle">Lifestyle</option>
                <option value="Luxury">Luxury</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Suburban">Suburban</option>
                <option value="Coastal">Coastal</option>
                <option value="Historic">Historic</option>
              </select>
            </div>
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                Read Time (minutes)
              </label>
              <input
                type="number"
                id="readTime"
                value={readTime}
                onChange={(e) => setReadTime(Number.parseInt(e.target.value) || 5)}
                min="1"
                max="60"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <TagInput
            tags={tags}
            currentTag={currentTag}
            onTagChange={setCurrentTag}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            error={errors.tags}
          />

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <div
              className={`border ${errors.content ? "border-red-500" : "border-gray-300"} rounded-md overflow-hidden`}
            >
              <EditorMenuBar editor={editor} />
              <div className="p-4 min-h-[400px] bg-white">
                <EditorContent editor={editor} />
              </div>
              <div className="border-t border-gray-200 p-2 bg-gray-50 flex justify-between items-center">
                <div>
                  <input
                    type="file"
                    id="editor-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleEditorImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("editor-image-upload")?.click()}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload size={16} className="mr-1" />
                    Add Image
                  </button>
                </div>
                <div className="text-sm text-gray-500">{content.length > 0 ? `${content.length} characters` : ""}</div>
              </div>
            </div>
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>{isEditing ? "Update Post" : "Publish Post"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlogPage

