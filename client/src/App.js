import {BrowserRouter , Routes , Route , Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {AuthProvider} from './context/authContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Login from './pages/Auth/Login'
import OTP from './pages/Auth/OTP'
import Products from './pages/Products/Products'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
    return(
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                position='bottom-right'
                toastOptions={{
                    success:{duration:3000},
                    error:{duration:4000}
                }}
                />
                <Routes>
                    <Route path='/login' element={<Login />}/>
                    <Route path='/otp' element={<OTP />} />

                    <Route path='/dashboard' element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                        } 
                    />
                    < Route path='/products' element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                     />
                    <Route path='/' element={
                        <Navigate to='/dashboard' replace />
                    }
                    />
                    <Route path='*' element={
                        <Navigate to='/dashboard' replace />
                    }
                    />



                </Routes>
                
            </BrowserRouter>
        </AuthProvider>
    )
}
export default App;