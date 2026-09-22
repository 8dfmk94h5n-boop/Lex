import { useState } from 'react'
import { SectionHeader } from './SectionHeader'
import { GradientBorderButton } from './GradientBorderButton'
import { journalEntries, type JournalEntry } from '../data/content'

function JournalRow({ entry }: { entry: JournalEntry }) {
  const [imageOk, setImageOk] = useState(true)

  return (
    <a
      href="#journal"
      className="flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:bg-surface sm:rounded-full"
    >
      <div className="h-16 w-16 flex-none overflow-hidden rounded-full bg-stroke">
        {imageOk ? (
          <img
            src={entry.image}
            alt=""
            onError={() => setImageOk(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface to-stroke" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base text-text-primary md:text-lg">{entry.title}</h3>
        <p className="text-xs text-muted md:text-sm">
          {entry.date} &middot; {entry.readTime}
        </p>
      </div>
      <span aria-hidden="true" className="flex-none text-muted">
        &rarr;
      </span>
    </a>
  )
}

export function Journal() {
  return (
    <section id="journal" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          heading={
            <>
              Recent <span className="font-display italic">thoughts</span>
            </>
          }
          subtext="Notes on process, craft, and the business of making things."
          action={
            <GradientBorderButton as="a" href="#journal" className="hidden md:inline-flex">
              View all
              <span aria-hidden="true">&rarr;</span>
            </GradientBorderButton>
          }
        />

        <div className="flex flex-col gap-3">
          {journalEntries.map((entry) => (
            <JournalRow key={entry.title} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
