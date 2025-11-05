
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'], // Pretendard 폰트 추가
      },
      colors: {
        'kdsa-blue': '#3478F6', // 제안된 Primary Color (토스 블루 계열)
        'kdsa-light-gray': '#F0F4F8', // 제안된 Secondary Color (사용하지 않더라도 정의해두면 좋음)
        'kdsa-text-dark': '#333333', // 제안된 Text Color
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up-delay-100': 'fadeInUp 0.8s ease-out forwards 0.1s',
        'fade-in-up-delay-300': 'fadeInUp 0.8s ease-out forwards 0.3s',
        'fade-in-delay-200': 'fadeIn 1s ease-out forwards 0.2s',
      }
    },
  },
  plugins: [],
}

