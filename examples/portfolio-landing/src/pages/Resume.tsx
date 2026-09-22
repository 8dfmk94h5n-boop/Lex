import { motion } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { GradientBorderButton } from '../components/GradientBorderButton'
import { experience, skills, education } from '../data/resume'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
}

export default function Resume() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-[900px] px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <motion.header {...fadeUp} className="mb-16">
          <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-muted">Resume</span>
          <h1 className="mb-4 font-display text-5xl italic text-text-primary md:text-7xl">
            Michael Smith
          </h1>
          <p className="max-w-lg text-sm text-muted md:text-base">
            Creative developer and designer based in Chicago, building interfaces that feel as
            good as they look.
          </p>
          <div className="mt-8">
            <GradientBorderButton as="a" href="mailto:hello@michaelsmith.com">
              Get in touch
              <span aria-hidden="true">&rarr;</span>
            </GradientBorderButton>
          </div>
        </motion.header>

        <motion.section {...fadeUp} className="mb-16">
          <h2 className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">Experience</h2>
          <div className="flex flex-col gap-8">
            {experience.map((job) => (
              <div key={job.role} className="border-t border-stroke pt-6">
                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="text-lg text-text-primary md:text-xl">
                    {job.role} &middot; <span className="text-muted">{job.org}</span>
                  </h3>
                  <span className="text-xs uppercase tracking-[0.15em] text-muted">
                    {job.period}
                  </span>
                </div>
                <p className="max-w-2xl text-sm text-muted">{job.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp} className="mb-16">
          <h2 className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-stroke px-4 py-2 text-sm text-text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp}>
          <h2 className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">Education</h2>
          {education.map((item) => (
            <div key={item.school} className="border-t border-stroke pt-6">
              <h3 className="text-lg text-text-primary md:text-xl">{item.school}</h3>
              <p className="text-sm text-muted">
                {item.degree} &middot; {item.period}
              </p>
            </div>
          ))}
        </motion.section>
      </main>
    </>
  )
}
