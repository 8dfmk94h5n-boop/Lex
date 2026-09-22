import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import './App.css'

const cards = [
  {
    title: 'Entrance animation',
    body: 'Cards fade and rise into view on load, staggered 100ms apart.',
  },
  {
    title: 'Hover microinteraction',
    body: 'Hover any card for a 300ms scale + lift, matching the Motion-Driven style spec.',
  },
  {
    title: 'Scroll-linked motion',
    body: 'The hero title below scales and fades as you scroll, driven by useScroll.',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  return (
    <section ref={ref} className="hero">
      <motion.h1 style={{ scale, opacity }}>Motion-Driven UI</motion.h1>
      <p>
        A minimal framer-motion demo for the{' '}
        <code>ui-ux-pro-max</code> design database's "Motion-Driven" style.
      </p>
    </section>
  )
}

function Cards() {
  return (
    <motion.section
      className="cards"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {cards.map((card) => (
        <motion.article
          key={card.title}
          className="card"
          variants={item}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <h2>{card.title}</h2>
          <p>{card.body}</p>
        </motion.article>
      ))}
    </motion.section>
  )
}

function App() {
  return (
    <>
      <Hero />
      <Cards />
    </>
  )
}

export default App
