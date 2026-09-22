export interface Project {
  title: string
  category: string
  image: string
  span: string
  aspect: string
}

export const projects: Project[] = [
  {
    title: 'Automotive Motion',
    category: 'Motion Design',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    title: 'Urban Architecture',
    category: 'Photography',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Human Perspective',
    category: 'Portraiture',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Brand Identity',
    category: 'Branding',
    image:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80&auto=format&fit=crop',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
]

export interface JournalEntry {
  title: string
  image: string
  readTime: string
  date: string
}

export const journalEntries: JournalEntry[] = [
  {
    title: 'Designing motion systems that scale',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80&auto=format&fit=crop',
    readTime: '6 min read',
    date: 'Jan 2026',
  },
  {
    title: 'A quieter approach to interface sound',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80&auto=format&fit=crop',
    readTime: '4 min read',
    date: 'Dec 2025',
  },
  {
    title: 'Notes from a year of freelance work',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&auto=format&fit=crop',
    readTime: '9 min read',
    date: 'Nov 2025',
  },
  {
    title: 'Why constraints make better products',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'Oct 2025',
  },
]

export interface GalleryItem {
  image: string
  rotation: number
}

export const galleryColumnA: GalleryItem[] = [
  {
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80&auto=format&fit=crop',
    rotation: -4,
  },
  {
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80&auto=format&fit=crop',
    rotation: 3,
  },
  {
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop',
    rotation: -2,
  },
]

export const galleryColumnB: GalleryItem[] = [
  {
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80&auto=format&fit=crop',
    rotation: 4,
  },
  {
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop',
    rotation: -3,
  },
  {
    image:
      'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80&auto=format&fit=crop',
    rotation: 2,
  },
]

export const heroRoles = ['Creative', 'Fullstack', 'Founder', 'Scholar']

export const loadingWords = ['Design', 'Create', 'Inspire']

export const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Work', href: '/#work' },
  { label: 'Resume', href: '/resume' },
]

export const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
  { label: 'GitHub', href: 'https://github.com' },
]

export const HLS_SRC =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'
