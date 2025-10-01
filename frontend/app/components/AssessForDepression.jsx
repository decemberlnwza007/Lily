'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

import './../style/login.css'

export default function AssessForDespression() {
  const router = useRouter()
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
      color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    },
    {
      value: 1,
      label: 'มี',
      color: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    },
  ]

  const successAlert = (text, redirectPath) => {
    Swal.fire({
      icon: 'success',
      titleText: 'ทำแบบประเมินสำเร็จ',
      text: text,
      confirmButtonText: 'ตกลง',
      customClass: {
        confirmButton:
          'bg-green-300 hover:bg-green-400 text-green-900 font-bold py-2 px-4 rounded duration-500 cursor-pointer',
        popup: 'rounded-2xl',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && redirectPath) {
        router.push(redirectPath)
      }
    })
  }

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        const totalScore = Object.values(newAnswers).reduce(
          (sum, current) => sum + current,
          0
        )

        if (totalScore === 2) {
          successAlert(
            'คุณเป็นผู้มีความเสี่ยง หรือมีแนวโน้มที่จะเป็นโรคซึมเศร้ากดต่อไปเพื่อทำแบบประเมินต่อไป',
            '/estimate'
          )
        } else if (totalScore <= 1) {
          successAlert('ทำแบบประเมินสำเร็จ')
        }
      }
    }, 600)
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="h-full min-h-0 bg-gradient-to-br from-mint-50 to-emerald-50 p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-mint-50/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl"></div>

      <div className="w-full max-w-none px-6 lg:px-10 mb-8">
        <div className="bg-white rounded-full h-3 shadow-sm">
          <div
            className="bg-gradient-to-r from-mint-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <span>
            ข้อ {currentQuestion + 1} จาก {questions.length}
          </span>
          <span>{Math.round(progress)}% เสร็จสิ้น</span>
        </div>
      </div>

      <div className="w-full max-w-none px-6 lg:px-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-white to-mint-50/20">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-mint-100 text-mint-700 rounded-full text-sm font-medium">
                  กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของท่านมากที่สุด
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {questions[currentQuestion]}
                </h2>
              </div>
            </div>

            <div className="p-12 bg-gray-50/50 flex flex-col justify-center">
              <div className="space-y-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-6 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${option.color} ${answers[currentQuestion] === option.value
                        ? 'ring-4 ring-mint-300 scale-105'
                        : ''
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {/* <span className="text-2xl font-bold opacity-50">
                        {option.value}
                      </span> */}
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
            className="px-6 py-3 bg-white text-gray-600 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentQuestion
                    ? 'bg-mint-500 scale-125'
                    : answers[index] !== undefined
                      ? 'bg-mint-300'
                      : 'bg-gray-200'
                  }`}
              ></div>
            ))}
          </div>

          {/* ปุ่มช่วยเหลือหรือปุ่มถัดไป ถ้าต้องการเติมบอกได้นะ */}
        </div>
      </div>

      <style jsx>{`
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
        .focus\:ring-mint-300:focus {
          --tw-ring-color: #5eead4;
        }
        .focus\:border-mint-300:focus {
          border-color: #5eead4;
        }
        .from-mint-500 {
          --tw-gradient-from: #14b8a6;
        }
        .to-emerald-500 {
          --tw-gradient-to: #10b981;
        }
        .hover\:from-mint-600:hover {
          --tw-gradient-from: #0d9488;
        }
        .hover\:to-emerald-600:hover {
          --tw-gradient-to: #059669;
        }
        .hover\:text-mint-600:hover {
          color: #0d9488;
        }
        .hover\:text-mint-700:hover {
          color: #0f766e;
        }
        .bg-mint-50\/50 {
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
