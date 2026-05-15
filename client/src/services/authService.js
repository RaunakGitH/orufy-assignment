import API from "./api";

export const login = (emailOrPhone)=>{
    API.post('/auth/login',{emailOrPhone})
}
export const verifyOtp = (emailOrPhone,otp) => {
    API.post('/auth/verify-otp',{emailOrPhone, otp})

}