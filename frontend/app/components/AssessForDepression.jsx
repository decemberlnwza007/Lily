'use client'

import { useState } from 'react'

export default function AssessForDespression() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ท่านรู้สึก หดหู่ เศร้า หรือท้อแท้สิ้นหวังหรือไม่',
    'ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ท่านรู้สึก เบื่อ ทำอะไรก็ไม่เพลิดเพลินหรือไม่',
  ]

  const options = [
    {
      value: 0,
      label: 'ไม่มี',
      color:
        'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200',
      icon: '',
    },
    {
      value: 1,
      label: 'มี',
      color: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
      icon: '',
    },
  ]

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        alert('ขอบคุณที่ทำแบบประเมินจนเสร็จ!')
      }
    }, 600)
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = (currentQuestion / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-mint-500 to-indigo-100 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-mint-500 bg-clip-text text-transparent">
              แบบประเมินภาวะซึมเศร้า
            </h1>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-mint-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-2">
            {Math.round(progress)}% เสร็จสิ้น
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden min-h-[600px] border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-white/50 to-blue-50/30 relative">
              <div className="absolute top-8 left-8">
                <div className="inline-flex items-center px-4 py-2 bg-mint-500 text-mint-500 rounded-full text-sm font-medium shadow-sm">
                  <div className="w-2 h-2 bg-mint-500 rounded-full mr-2 animate-pulse"></div>
                  ในช่วง 2 สัปดาห์ที่ผ่านมารวมทั้งวันนี้
                </div>
              </div>

              <div className="space-y-8 mt-8">
                <div
                  className="transform transition-all duration-500 ease-out"
                  key={currentQuestion}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight mb-6">
                    {questions[currentQuestion]}
                  </h2>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของท่านมากที่สุด
                  </p>
                </div>
              </div>
            </div>

            <div className="p-12 bg-gradient-to-br from-gray-50/50 to-white/30 flex flex-col justify-center">
              <div className="space-y-6">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className={`group w-full p-8 rounded-2xl font-medium text-lg transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 ${option.color} ${
                      answers[currentQuestion] === option.value
                        ? 'ring-4 ring-blue-300 scale-105 shadow-2xl'
                        : ''
                    } hover:rotate-1 hover:-translate-y-1`}
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animation: 'slideInRight 0.6s ease-out',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300">
                          <span className="text-xl">{option.icon}</span>
                        </div>
                        <span className="text-xl">{option.label}</span>
                      </div>

                      {answers[currentQuestion] === option.value && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:bg-white border border-white/20"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ย้อนกลับ
          </button>

          <div className="flex gap-3">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-500 rounded-full ${
                  index === currentQuestion
                    ? 'w-12 h-4 bg-gray-900 shadow-lg'
                    : answers[index] !== undefined
                      ? 'w-4 h-4 bg-emerald-400 shadow-md'
                      : 'w-4 h-4 bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <button className="group px-8 py-4 bg-yellow-500  text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:from-blue-600 hover:to-purple-600 hover:scale-105">
            <span>ช่วยเหลือ</span>
            <svg
              className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .from-mint-50 {
          --tw-gradient-from: #f0fdfa;
        }
        .to-emerald-50 {
          --tw-gradient-to: #ecfdf5;
        }
        .bg-mint-50 {
          background-color: #f0fdfa;
        }
        .bg-mint-100 {
          background-color: #ccfbf1;
        }
        .bg-mint-200 {
          background-color: #99f6e4;
        }
        .text-mint-500 {
          color: #14b8a6;
        }
        .from-mint-500 {
          background-color: #14b8a6;
        }
        .text-mint-600 {
          color: #0d9488;
        }
        .text-mint-700 {
          color: #0f766e;
        }
        .border-mint-100 {
          border-color: #ccfbf1;
        }
        .border-mint-200 {
          border-color: #99f6e4;
        }
        .border-mint-300 {
          border-color: #5eead4;
        }
        .focus\\:ring-mint-300:focus {
          --tw-ring-color: #5eead4;
        }
        .focus\\:border-mint-300:focus {
          border-color: #5eead4;
        }
        .from-mint-500 {
          --tw-gradient-from: #14b8a6;
        }
        .to-emerald-500 {
          --tw-gradient-to: #10b981;
        }
        .hover\\:from-mint-600:hover {
          --tw-gradient-from: #0d9488;
        }
        .hover\\:to-emerald-600:hover {
          --tw-gradient-to: #059669;
        }
        .hover\\:text-mint-600:hover {
          color: #0d9488;
        }
        .hover\\:text-mint-700:hover {
          color: #0f766e;
        }
        .bg-mint-50\\/50 {
          background-color: rgb(240 253 250 / 0.5);
        }
        .ring-mint-300 {
          --tw-ring-color: #5eead4;
        }
        .bg-mint-300 {
          background-color: #5eead4;
        }
      `}</style>
    </div>
  )
}
