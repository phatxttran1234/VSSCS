import React, { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Shuffle, BookOpen, Star, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Vocabulary } from '../lib/storage'

interface FlashcardPageProps {
  vocabulary: Vocabulary[]
  onBack: () => void
}

interface FlashcardState {
  isFlipped: boolean
  currentIndex: number
  selectedWords: Vocabulary[]
  studyMode: boolean
  correctAnswers: string[]
  incorrectAnswers: string[]
}

export default function FlashcardPage({ vocabulary, onBack }: FlashcardPageProps) {
  const [flashcardState, setFlashcardState] = useState<FlashcardState>({
    isFlipped: false,
    currentIndex: 0,
    selectedWords: [],
    studyMode: false,
    correctAnswers: [],
    incorrectAnswers: []
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // Filter vocabulary for selection
  const filteredVocabulary = vocabulary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  // Flip card
  const flipCard = () => {
    setFlashcardState(prev => ({ ...prev, isFlipped: !prev.isFlipped }))
  }

  // Add word to study set
  const addToStudySet = (word: Vocabulary) => {
    if (!flashcardState.selectedWords.find(w => w.id === word.id)) {
      setFlashcardState(prev => ({
        ...prev,
        selectedWords: [...prev.selectedWords, word]
      }))
    }
  }

  // Remove word from study set
  const removeFromStudySet = (wordId: string) => {
    setFlashcardState(prev => ({
      ...prev,
      selectedWords: prev.selectedWords.filter(w => w.id !== wordId)
    }))
  }

  // Start study mode
  const startStudyMode = () => {
    if (flashcardState.selectedWords.length === 0) {
      alert('Please select at least one word to study! 📚')
      return
    }

    setFlashcardState(prev => ({
      ...prev,
      studyMode: true,
      currentIndex: 0,
      isFlipped: false,
      correctAnswers: [],
      incorrectAnswers: []
    }))
  }

  // Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...flashcardState.selectedWords].sort(() => Math.random() - 0.5)
    setFlashcardState(prev => ({
      ...prev,
      selectedWords: shuffled,
      currentIndex: 0,
      isFlipped: false
    }))
  }

  // Navigate cards
  const nextCard = () => {
    if (flashcardState.currentIndex < flashcardState.selectedWords.length - 1) {
      setFlashcardState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isFlipped: false
      }))
    }
  }

  const prevCard = () => {
    if (flashcardState.currentIndex > 0) {
      setFlashcardState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isFlipped: false
      }))
    }
  }

  // Mark answer
  const markAnswer = (correct: boolean) => {
    const currentWord = flashcardState.selectedWords[flashcardState.currentIndex]
    if (!currentWord) return

    setFlashcardState(prev => ({
      ...prev,
      correctAnswers: correct 
        ? [...prev.correctAnswers, currentWord.id]
        : prev.correctAnswers.filter(id => id !== currentWord.id),
      incorrectAnswers: !correct
        ? [...prev.incorrectAnswers, currentWord.id]
        : prev.incorrectAnswers.filter(id => id !== currentWord.id)
    }))

    // Auto advance to next card
    setTimeout(() => {
      if (flashcardState.currentIndex < flashcardState.selectedWords.length - 1) {
        nextCard()
      }
    }, 1000)
  }

  // Reset study session
  const resetStudy = () => {
    setFlashcardState(prev => ({
      ...prev,
      currentIndex: 0,
      isFlipped: false,
      correctAnswers: [],
      incorrectAnswers: []
    }))
  }

  // Exit study mode
  const exitStudyMode = () => {
    setFlashcardState(prev => ({
      ...prev,
      studyMode: false,
      isFlipped: false,
      currentIndex: 0
    }))
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

  const currentWord = flashcardState.selectedWords[flashcardState.currentIndex]
  const progress = flashcardState.selectedWords.length > 0 
    ? ((flashcardState.currentIndex + 1) / flashcardState.selectedWords.length) * 100 
    : 0

  if (flashcardState.studyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Mobile-Optimized Study Mode Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={exitStudyMode}
              className="flex items-center bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-xl transition-all shadow-lg text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Selection</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-2 sm:px-4 py-1 sm:py-2 shadow-lg">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {flashcardState.currentIndex + 1} / {flashcardState.selectedWords.length}
                </span>
              </div>
              
              <button
                onClick={shuffleCards}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-purple-600 p-1.5 sm:p-2 rounded-xl transition-all shadow-lg"
                title="Shuffle Cards"
              >
                <Shuffle className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              
              <button
                onClick={resetStudy}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-blue-600 p-1.5 sm:p-2 rounded-xl transition-all shadow-lg"
                title="Reset Progress"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Mobile-Optimized Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/60 rounded-full h-2 sm:h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
              <span>Progress: {Math.round(progress)}%</span>
              <span>
                ✅ {flashcardState.correctAnswers.length} | 
                ❌ {flashcardState.incorrectAnswers.length}
              </span>
            </div>
          </div>

          {/* Mobile-Optimized Flashcard */}
          {currentWord && (
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative perspective-1000 w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <div 
                  className={`flashcard w-full h-64 sm:h-72 lg:h-80 cursor-pointer transition-transform duration-600 transform-style-preserve-3d ${
                    flashcardState.isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={flipCard}
                >
                  {/* Front of card (Word) - Mobile Optimized */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-purple-200 flex flex-col items-center justify-center p-4 sm:p-6 backface-hidden">
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold mb-3 sm:mb-4 ${getDifficultyColor(currentWord.difficulty)}`}>
                      {getDifficultyEmoji(currentWord.difficulty)} {currentWord.difficulty?.toUpperCase()}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-3 sm:mb-4 leading-tight">
                      {currentWord.word}
                    </h2>
                    
                    <p className="text-purple-600 text-center font-medium text-sm sm:text-base">
                      🏐 Tap to see definition
                    </p>
                  </div>

                  {/* Back of card (Definition & Example) - Mobile Optimized */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-200 flex flex-col justify-center p-4 sm:p-6 backface-hidden rotate-y-180">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                        {currentWord.word}
                      </h3>
                      
                      <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {currentWord.definition}
                        </p>
                      </div>
                      
                      {currentWord.example && (
                        <div className="bg-yellow-50 rounded-xl p-3 sm:p-4">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 font-semibold">Example:</p>
                          <p className="text-gray-700 italic text-xs sm:text-sm leading-relaxed">
                            "{currentWord.example}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile-Optimized Navigation */}
          <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <button
              onClick={prevCard}
              disabled={flashcardState.currentIndex === 0}
              className="bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all shadow-lg flex items-center text-sm sm:text-base"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>
            
            <button
              onClick={nextCard}
              disabled={flashcardState.currentIndex === flashcardState.selectedWords.length - 1}
              className="bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all shadow-lg flex items-center text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </button>
          </div>

          {/* Mobile-Optimized Answer Buttons */}
          {flashcardState.isFlipped && (
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
              <button
                onClick={() => markAnswer(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all shadow-lg flex items-center justify-center font-medium text-sm sm:text-base"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Need More Practice
              </button>
              
              <button
                onClick={() => markAnswer(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all shadow-lg flex items-center justify-center font-medium text-sm sm:text-base"
              >
                <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Got It!
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile-Optimized Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-xl transition-all shadow-lg text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Vocabulary</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-2 sm:px-4 py-1 sm:py-2 shadow-lg">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Selected: {flashcardState.selectedWords.length}
                </span>
              </div>
              
              {flashcardState.selectedWords.length > 0 && (
                <button
                  onClick={startStudyMode}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 sm:px-6 py-2 rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all shadow-lg font-medium text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">Start Studying! 🚀</span>
                  <span className="sm:hidden">Study! 🚀</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              🏐 Volleyball Flashcards
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Select words to study and master your volleyball vocabulary!
            </p>
          </div>
        </div>

        {/* Mobile-Optimized Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-orange-200">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search volleyball terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-white/70 text-sm sm:text-base"
              />
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-white/70 font-medium text-sm sm:text-base"
            >
              <option value="all">🌈 All Levels</option>
              <option value="easy">🌱 Basic</option>
              <option value="medium">⭐ For Coaching</option>
              <option value="hard">🔥 Important</option>
            </select>
          </div>
        </div>

        {/* Mobile-Optimized Selected Words Preview */}
        {flashcardState.selectedWords.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-purple-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
              Your Study Set ({flashcardState.selectedWords.length} words)
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {flashcardState.selectedWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center"
                >
                  {word.word}
                  <button
                    onClick={() => removeFromStudySet(word.id)}
                    className="ml-1 sm:ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X className="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile-Optimized Vocabulary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredVocabulary.map((item) => {
            const isSelected = flashcardState.selectedWords.find(w => w.id === item.id)
            
            return (
              <div
                key={item.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden group cursor-pointer ${
                  isSelected 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-100 hover:border-orange-300'
                }`}
                onClick={() => isSelected ? removeFromStudySet(item.id) : addToStudySet(item)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1 pr-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-2 leading-tight">
                        {item.word}
                      </h3>
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${getDifficultyColor(item.difficulty)}`}>
                        {getDifficultyEmoji(item.difficulty)} 
                        <span className="hidden sm:inline ml-1">{item.difficulty?.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className={`p-1.5 sm:p-2 rounded-full transition-all ${
                      isSelected 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 text-gray-400 group-hover:bg-orange-500 group-hover:text-white'
                    }`}>
                      {isSelected ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Star className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-100">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                      {item.definition}
                    </p>
                  </div>
                  
                  {item.example && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-yellow-200 mb-3">
                      <p className="text-xs font-semibold text-orange-600 mb-1">Example:</p>
                      <p className="text-gray-700 italic text-xs leading-relaxed">
                        "{item.example}"
                      </p>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <span className={`text-xs sm:text-sm font-medium ${
                      isSelected ? 'text-purple-600' : 'text-gray-500 group-hover:text-orange-600'
                    }`}>
                      {isSelected ? '✅ Added to study set' : '👆 Tap to add to study set'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🏐</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4">No vocabulary found!</h3>
            <p className="text-base sm:text-lg text-gray-500 px-4">
              Try adjusting your search terms or difficulty filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}