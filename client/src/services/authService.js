import API from "./api";

export const login = (emailOrPhone)=>{
   return API.post('/auth/login',{emailOrPhone})
}
export const verifyOtp = (emailOrPhone,otp) => {
  return  API.post('/auth/verify-otp',{emailOrPhone, otp})

}