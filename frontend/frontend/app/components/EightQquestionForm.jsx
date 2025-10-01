'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

import './../style/login.css'

export default function EightQquestionForm() {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})

    const questions = [
        {
            question: 'คิดอยากตาย หรือ คิดว่าตายไปจะดีกว่า',
            no: 0,
            yes: 1,
        },
        {
            question: 'อยากทำร้ายตัวเอง หรือ ทำให้ตัวเองบาดเจ็บ',
            no: 0,
            yes: 2,
        },
        {
            question: 'คิดเกี่ยวกับการฆ่าตัวตาย',
            no: 0,
            yes: 6,
        },
        {
            question: 'ท่านสามารถควบคุมความอยากฆ่าตัวตายที่ท่านคิดอยู่นั้นได้หรือไม่ หรือบอกได้ไหมว่าคงจะไม่ทำตามความคิดนั้นในขณะนี้',
            no: 0,
            yes: 8,
            conditional: true, 
        },
        {
            question: 'มีแผนการที่จะฆ่าตัวตาย',
            no: 0,
            yes: 8,
        },
        {
            question: 'ได้เตรียมการที่จะทำร้ายตนเองหรือเตรียมการจะฆ่าตัวตายโดยตั้งใจว่าจะให้ตายจริง ๆ',
            no: 0,
            yes: 9,
        },
        {
            question: 'ได้ทำให้ตนเองบาดเจ็บแต่ไม่ตั้งใจที่จะทำให้เสียชีวิต',
            no: 0,
            yes: 4,
        },
        {
            question: 'ได้พยายามฆ่าตัวตายโดยคาดหวัง/ตั้งใจที่จะให้ตาย',
            no: 0,
            yes: 10,
        },
        {
            question: 'ตลอดชีวิตที่ผ่านมา ท่านเคยพยายามฆ่าตัวตาย',
            no: 0,
            yes: 4,
        },
    ]

    const options = [
        { label: 'ไม่มี', valueKey: 'no', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
        { label: 'มี', valueKey: 'yes', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    ]

    const handleAnswer = (valueKey) => {
        const question = questions[currentQuestion]
        const value = question[valueKey]
        const newAnswers = { ...answers, [currentQuestion]: value }
        setAnswers(newAnswers)

        setTimeout(() => {
            let nextQuestionIndex = currentQuestion + 1

            if (
                question.conditional !== true && 
                currentQuestion === 2 &&
                valueKey === 'yes'
            ) {
                nextQuestionIndex = 3
            }
            else if (
                currentQuestion === 3 &&
                questions[3].conditional === true
            ) {
                nextQuestionIndex = 4
            }
            else if (
                currentQuestion === 2 &&
                valueKey === 'no'
            ) {
                nextQuestionIndex = 4
            }
            else {
                nextQuestionIndex = currentQuestion + 1
            }

            if (nextQuestionIndex >= questions.length) {
                const totalScore = Object.values(newAnswers).reduce((sum, val) => sum + val, 0)

                let resultText = ''
                if (totalScore === 0) {
                    resultText = 'ไม่มีแนวโน้มฆ่าตัวตายในปัจจุบัน'
                } else if (totalScore >= 1 && totalScore <= 8) {
                    resultText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับน้อย'
                } else if (totalScore >= 9 && totalScore <= 16) {
                    resultText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับปานกลาง'
                } else if (totalScore >= 17) {
                    resultText = 'มีแนวโน้มที่จะฆ่าตัวตายในปัจจุบัน ระดับรุนแรง\nคุณสามารถติดต่อสายด่วนสุขภาพจิต 1323 ได้ตลอด 24 ชั่วโมงเพื่อรับคำปรึกษา'
                }

                Swal.fire({
                    icon: 'info',
                    title: 'การประเมินเสร็จสิ้น',
                    html: `<pre class="whitespace-pre-line">คะแนนรวม: ${totalScore}\n\n${resultText}</pre>`,
                    confirmButtonText: 'รับทราบ',
                    customClass: {
                        confirmButton: 'bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer',
                        popup: 'rounded-xl p-6',
                    },
                    buttonsStyling: false,
                }).then(() => {
                    router.push('/')
                })
            } else {
                setCurrentQuestion(nextQuestionIndex)
            }
        }, 300)

    }

    const goToPrevious = () => {
        if (currentQuestion === 4 && answers[2] === 0) {
            setCurrentQuestion(2)
        } else if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-50 to-emerald-50 p-4 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-mint-50/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto mb-8">
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

            <div className="w-full max-w-none px-6 lg:px-10 mb-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                        <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-white to-mint-50/20">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-2 bg-mint-100 text-mint-700 rounded-full text-sm font-medium">
                                    ในช่วง 1 เดือนที่ผ่านมารวมทั้งวันนี้
                                </div>

                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {questions[currentQuestion].question}
                                </h2>

                                <p className="text-gray-600 text-lg">
                                    กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของท่านมากที่สุด
                                </p>
                            </div>
                        </div>

                        <div className="p-12 bg-gray-50/50 flex flex-col justify-center">
                            <div className="space-y-4">
                                {options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(option.valueKey)}
                                        className={`w-full p-6 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${option.color
                                            } ${answers[currentQuestion] === questions[currentQuestion][option.valueKey]
                                                ? 'ring-4 ring-mint-300 scale-105'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option.label}</span>
                                            <span className="text-2xl font-bold opacity-50">
                                                {questions[currentQuestion][option.valueKey]}
                                            </span>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ย้อนกลับ
                    </button>

                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentQuestion
                                        ? 'bg-mint-500 scale-125'
                                        : answers[i] !== undefined
                                            ? 'bg-mint-300'
                                            : 'bg-gray-200'
                                    }`}
                            ></div>
                        ))}
                    </div>
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
