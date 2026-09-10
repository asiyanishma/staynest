const categoryIcons = {
  All: '✨',
  Beachfront: '🏖️',
  Cabins: '🏡',
  Design: '✨',
  City: '🌆',
  Countryside: '🌿',
  Pools: '🏊',
  Trending: '🔥',
}

export default function FilterChips({ categories, active, onSelect }) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-7 overflow-x-auto no-scrollbar py-5">
          {categories.map((cat) => {
            const isActive = cat === active

            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={
                  'group shrink-0 flex flex-col items-center gap-2 pb-2 text-sm transition-all ' +
                  (isActive
                    ? 'text-pine font-semibold'
                    : 'text-slate-500 hover:text-slate-900')
                }
              >
                <span
                  className={
                    'text-xl transition-transform group-hover:-translate-y-0.5 ' +
                    (isActive ? 'scale-110' : '')
                  }
                >
                  {categoryIcons[cat] || '🏠'}
                </span>

                <span>{cat}</span>

                <span
                  className={
                    'h-0.5 rounded-full transition-all ' +
                    (isActive
                      ? 'w-8 bg-pine'
                      : 'w-0 bg-slate-300 group-hover:w-4')
                  }
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}