import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.ts'
import Login from './Login'

// ⛔ Mock react-router's navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

// ⛔ Mock the useAuth hook
vi.mock('../hooks/useAuth.js', () => ({
  useAuth: vi.fn()
}))

describe('Login Component', () => {
  const mockLogin = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // ✅ Mock full AuthContextType
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      token: null,
      user: null,
      register: vi.fn(),
      logout: vi.fn(),
    })

    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('renders the form fields and submits with user input', async () => {
    mockLogin.mockResolvedValue(true)

    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123')
    })
  })

  it('shows error message if login fails', async () => {
    mockLogin.mockResolvedValue(false)

    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wrong' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrong' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('navigates to /dashboard if token exists', async () => {
    // ✅ Simulate already logged-in user
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      token: 'mock-token',
      user: 'jane', // or null
      register: vi.fn(),
      logout: vi.fn(),
    })

    render(<Login />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})
