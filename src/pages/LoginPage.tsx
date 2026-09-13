import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Archive,
  User,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, quickLogin, logout } = useAuth();

  // State for role tab: "user" | "institution"
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Where to redirect after login (default home)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
  };

  const handleQuickFill = (targetUser: "John_doe" | "DAIT") => {
    if (targetUser === "John_doe") {
      setSelectedRole("user");
      setUsername("John_doe");
      setPassword("password123");
    } else {
      setSelectedRole("institution");
      setUsername("DAIT");
      setPassword("password123");
    }
    setErrorMsg(null);
  };

  const handleOneClickLogin = (targetUser: "John_doe" | "DAIT") => {
    quickLogin(targetUser);
    setSuccessMsg(`Authenticated successfully as ${targetUser}`);
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim()) {
      setErrorMsg("Please enter your username.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password, selectedRole);
      if (result.success && result.user) {
        setSuccessMsg(`Welcome back, ${result.user.name}!`);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 700);
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 archival-texture">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Archival Badge Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md mb-4 group hover:scale-105 transition-transform">
          <Archive className="w-7 h-7" />
        </div>
        
        <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--foreground)]">
          Archive Portal Login
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Sign in to access digital manuscripts, speeches, and institutional archival tools.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* If already authenticated, show state & quick actions */}
        {isAuthenticated && user ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-md p-6 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center mx-auto text-xl font-bold font-mono">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] mb-2">
                {user.role === "institution" ? <Building2 className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                {user.roleLabel}
              </div>
              <h3 className="text-lg font-display font-semibold">{user.name}</h3>
              <p className="text-xs text-[var(--muted-foreground)] font-mono">@{user.username} • {user.email}</p>
              {user.organization && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{user.organization}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/"
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent rounded-sm text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 transition-opacity shadow-xs"
              >
                Return to Archive Home
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out / Switch User
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-md shadow-md overflow-hidden">
            {/* Quick Demo Access Bar */}
            <div className="bg-[var(--muted)]/50 p-3 border-b border-[var(--border)] text-xs text-center">
              <div className="flex items-center justify-center gap-1 text-[var(--muted-foreground)] font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>DEMO ACCOUNTS (1-CLICK TEST LOGIN)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOneClickLogin("John_doe")}
                  className="px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-left group"
                >
                  <div className="font-semibold text-xs text-[var(--foreground)] flex items-center justify-between">
                    <span>1. John_doe</span>
                    <span className="text-[10px] uppercase font-mono px-1 rounded bg-[var(--primary)]/15 text-[var(--primary)]">User</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] truncate">Researcher Account</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOneClickLogin("DAIT")}
                  className="px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-left group"
                >
                  <div className="font-semibold text-xs text-[var(--foreground)] flex items-center justify-between">
                    <span>2. DAIT</span>
                    <span className="text-[10px] uppercase font-mono px-1 rounded bg-[var(--primary)]/15 text-[var(--primary)]">Inst.</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] truncate">Institution Portal</div>
                </button>
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--background)]">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  selectedRole === "user"
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--card)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/40"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Researcher / Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("institution")}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  selectedRole === "institution"
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--card)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/40"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Institution Portal
              </button>
            </div>

            <div className="p-6">
              {/* Context Banner based on Role */}
              <div className="mb-5 p-3 rounded bg-[var(--muted)]/30 border border-[var(--border)] flex items-start gap-2.5">
                {selectedRole === "user" ? (
                  <>
                    <User className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[var(--muted-foreground)]">
                      <strong>Researcher / Student Login:</strong> Access full historical texts, personal research notes, and citation management.
                    </div>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[var(--muted-foreground)]">
                      <strong>Institution Portal Login:</strong> Upload archival records, verify artifact provenance, and catalog digital heritage.
                    </div>
                  </>
                )}
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message Alert */}
              {successMsg && (
                <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Main Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={selectedRole === "user" ? "e.g. John_doe" : "e.g. DAIT"}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-sm bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]/60"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-sm rounded-sm bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]/60"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-[var(--muted-foreground)] cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span>Remember session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(selectedRole === "user" ? "John_doe" : "DAIT")}
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    Auto-fill credentials
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 border border-transparent rounded-sm text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--primary-foreground)] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Sign In as {selectedRole === "user" ? "Researcher" : "Institution"}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)] space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SECURE DIGITAL ARCHIVE SYSTEM</span>
                </div>
                <p>Sample Credentials: <code className="font-mono bg-[var(--muted)] px-1 rounded">John_doe</code> or <code className="font-mono bg-[var(--muted)] px-1 rounded">DAIT</code> (Password: <code className="font-mono bg-[var(--muted)] px-1 rounded">password123</code>)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
