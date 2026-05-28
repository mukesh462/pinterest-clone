import { useState } from "react";

/* ─────────────────────────────────────────
   AUTH MODAL
   Props:
     isOpen       — bool
     onClose      — fn()
     onLogin      — fn({ email, password })
     onRegister   — fn({ name, email, password, birthdate })
     defaultTab   — "login" | "register"
     loading      — bool
     error        — string | null
   ───────────────────────────────────────── */

const EyeIcon = ({ show }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    {show ? (
      <>
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <>
        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function InputField({ label, type = "text", value, onChange, placeholder, autoComplete, rightElement }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none text-sm text-gray-900 placeholder-gray-400 transition-all"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  defaultTab = "login",
  loading = false,
  error = null,
}) {
  const [tab, setTab] = useState(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", birthdate: "",
  });

  if (!isOpen) return null;

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "login") {
      onLogin?.({ email: form.email, password: form.password });
    } else {
      onRegister?.({ name: form.name, email: form.email, password: form.password, birthdate: form.birthdate });
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-8">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#E60023">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            {tab === "login" ? "Welcome back" : "Get started for free"}
          </h1>
          <p className="text-sm text-center text-gray-500 mb-6">
            {tab === "login" ? "Log in to see more ideas" : "Find new ideas to try"}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <InputField
                label="Full name"
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                autoComplete="name"
              />
            )}
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Email"
              autoComplete="email"
            />
            <InputField
              label="Password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Create a strong password"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon show={showPw} />
                </button>
              }
            />
            {tab === "register" && (
              <InputField
                label="Birthday"
                type="date"
                value={form.birthdate}
                onChange={set("birthdate")}
                autoComplete="bday"
              />
            )}

            {tab === "login" && (
              <div className="text-right">
                <a href="/forgot-password" className="text-xs text-gray-600 hover:text-gray-900 underline underline-offset-2">
                  Forgot your password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : tab === "login"
                ? "Log in"
                : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google SSO */}
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Tab switch */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {tab === "login" ? "Not on Pinterest yet? " : "Already a member? "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              className="font-semibold text-gray-900 hover:underline underline-offset-2"
            >
              {tab === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

          {tab === "register" && (
            <p className="mt-3 text-center text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to Pinterest's{" "}
              <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/*
USAGE:

const [modal, setModal] = useState(null); // "login" | "register" | null
const [authError, setAuthError] = useState(null);
const [loading, setLoading] = useState(false);

<AuthModal
  isOpen={!!modal}
  defaultTab={modal || "login"}
  onClose={() => setModal(null)}
  loading={loading}
  error={authError}
  onLogin={async ({ email, password }) => {
    setLoading(true);
    try { await loginUser(email, password); setModal(null); }
    catch (e) { setAuthError(e.message); }
    finally { setLoading(false); }
  }}
  onRegister={async (data) => {
    setLoading(true);
    try { await registerUser(data); setModal(null); }
    catch (e) { setAuthError(e.message); }
    finally { setLoading(false); }
  }}
/>
*/
