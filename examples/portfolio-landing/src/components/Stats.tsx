import { motion } from 'framer-motion'

const stats = [
  { value: '20+', label: 'Years Experience' },
  { value: '95+', label: 'Projects Done' },
  { value: '200%', label: 'Satisfied Clients' },
]

export function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 divide-y divide-stroke border-t border-stroke sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-t-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center gap-2 px-6 py-10 text-center"
            >
              <span className="font-display text-5xl italic tabular-nums text-text-primary md:text-6xl">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
