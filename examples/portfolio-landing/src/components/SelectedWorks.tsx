import { SectionHeader } from './SectionHeader'
import { ProjectCard } from './ProjectCard'
import { GradientBorderButton } from './GradientBorderButton'
import { projects } from '../data/content'

export function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          heading={
            <>
              Featured <span className="font-display italic">projects</span>
            </>
          }
          subtext="A selection of projects I've worked on, from concept to launch."
          action={
            <GradientBorderButton as="a" href="#work" className="hidden md:inline-flex">
              View all work
              <span aria-hidden="true">&rarr;</span>
            </GradientBorderButton>
          }
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
