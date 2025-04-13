import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Settings from "./Settings";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthContext } from "../context/AuthContext";

// Mock AuthContext
const mockUser = "testUser";
const mockToken = "mock-token";

const renderWithAuth = () => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: mockUser,
          token: mockToken,
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}
      >
        <Settings />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe("Settings Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", mockToken);
  });

  it("renders headings and user info", async () => {
    renderWithAuth();

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();

    const userInfoBlock = screen.getByText("Username:").closest("p");
    expect(userInfoBlock).toBeInTheDocument();
    expect(userInfoBlock?.textContent).toContain(`Username: ${mockUser}`);
  });

  it("shows validation error if passwords don't match", async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpass123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "notmatching" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/New passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("handles successful password change", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Password updated successfully." }),
    } as Response);

    renderWithAuth();

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "newpass123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "newpass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
    });
  });

  it("displays error from API response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid current password" }),
    } as Response);

    renderWithAuth();

    fireEvent.change(screen.getByLabelText("Current Password"), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "new" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "new" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to change password/i)).toBeInTheDocument();
    });
  });


  it("toggles password visibility", async () => {
    renderWithAuth();

    const currentInput = screen.getByLabelText("Current Password") as HTMLInputElement;
    const newInput = screen.getByLabelText("New Password") as HTMLInputElement;
    const confirmInput = screen.getByLabelText("Confirm New Password") as HTMLInputElement;

    expect(currentInput.type).toBe("password");
    expect(newInput.type).toBe("password");
    expect(confirmInput.type).toBe("password");

    const toggleButtons = screen.getAllByRole("button", { name: "Show" });
    toggleButtons.forEach((btn) => fireEvent.click(btn));

    expect(currentInput.type).toBe("text");
    expect(newInput.type).toBe("text");
    expect(confirmInput.type).toBe("text");
  });
});
