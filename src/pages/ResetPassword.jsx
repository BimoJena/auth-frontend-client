import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'


const ResetPassword = () => {

  const { backend_url } = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);



  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value >= 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (e.target.value !== "") {
        e.target.value = "";
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true)
    try {
      const { data } = await axios.post(backend_url + '/api/auth/send-resetPaswword-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)

    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setEmailLoading(false)
    }
  }

  // const onSubmitOtp = async (e) => {
  //   e.preventDefault()
  //   const otpArray = inputRefs.current.map(e => e.value)
  //   setOtp(otpArray.join(''))
  //   setIsOtpSubmitted(true)
  // }

  const onSubmitOtp = (e) => {
    e.preventDefault();
    setOtpLoading(true)

    const otpValue = inputRefs.current
      .map(input => input?.value)
      .join('');

    if (otpValue.length !== 6) {
      toast.error("Please enter valid OTP");
      setOtpLoading(false)
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
    setOtpLoading(false)
  };

  // const onSubmitNewPassword = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const { data } = await axios.post(backend_url + '/api/auth/reset-password', { email, otp, newpassword })
  //     data.success ? toast.success(data.message) : toast.error(data.message)
  //     data.success && navigate('/login')
  //   } catch (err) {
  //     const message = err.response?.data?.message || "Something went wrong";
  //     toast.error(message);
  //   }
  // }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true)

    if (!email || !otp || !newPassword) {
      toast.error("All fields are required");
      setPasswordLoading(false)
      return;
    }

    try {
      const { data } = await axios.post(
        backend_url + '/api/auth/reset-password',
        { email, otp, newPassword }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false)
    }
  };

  return (

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      {/* enter email id */}

      {!isEmailSent &&

        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Email id' className='bg-transparent outline-none w-full text-gray-300' value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {/* <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'>Submit</button> */}

          <button
            disabled={emailLoading}
            className={`w-full py-2.5 rounded-full mt-3 text-white
            ${emailLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900'
              }`}
          >
            {emailLoading ? 'Processing...' : 'Submit'}
          </button>


        </form>

      }

      {/* otp enter form */}

      {!isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required
                className='w-10 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {/* <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>Submit</button> */}

          <button
            disabled={otpLoading}
            className={`w-full py-2.5 rounded-full text-white
            ${otpLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900'
              }`}
          >
            {otpLoading ? 'Verifying...' : 'Submit'}
          </button>


        </form>

      }

      {/* enter new password form */}

      {isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='password' className='bg-transparent outline-none w-full text-gray-300' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>

          {/* <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'>Submit</button> */}

          <button
            disabled={passwordLoading}
            className={`w-full py-2.5 rounded-full mt-3 text-white
            ${passwordLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900'
              }`}
          >
            {passwordLoading ? 'Updating...' : 'Submit'}
          </button>
        </form>

      }

    </div>
  )
}

export default ResetPassword