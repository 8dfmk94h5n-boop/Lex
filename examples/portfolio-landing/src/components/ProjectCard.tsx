import { useState } from 'react'
import type { Project } from '../data/content'

export function ProjectCard({ project }: { project: Project }) {
  const [imageOk, setImageOk] = useState(true)

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface ${project.span} ${project.aspect}`}
    >
      {imageOk ? (
        <img
          src={project.image}
          alt={project.title}
          onError={() => setImageOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-stroke" />
      )}

      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
        <span className="group relative inline-flex rounded-full">
          <span className="accent-gradient-animated absolute -inset-[2px] rounded-full" />
          <span className="relative rounded-full bg-white px-6 py-3 text-sm text-black">
            View &mdash; <span className="font-display italic">{project.title}</span>
          </span>
        </span>
      </div>

      <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-white/80 transition-opacity duration-300 group-hover:opacity-0">
        {project.category}
      </div>
    </article>
  )
}
