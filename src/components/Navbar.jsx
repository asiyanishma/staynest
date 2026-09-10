import { useState } from 'react'
import {
  Search,
  CircleUserRound,
  Menu,
  Globe2,
  X,
  CalendarDays,
  LogOut,
} from 'lucide-react'

export default function Navbar({
  query,
  onQueryChange,
  onBecomeHost,
}) {
  const [showAuth, setShowAuth] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('staynestUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const endpoint = isSignup
        ? `${import.meta.env.VITE_API_URL}/api/auth/signup`
        : `${import.meta.env.VITE_API_URL}/api/auth/login`

      const body = isSignup
        ? { name, email, password }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Something went wrong')
        return
      }

      if (!isSignup) {
        localStorage.setItem('staynestToken', data.token)
        localStorage.setItem(
          'staynestUser',
          JSON.stringify(data.user)
        )

        setUser(data.user)
        setShowAuth(false)
        setMessage('')
      } else {
        setMessage('Signup successful!')

        setTimeout(() => {
          setIsSignup(false)
          setMessage('')
          setName('')
          setEmail('')
          setPassword('')
        }, 1000)
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setMessage('Cannot connect to StayNest server')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowAuth(false)
    setMessage('')
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleLogout = () => {
    localStorage.removeItem('staynestToken')
    localStorage.removeItem('staynestUser')
    setUser(null)
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2 min-w-fit">
              <div className="w-9 h-9 rounded-xl bg-pine flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  S
                </span>
              </div>

              <span className="text-2xl font-bold tracking-tight text-pine">
                StayNest
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center w-full max-w-xl bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">

                <div className="flex-1 px-5 py-3">

                  <p className="text-xs font-semibold text-slate-800">
                    Where
                  </p>

                  <input
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search destinations"
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  />

                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-200" />

                <div className="hidden sm:block px-5 py-3">

                  <p className="text-xs font-semibold text-slate-800">
                    When
                  </p>

                  <p className="text-sm text-slate-400">
                    Add dates
                  </p>

                </div>

                <button className="mr-2 w-11 h-11 rounded-full bg-pine flex items-center justify-center hover:scale-105 transition-transform">
                  <Search size={18} className="text-white" />
                </button>

              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 min-w-fit">

              {/* Become a host */}
              <button
                onClick={onBecomeHost}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">
                  Become a host
                </span>
              </button>

              {/* Globe */}
              <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
                <Globe2
                  size={18}
                  className="text-slate-700"
                />
              </button>

              {/* User */}
              {user ? (
                <div className="relative group">

                  <button className="flex items-center gap-2 border border-slate-200 rounded-full pl-3 pr-2 py-2 hover:shadow-md transition-shadow bg-white">

                    <Menu
                      size={17}
                      className="text-slate-700"
                    />

                    <CircleUserRound
                      size={27}
                      className="text-slate-600"
                    />

                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-28 truncate">
                      {user.name}
                    </span>

                  </button>

                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 hidden group-hover:block">

                    <div className="px-4 py-3 border-b border-slate-100">

                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1 break-all">
                        {user.email}
                      </p>

                    </div>

                    <button
                      onClick={() => {
                        document
                          .getElementById('my-bookings')
                          ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <CalendarDays size={18} />
                      <span>My Bookings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>

                  </div>

                </div>
              ) : (

                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 border border-slate-200 rounded-full pl-3 pr-2 py-2 hover:shadow-md transition-shadow bg-white"
                >
                  <Menu
                    size={17}
                    className="text-slate-700"
                  />

                  <CircleUserRound
                    size={27}
                    className="text-slate-600"
                  />
                </button>

              )}

            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">

            <div className="flex items-center gap-3 border border-slate-200 rounded-full px-4 py-3 shadow-sm bg-white">

              <Search
                size={18}
                className="text-slate-500"
              />

              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Where do you want to stay?"
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />

            </div>

          </div>

        </div>
      </header>

      {/* Login / Signup Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isSignup
                ? 'Create your StayNest account'
                : 'Welcome to StayNest'}
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              {isSignup
                ? 'Sign up to start booking your stays.'
                : 'Login to continue to your account.'}
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {isSignup && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pine text-white rounded-xl py-3 font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? 'Please wait...'
                  : isSignup
                    ? 'Sign up'
                    : 'Login'}
              </button>

            </form>

            {message && (
              <p className="text-sm text-center mt-4 text-slate-600">
                {message}
              </p>
            )}

            <div className="text-center mt-5">

              <button
                onClick={() => {
                  setIsSignup(!isSignup)
                  setMessage('')
                  setPassword('')
                }}
                className="text-sm text-pine font-semibold hover:underline"
              >
                {isSignup
                  ? 'Already have an account? Login'
                  : "Don't have an account? Sign up"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}