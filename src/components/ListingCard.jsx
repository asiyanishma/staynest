import { useState } from 'react'
import { Heart, Star, BadgeCheck } from 'lucide-react'

export default function ListingCard({ listing, onOpen }) {
  const [saved, setSaved] = useState(false)

  const isGuestFavorite = listing.rating >= 4.9

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onOpen(listing)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">

        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Soft image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />

        {/* Guest favorite badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <BadgeCheck size={14} className="text-pine" />
            <span className="text-xs font-semibold text-slate-800">
              Guest favorite
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSaved(!saved)
          }}
          aria-label={saved ? 'Remove from favorites' : 'Save listing'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={19}
            className={
              saved
                ? 'fill-clay text-clay'
                : 'text-slate-700'
            }
          />
        </button>
      </div>

      {/* Details */}
      <div className="pt-3">

        {/* Title + rating */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-slate-800 leading-snug truncate">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0 text-sm text-slate-700">
            <Star
              size={14}
              className="fill-slate-800 text-slate-800"
            />
            <span>{listing.rating}</span>
          </div>
        </div>

        {/* Location */}
        <p className="mt-1 text-sm text-slate-500 truncate">
          {listing.location}
        </p>

        {/* Price */}
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">
            AED {listing.price}
          </span>{' '}
          night
        </p>

      </div>
    </div>
  )
}