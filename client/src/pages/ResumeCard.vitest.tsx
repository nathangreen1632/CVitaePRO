/** @jsxImportSource react */
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ResumeCard from './ResumeCard'

// Mock required props
const mockProps = {
  id: 'abc123',
  name: 'Jane Doe',
  resumeSnippet: '',
  summary: 'Experienced frontend developer skilled in React.',
  email: 'jane@example.com',
  phone: '123-456-7890',
  linkedin: 'https://linkedin.com/in/janedoe',
  portfolio: 'https://janedoe.dev',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  refreshResumes: vi.fn(),
}

describe('ResumeCard', () => {
  it('renders the name, email, and summary', () => {
    render(<ResumeCard {...mockProps} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText(/Email:/)).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Experienced frontend developer skilled in React.')).toBeInTheDocument()
  })
})
