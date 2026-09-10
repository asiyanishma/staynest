import { useEffect, useState } from 'react'

export default function HostDashboard({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    category: 'City',
    price: '',
    image: '',
    tags: '',
  })

  const [myListings, setMyListings] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const loadMyListings = async () => {
    const token = localStorage.getItem('staynestToken')

    if (!token) return

    try {
      const response = await fetch(
        'http://localhost:5000/api/host/listings',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMyListings(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadMyListings()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('staynestToken')

    if (!token) {
      setMessage('Please login first.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/host/listings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            tags: form.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to create listing')
        return
      }

      setMessage('Listing published successfully! 🎉')

      setForm({
        title: '',
        location: '',
        category: 'City',
        price: '',
        image: '',
        tags: '',
      })

      await loadMyListings()
    } catch (error) {
      console.error(error)
      setMessage('Cannot connect to StayNest server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">

          <div>
            <p className="text-sm font-semibold text-pine">
              Host Dashboard
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Share your place
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Add a property and make it available on StayNest.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50"
          >
            Back
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Add listing */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">

            <h2 className="text-xl font-bold text-slate-900">
              Add a new property
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Property title"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location e.g. Dubai, UAE"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine bg-white"
              >
                <option>City</option>
                <option>Beachfront</option>
                <option>Cabins</option>
                <option>Design</option>
                <option>Countryside</option>
                <option>Pools</option>
                <option>Trending</option>
              </select>

              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="Price per night (AED)"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags e.g. Wifi, Pool, Kitchen"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-pine"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pine text-white py-3.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? 'Publishing...'
                  : 'Publish listing'}
              </button>

            </form>

            {message && (
              <p className="text-sm text-center text-slate-600 mt-4">
                {message}
              </p>
            )}

          </div>

          {/* My listings */}
          <div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              My listings
            </h2>

            {myListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
                <div className="text-4xl">🏡</div>

                <p className="text-sm text-slate-500 mt-3">
                  You haven't published any properties yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {myListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                  >

                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5">

                      <h3 className="font-bold text-slate-900">
                        {listing.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {listing.location}
                      </p>

                      <p className="text-pine font-bold mt-3">
                        AED {listing.price}
                        <span className="text-sm text-slate-400 font-normal">
                          {' '} / night
                        </span>
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  )
}