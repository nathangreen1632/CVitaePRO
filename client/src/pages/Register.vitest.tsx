import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.ts'
import Register from './Register'

// ✅ Mock react-router navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

// ✅ Mock useAuth hook
vi.mock('../hooks/useAuth.js', () => ({
  useAuth: vi.fn()
}))

// ✅ Mock LegalAgreementModal to skip modal interaction
vi.mock('../components/agreements/LegalAgreementModal.tsx', () => ({
  __esModule: true,
  default: ({ onComplete }: { onComplete: () => void }) => {
    React.useEffect(() => {
      onComplete() // ✅ Run after render
    }, [])

    return null
  }
}))


describe('Register Component', () => {
  const mockRegister = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // ✅ Return full context shape
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      register: mockRegister,
      token: null,
      user: null
    })

    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    // ✅ Mock fetch for legal agreement POSTs
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({}), { status: 200 }))
    ) as typeof fetch
  })

  it('renders all form fields after modal agreement', async () => {
    render(<Register />)

    expect(await screen.findByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    render(<Register />)

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'abc123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'mismatch' }
    })

    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('registers and navigates to login on success', async () => {
    mockRegister.mockResolvedValue({
      success: true,
      token: 'mock-token'
    })

    render(<Register />)

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'abc123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'abc123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    // ✅ Confirm agreements sent
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(4)
    })

    // ✅ Confirm redirect
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('shows error if registration fails', async () => {
    mockRegister.mockResolvedValue({
      success: false,
      token: null
    })

    render(<Register />)

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'existinguser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'abc123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'abc123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument()
  })
})
