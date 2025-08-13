import React, { useState } from 'react'
import { Search, BookOpen, Clock, Star, Sparkles, Trash2, Edit3, Save, X, GraduationCap, Target } from 'lucide-react'
import { Vocabulary, deleteVocabulary, updateVocabulary } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'
import FlashcardPage from './FlashcardPage'
import TestPage from './TestPage'

interface VocabularyListProps {
  vocabulary: Vocabulary[]
  onDataChange: () => void
}

export default function VocabularyList({ vocabulary, onDataChange }: VocabularyListProps) {
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Vocabulary | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showTest, setShowTest] = useState(false)

  const filteredVocabulary = vocabulary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const handleDelete = async (id: string, word: string) => {
    if (!isAdmin) {
      alert('Only admins can delete vocabulary terms! 👑')
      return
    }

    if (!confirm(`Are you sure you want to delete "${word}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      await deleteVocabulary(id)
      await onDataChange()
    } catch (error) {
      console.error('Error deleting vocabulary:', error)
      alert('Failed to delete the word. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const startEditing = (vocab: Vocabulary) => {
    if (!isAdmin) {
      alert('Only admins can edit vocabulary terms! 👑')
      return
    }
    setEditingId(vocab.id)
    setEditForm({ ...vocab })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const saveEdit = async () => {
    if (!editForm || !editingId) return

    setIsUpdating(true)
    try {
      await updateVocabulary(editingId, {
        word: editForm.word,
        definition: editForm.definition,
        example: editForm.example,
        difficulty: editForm.difficulty
      })
      
      cancelEditing()
      await onDataChange()
    } catch (error) {
      console.error('Error updating vocabulary:', error)
      alert('Failed to update vocabulary. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getDifficultyEmoji = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return '🌱'
      case 'medium': return '🌟'
      case 'hard': return '🔥'
      default: return '⭐'
    }
  }

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'Basic'
      case 'medium': return 'For Coaching'
      case 'hard': return 'Important'
      default: return 'For Coaching'
    }
  }

  if (showFlashcards) {
    return (
      <FlashcardPage 
        vocabulary={vocabulary} 
        onBack={() => setShowFlashcards(false)} 
      />
    )
  }

  if (showTest) {
    return (
      <TestPage 
        vocabulary={vocabulary} 
        onBack={() => setShowTest(false)} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Compact Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-3 sm:mb-4 lg:mb-6 shadow-lg">
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
            🏐 Your Volleyball Vocab Collection!
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Welcome to your personal volleyball vocabulary treasure! Every term here is a step towards becoming a volleyball champion! ✨
          </p>
          
          {/* Study Options */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setShowFlashcards(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-sm sm:text-base flex items-center justify-center"
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              🎯 Study with Flashcards!
            </button>
            
            <button
              onClick={() => setShowTest(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-sm sm:text-base flex items-center justify-center"
            >
              <Target className="h-5 w-5 mr-2" />
              🏆 Take a Test!
            </button>
          </div>
        </div>

        {/* Compact Search and Filter */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border-2 border-blue-200">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 lg:gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-400" />
                  <input
                    type="text"
                    placeholder="🔍 Search for volleyball terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 lg:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none transition-all text-sm sm:text-base lg:text-lg bg-white/70"
                  />
                </div>
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-sm sm:text-base lg:text-lg bg-white/70 font-medium"
              >
                <option value="all">🌈 All Levels</option>
                <option value="easy">🌱 Basic</option>
                <option value="medium">⭐ For Coaching</option>
                <option value="hard">🔥 Important</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact Vocabulary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredVocabulary.map((item, index) => (
            <div
              key={item.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group hover:scale-105 transform relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Edit Button - Only show for admins */}
              {isAdmin && editingId !== item.id && (
                <button
                  onClick={() => startEditing(item)}
                  className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 z-10 bg-green-500 hover:bg-green-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                  title={`Edit "${item.word}"`}
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}

              {/* Delete Button - Only show for admins */}
              {isAdmin && editingId !== item.id && (
                <button
                  onClick={() => handleDelete(item.id, item.word)}
                  disabled={deletingId === item.id}
                  className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`Delete "${item.word}"`}
                >
                  {deletingId === item.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </button>
              )}

              <div className="p-4 sm:p-6 lg:p-8">
                {editingId === item.id ? (
                  // Edit Mode - Compact
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      value={editForm?.word || ''}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, word: e.target.value } : null)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none font-bold text-sm sm:text-base lg:text-lg"
                      placeholder="Volleyball term"
                    />
                    <textarea
                      value={editForm?.definition || ''}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, definition: e.target.value } : null)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none text-sm sm:text-base"
                      rows={3}
                      placeholder="Definition"
                    />
                    <textarea
                      value={editForm?.example || ''}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, example: e.target.value } : null)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 outline-none text-sm sm:text-base"
                      rows={2}
                      placeholder="Example (optional)"
                    />
                    <select
                      value={editForm?.difficulty || 'medium'}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, difficulty: e.target.value } : null)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none font-medium text-sm sm:text-base"
                    >
                      <option value="easy">🌱 Basic</option>
                      <option value="medium">⭐ For Coaching</option>
                      <option value="hard">🔥 Important</option>
                    </select>
                    <div className="flex space-x-2 sm:space-x-3">
                      <button
                        onClick={saveEdit}
                        disabled={isUpdating}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                        ) : (
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode - Compact
                  <>
                    <div className="flex justify-between items-start mb-3 sm:mb-4 lg:mb-6">
                      <div className="flex-1 pr-4 sm:pr-6 lg:pr-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 sm:mb-2">
                          {item.word}
                        </h3>
                        <div className="flex items-center">
                          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1" />
                          <span className="text-xs sm:text-sm text-gray-500 font-medium">Volleyball term learned!</span>
                        </div>
                      </div>
                      <div className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-bold rounded-full border-2 ${getDifficultyColor(item.difficulty)} flex items-center`}>
                        <span className="mr-1">{getDifficultyEmoji(item.difficulty)}</span>
                        <span className="hidden sm:inline">{getDifficultyLabel(item.difficulty)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 border border-blue-100">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                        {item.definition}
                      </p>
                    </div>
                    
                    {item.example && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 mb-3 sm:mb-4 lg:mb-6 border border-yellow-200">
                        <div className="flex items-start">
                          <span className="text-lg sm:text-xl lg:text-2xl mr-2 sm:mr-3">🏐</span>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-orange-600 mb-1">Example:</p>
                            <p className="text-gray-700 italic leading-relaxed text-sm sm:text-base">
                              "{item.example}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Added {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1" />
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Awesome!</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 lg:mb-6">🏐</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-600 mb-2 sm:mb-3 lg:mb-4">No volleyball terms found yet!</h3>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-500 mb-4 sm:mb-6 lg:mb-8 px-2">
              {searchTerm ? 'Try different search terms - your perfect volleyball term is waiting! 🔍' : 'Ready to add your first volleyball vocabulary? Let\'s get started! 🚀'}
            </p>
            <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
              <span className="text-lg sm:text-xl lg:text-2xl">🌟</span>
              <span className="text-lg sm:text-xl lg:text-2xl">🏐</span>
              <span className="text-lg sm:text-xl lg:text-2xl">✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}