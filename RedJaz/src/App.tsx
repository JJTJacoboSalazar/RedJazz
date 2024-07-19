import './globals.css'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <main className='Flex h-screen'>
      <Routes>
        {/* Public routes */}
        <Route path='/sign-in' element={<SigninForm />} />

        {/* Private routes */}
        <Route index element={<Home />} />
      </Routes>
    </main>
  )
}

export default App