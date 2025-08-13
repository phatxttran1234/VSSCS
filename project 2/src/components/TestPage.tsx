import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Trophy, RotateCcw, Play, Pause, CheckCircle, XCircle } from 'lucide-react'
import { Vocabulary } from '../lib/storage'

interface TestPageProps {
  vocabulary: Vocabulary[]
  onBack: () => void
}

interface TestState {
  selectedWords: Vocabulary[]
  currentIndex: number
  timePerQuestion: number
  timeRemaining: number
  isActive: boolean
  isPaused: boolean
  answers: { questionId: string; selectedAnswer: string; correct: boolean; timeUsed: number }[]
  showResult: boolean
  currentAnswers: string[]
}

export default function TestPage({ vocabulary, onBack }: TestPageProps) {
  const [testState, setTestState] = useState<TestState>({
    selectedWords: [],
    currentIndex: 0,
    timePerQuestion: 10,
    timeRemaining: 10,
    isActive: false,
    isPaused: false,
    answers: [],
    showResult: false,
    currentAnswers: []
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

  // Generate random answers for current question
  const generateAnswers = (correctWord: Vocabulary, allWords: Vocabulary[]): string[] => {
    const otherWords = allWords.filter(w => w.id !== correctWord.id)
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word)
    
    const allAnswers = [correctWord.word, ...wrongAnswers]
    return allAnswers.sort(() => Math.random() - 0.5)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (testState.isActive && !testState.isPaused && testState.timeRemaining > 0) {
      interval = setInterval(() => {
        setTestState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up - auto submit wrong answer
            handleAnswer('', true)
            return prev
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [testState.isActive, testState.isPaused, testState.timeRemaining])

  // Update answers when current question changes
  useEffect(() => {
    if (testState.selectedWords.length > 0 && testState.currentIndex < testState.selectedWords.length) {
      const currentWord = testState.selectedWords[testState.currentIndex]
      const answers = generateAnswers(currentWord, vocabulary)
      setTestState(prev => ({ ...prev, currentAnswers: answers }))
    }
  }, [testState.currentIndex, testState.selectedWords, vocabulary])

  // Add word to test set
  const addToTestSet = (word: Vocabulary) => {
    if (!testState.selectedWords.find(w => w.id === word.id)) {
      setTestState(prev => ({
        ...prev,
        selectedWords: [...prev.selectedWords, word]
      }))
    }
  }

  // Remove word from test set
  const removeFromTestSet = (wordId: string) => {
    setTestState(prev => ({
      ...prev,
      selectedWords: prev.selectedWords.filter(w => w.id !== wordId)
    }))
  }

  // Start test
  const startTest = () => {
    if (testState.selectedWords.length === 0) {
      alert('Please select at least one word to test! 📚')
      return
    }

    // Shuffle the selected words
    const shuffledWords = [...testState.selectedWords].sort(() => Math.random() - 0.5)
    
    setTestState(prev => ({
      ...prev,
      selectedWords: shuffledWords,
      currentIndex: 0,
      timeRemaining: prev.timePerQuestion,
      isActive: true,
      isPaused: false,
      answers: [],
      showResult: false
    }))
  }

  // Pause/Resume test
  const togglePause = () => {
    setTestState(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }

  // Handle answer selection
  const handleAnswer = (selectedAnswer: string, timeUp: boolean = false) => {
    const currentWord = testState.selectedWords[testState.currentIndex]
    const correct = selectedAnswer === currentWord.word
    const timeUsed = testState.timePerQuestion - testState.timeRemaining

    const newAnswer = {
      questionId: currentWord.id,
      selectedAnswer: timeUp ? 'Time Up' : selectedAnswer,
      correct: timeUp ? false : correct,
      timeUsed: timeUp ? testState.timePerQuestion : timeUsed
    }

    setTestState(prev => {
      const newAnswers = [...prev.answers, newAnswer]
      const isLastQuestion = prev.currentIndex >= prev.selectedWords.length - 1

      if (isLastQuestion) {
        // Test completed
        return {
          ...prev,
          answers: newAnswers,
          showResult: true,
          isActive: false
        }
      } else {
        // Move to next question
        return {
          ...prev,
          answers: newAnswers,
          currentIndex: prev.currentIndex + 1,
          timeRemaining: prev.timePerQuestion
        }
      }
    })
  }

  // Reset test
  const resetTest = () => {
    setTestState(prev => ({
      ...prev,
      currentIndex: 0,
      timeRemaining: prev.timePerQuestion,
      isActive: false,
      isPaused: false,
      answers: [],
      showResult: false,
      currentAnswers: []
    }))
  }

  // Calculate results
  const correctAnswers = testState.answers.filter(a => a.correct).length
  const totalQuestions = testState.selectedWords.length
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const averageTime = testState.answers.length > 0 
    ? Math.round(testState.answers.reduce((sum, a) => sum + a.timeUsed, 0) / testState.answers.length)
    : 0

  const currentWord = testState.selectedWords[testState.currentIndex]
  const progress = totalQuestions > 0 ? ((testState.currentIndex + 1) / totalQuestions) * 100 : 0

  // Mobile-Optimized Results view
  if (testState.showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 sm:mb-6 shadow-lg">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">🎉 Test Complete!</h1>
            <p className="text-base sm:text-xl text-gray-600 px-4">Here's how you did on your volleyball vocabulary test!</p>
          </div>

          {/* Mobile-Optimized Results Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-green-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Accuracy</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{correctAnswers}/{totalQuestions} correct</div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-blue-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{averageTime}s</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Avg. Time</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">per question</div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-purple-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{totalQuestions}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Questions</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">completed</div>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Detailed Results */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-gray-200 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">📊 Detailed Results</h3>
            <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
              {testState.answers.map((answer, index) => {
                const word = testState.selectedWords.find(w => w.id === answer.questionId)
                return (
                  <div key={answer.questionId} className={`p-3 sm:p-4 rounded-xl border-2 ${
                    answer.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        {answer.correct ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm sm:text-base leading-tight">
                            Q{index + 1}: {word?.definition}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-1">
                            Your answer: <span className={answer.correct ? 'text-green-600' : 'text-red-600'}>
                              {answer.selectedAnswer}
                            </span>
                            {!answer.correct && word && (
                              <div className="text-green-600 mt-1">
                                Correct: {word.word}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">
                        {answer.timeUsed}s
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile-Optimized Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
            <button
              onClick={resetTest}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium flex items-center justify-center text-sm sm:text-base"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Take Test Again
            </button>
            
            <button
              onClick={onBack}
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-4 sm:px-6 py-3 rounded-xl transition-all shadow-lg font-medium flex items-center justify-center text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Back to Vocabulary
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mobile-Optimized Test in progress
  if (testState.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Mobile-Optimized Test Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={onBack}
              className="flex items-center bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-xl transition-all shadow-lg text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Exit Test</span>
              <span className="sm:hidden">Exit</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-2 sm:px-4 py-1 sm:py-2 shadow-lg">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {testState.currentIndex + 1} / {totalQuestions}
                </span>
              </div>
              
              <button
                onClick={togglePause}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-orange-600 p-1.5 sm:p-2 rounded-xl transition-all shadow-lg"
              >
                {testState.isPaused ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile-Optimized Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/60 rounded-full h-2 sm:h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
              <span>Progress: {Math.round(progress)}%</span>
              <span>Score: {correctAnswers}/{testState.answers.length}</span>
            </div>
          </div>

          {/* Mobile-Optimized Timer */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg mb-3 sm:mb-4 ${
              testState.timeRemaining <= 3 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-orange-400 to-red-500'
            }`}>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white mr-1" />
              <span className="text-xl sm:text-2xl font-bold text-white">{testState.timeRemaining}</span>
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              {testState.isPaused ? '⏸️ Test Paused' : 'Time remaining'}
            </p>
          </div>

          {/* Mobile-Optimized Question */}
          {currentWord && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 border-2 border-orange-200">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
                  What volleyball term matches this definition?
                </h2>
                <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                  <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                    {currentWord.definition}
                  </p>
                  {currentWord.example && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-200">
                      <p className="text-xs sm:text-sm text-orange-600 font-semibold mb-1">Example:</p>
                      <p className="text-gray-600 italic text-xs sm:text-sm">"{currentWord.example}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile-Optimized Answer Options */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {testState.currentAnswers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(answer)}
                    disabled={testState.isPaused}
                    className="bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-400 text-gray-800 p-3 sm:p-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 font-bold text-orange-600 text-sm sm:text-base flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-sm sm:text-base">{answer}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mobile-Optimized Test setup
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
                  Selected: {testState.selectedWords.length}
                </span>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-2 sm:px-4 py-1 sm:py-2 shadow-lg">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {testState.timePerQuestion}s/Q
                </span>
              </div>
              
              {testState.selectedWords.length > 0 && (
                <button
                  onClick={startTest}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 sm:px-6 py-2 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg font-medium text-xs sm:text-base"
                >
                  <span className="hidden sm:inline">Start Test! 🚀</span>
                  <span className="sm:hidden">Start! 🚀</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              🏐 Volleyball Vocabulary Test
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Test your knowledge with multiple choice questions!
            </p>
          </div>
        </div>

        {/* Mobile-Optimized Time Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-orange-200">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">⏱️ Test Settings</h3>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="text-gray-700 font-medium text-sm sm:text-base">Time per question:</label>
            <select
              value={testState.timePerQuestion}
              onChange={(e) => setTestState(prev => ({ 
                ...prev, 
                timePerQuestion: parseInt(e.target.value),
                timeRemaining: parseInt(e.target.value)
              }))}
              className="px-3 sm:px-4 py-2 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-white/70 text-sm sm:text-base"
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
              <option value={20}>20 seconds</option>
              <option value={30}>30 seconds</option>
            </select>
            <div className="text-xs sm:text-sm text-gray-600">
              Total time: {Math.ceil((testState.selectedWords.length * testState.timePerQuestion) / 60)} minutes
            </div>
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
        {testState.selectedWords.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-red-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600" />
              Your Test Set ({testState.selectedWords.length} questions)
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {testState.selectedWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center"
                >
                  {word.word}
                  <button
                    onClick={() => removeFromTestSet(word.id)}
                    className="ml-1 sm:ml-2 text-red-500 hover:text-red-700"
                  >
                    <XCircle className="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile-Optimized Vocabulary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredVocabulary.map((item) => {
            const isSelected = testState.selectedWords.find(w => w.id === item.id)
            
            return (
              <div
                key={item.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden group cursor-pointer ${
                  isSelected 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-100 hover:border-orange-300'
                }`}
                onClick={() => isSelected ? removeFromTestSet(item.id) : addToTestSet(item)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1 pr-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-2 leading-tight">
                        {item.word}
                      </h3>
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${
                        item.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.difficulty === 'easy' ? '🌱' : item.difficulty === 'medium' ? '⭐' : '🔥'} 
                        <span className="hidden sm:inline ml-1">{item.difficulty?.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className={`p-1.5 sm:p-2 rounded-full transition-all ${
                      isSelected 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-400 group-hover:bg-orange-500 group-hover:text-white'
                    }`}>
                      {isSelected ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : <Clock className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-100">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                      {item.definition}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <span className={`text-xs sm:text-sm font-medium ${
                      isSelected ? 'text-red-600' : 'text-gray-500 group-hover:text-orange-600'
                    }`}>
                      {isSelected ? '✅ Added to test' : '👆 Tap to add to test'}
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