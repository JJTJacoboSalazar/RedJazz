import AuthLayout from './_auth/AuthLayout'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { Home } from './_root/pages'
import './globals.css'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <main className='Flex h-screen'>
      <Routes>
        {/* Public routes */}
        <Route>
          <Route element={<AuthLayout />}>
        <Route path='/sign-in' element={<SigninForm />} />
        <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/* Private routes */}
        <Route index element={<Home />} />
      </Routes>
    </main>
  )
}

export default App