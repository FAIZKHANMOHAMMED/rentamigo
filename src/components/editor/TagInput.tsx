"use client"

import type React from "react"
import { Tag, Plus, X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  currentTag: string
  onTagChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  error?: string
}

const TagInput: React.FC<TagInputProps> = ({ tags, currentTag, onTagChange, onAddTag, onRemoveTag, error }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onAddTag()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => onTagChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Add tags..."
          />
        </div>
        <button
          type="button"
          onClick={onAddTag}
          className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <Plus size={16} className="mr-1" />
          Add
        </button>
      </div>

      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
            {tag}
            <button type="button" onClick={() => onRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {tags.length === 0 && !error && (
        <p className="mt-1 text-sm text-gray-500">Add at least one tag to categorize your blog</p>
      )}
    </div>
  )
}

export default TagInput

