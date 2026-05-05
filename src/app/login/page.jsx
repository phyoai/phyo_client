"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";
import { useAuth } from "../context/AuthContext";
import { ForgotPasswordCard } from "../forgot-password/page";
import { authUtils } from "../../utils/api";
import "react-toastify/dist/ReactToastify.css";

const formFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    validation: { required: "Password is required" },
  },
];

const welcomeCopy =
  "It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing.";

const loginCopy =
  "It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages.";

const checkboxCopy =
  "The Banking And Finance Industry Is At The Forefront Of Digital Changeover.";

function getDefaultRedirect(userData) {
  if (userData?.type === "USER") {
    if (userData.brandRegistrationStatus === "COMPLETED") {
      return "/brand/dashboard";
    }

    if (userData.influencerRegistrationStatus === "COMPLETED") {
      return "/influencer/dashboard";
    }

    return "/user/dashboard";
  }

  if (userData?.type === "BRAND") {
    return "/brand/dashboard";
  }

  if (userData?.type === "INFLUENCER") {
    return "/influencer/dashboard";
  }

  return "/";
}

function PhyoLogo({ priority = false, className = "" }) {
  return (
    <Image
      src="/landing/phyo_logo.svg"
      alt="Phyo"
      width={113}
      height={30}
      priority={priority}
      className={className}
    />
  );
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#010402]">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/15 border-t-[#10af56]" />
    </div>
  );
}

function EyeIcon({ slashed = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
    >
      {slashed ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18m-8.879-8.879a3 3 0 104.243 4.243M9.88 9.88A3 3 0 0114.12 14.12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.73 5.08A10.94 10.94 0 0112 5c4.73 0 8.72 2.95 10 7a10.96 10.96 0 01-4.04 5.19M6.61 6.61A10.95 10.95 0 002 12c1.28 4.05 5.27 7 10 7 1.31 0 2.57-.23 3.74-.65"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.04 12.32a1.01 1.01 0 010-.64C3.42 7.51 7.36 4.5 12 4.5s8.58 3.01 9.96 7.18a1 1 0 010 .64C20.58 16.49 16.64 19.5 12 19.5S3.42 16.49 2.04 12.32z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </>
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-2.5 w-2.5"
    >
      <path
        d="M3.5 8.5l2.25 2.25L12.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon({ isWhite = false }) {
  const fill = isWhite
    ? {
      blue: "#FFFFFF",
      green: "#FFFFFF",
      yellow: "#FFFFFF",
      red: "#FFFFFF",
    }
    : {
      blue: "#4285F4",
      green: "#34A853",
      yellow: "#FBBC05",
      red: "#EA4335",
    };

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill={fill.blue}
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill={fill.green}
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill={fill.yellow}
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill={fill.red}
      />
    </svg>
  );
}

function AuthArtworkPanel() {
  return (
    <section
      className="relative hidden min-h-screen overflow-hidden rounded-tr-[40px] rounded-br-[40px] lg:flex lg:w-1/2"
      style={{
        backgroundImage:
          "linear-gradient(134.8deg, rgb(0, 48, 18) 1.03%, rgb(0, 0, 0) 100%)",
      }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/login_page/login_artwork.png"
          alt="Login Artwork"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0vw"
          className="object-cover object-center opacity-40"
        />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-between px-8 py-10 lg:px-10 lg:py-12 xl:px-[72px] xl:py-[60px]">
        <PhyoLogo priority className="h-[30px] w-auto max-w-[200px] lg:ml-4 xl:ml-[32.5px]" />

        <div className="max-w-[540px] lg:pl-6 xl:pl-[80px]">
          <h1
            className="text-[32px] font-normal leading-[1.5] text-white xl:text-[36px]"
            style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
          >
            Welcome to the <span className="font-extrabold">phyo.aI</span>
          </h1>

          <p
            className="mt-4 text-[16px] leading-[1.9] text-[#9b9b9b] xl:text-[16px]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {welcomeCopy}
          </p>
        </div>
      </div>
    </section>
  );
}

function ForgotPasswordModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-md">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close forgot password modal backdrop"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-[520px] items-center justify-center">
        <ForgotPasswordCard
          isModal={true}
          onClose={onClose}
          onCompleted={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [googleIconWhite, setGoogleIconWhite] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const verified = searchParams.get("verified");
  const expired = searchParams.get("expired");

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    let redirect = searchParams.get("redirect");

    if (!redirect) {
      const userDataStr = localStorage.getItem("userData");

      if (userDataStr) {
        try {
          redirect = getDefaultRedirect(JSON.parse(userDataStr));
        } catch (error) {
          redirect = "/";
        }
      } else {
        redirect = "/";
      }
    }

    if (redirect) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    if (verified) {
      toast.success(
        "Email verified successfully! Please sign in with your credentials.",
      );
    }
  }, [verified]);

  useEffect(() => {
    if (expired) {
      toast.info("Your session expired. Please sign in again.");
    }
  }, [expired]);

  useEffect(() => {
    if (!forgotModalOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [forgotModalOpen]);

  const loginAPI = async (email, password) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.phyo.ai/api";

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  };

  const googleLoginAPI = async (idToken) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.phyo.ai/api";

    const response = await fetch(`${apiUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        type: "USER",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);

    try {
      const result = await googleLoginAPI(credentialResponse.credential);

      if (result.token) {
        authUtils.setToken(result.token);

        const userData = result.user || result.data?.user || result.data;

        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));

          if (userData.email) {
            localStorage.setItem("userEmail", userData.email);
          }
        }

        toast.success("Successfully signed in with Google!");

        const redirect =
          searchParams.get("redirect") || getDefaultRedirect(userData);

        setTimeout(() => router.push(redirect), 1000);
      } else {
        toast.error(result.message || "Google login failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
      setGoogleIconWhite(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleIconWhite(false);
    toast.error("Google Sign-In was unsuccessful. Please try again.");
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await loginAPI(data.email, data.password);

      if (result.success || result.token || result.data?.token) {
        const token = result.token || result.data?.token;

        if (token) {
          authUtils.setToken(token);
          localStorage.setItem("userEmail", data.email);
        }

        const userData = result.user || result.data?.user || result.data;

        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
        }

        toast.success("Login successful! Welcome back!");

        const redirect =
          searchParams.get("redirect") || getDefaultRedirect(userData);

        setTimeout(() => router.push(redirect), 1000);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    setGoogleIconWhite(true);

    setTimeout(() => {
      const googleButton = document.querySelector(
        '.phyo-hidden-google-login div[role="button"][aria-labelledby]',
      );

      if (googleButton) {
        googleButton.click();
        return;
      }

      setGoogleIconWhite(false);
      toast.error("Google Sign-In is still loading. Please try again.");
    }, 100);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-240px] top-[-292px] z-0 h-[619.387px] w-[605px] rounded-[619.387px] bg-[#16A34A]/[0.35] blur-[125px]"
        style={{
          transform: "rotate(27.853deg)",
        }}
      />

      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <AuthArtworkPanel />

        <section className="relative flex min-h-screen items-start justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:w-1/2 lg:items-center lg:px-10 lg:py-12 xl:px-[92px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(9,97,41,0.25),rgba(1,4,2,0)_48%)] lg:hidden" />

          <div className="relative w-full max-w-[540px] rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
            <PhyoLogo
              priority
              className="mb-8 h-[30px] w-auto sm:mb-10 lg:hidden"
            />

            <div className="mb-8 space-y-3 sm:space-y-4 lg:mb-8">
              <h2
                className="text-[30px] font-normal leading-[1.2] text-white sm:text-[34px] lg:text-[36px]"
                style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
              >
                Login
              </h2>

              <p
                className="max-w-[540px] text-[15px] leading-[1.6] text-[#9b9b9b] sm:text-[16px]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {loginCopy}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
              noValidate
            >
              <div className="space-y-6 sm:space-y-7">
                {formFields.map((field) => {
                  const error = errors[field.name];

                  return (
                    <div key={field.name}>
                      <div className="flex flex-col gap-0">
                        <label
                          htmlFor={field.name}
                          className="text-[16px] leading-none text-[#868686]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {field.label}
                        </label>

                        <div className="relative">
                          <input
                            id={field.name}
                            type={
                              field.name === "password" && showPassword
                                ? "text"
                                : field.type
                            }
                            autoComplete={field.autoComplete}
                            spellCheck={
                              field.name === "email" ? false : undefined
                            }
                            aria-invalid={error ? "true" : "false"}
                            {...register(field.name, field.validation)}
                            className="h-9 w-full border-b border-white/28 bg-transparent pr-10 text-[16px] leading-none text-white outline-none transition placeholder:text-white/18 focus:border-white/60"
                            style={{ fontFamily: "var(--font-inter)" }}
                          />

                          {field.name === "password" && (
                            <button
                              type="button"
                              onClick={() => setShowPassword((value) => !value)}
                              className="absolute bottom-2 right-0 text-white/40 transition hover:text-white/75"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              <EyeIcon slashed={!showPassword} />
                            </button>
                          )}
                        </div>
                      </div>

                      {field.name === "password" && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => setForgotModalOpen(true)}
                            className="text-[14px] text-[#16a34a] transition hover:text-[#34d27a] mt-[2px]"
                            style={{
                              fontFamily: "var(--font-inter)",
                            }}
                          >
                            Forget password?
                          </button>
                        </div>
                      )}

                      {error && (
                        <p
                          className="pt-2 text-sm text-[#ff8f8f]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="terms"
                  className="flex w-full cursor-pointer items-start gap-3"
                >
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms", {
                      required: "Please check the box to continue.",
                    })}
                    className="peer sr-only"
                  />

                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border border-[#9b9b9b] bg-transparent text-transparent transition 
peer-checked:border-[#16a34a] 
peer-checked:bg-[#16a34a]   // 👈 full green fill
peer-checked:text-white     // 👈 white tick
peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#16a34a]">
                    <CheckIcon />
                  </span>

                  <span
                    className="flex-1 text-[12px] leading-[1.5] text-[#868686] sm:text-[13px]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {checkboxCopy}
                  </span>
                </label>

                {errors.terms && (
                  <p
                    className="text-sm text-[#ff8f8f]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {errors.terms.message}
                  </p>
                )}
              </div>

              <div className="space-y-6 pt-1 sm:space-y-8">
                <OutlineGlowButton
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full px-5 normal-case disabled:cursor-not-allowed disabled:opacity-50 sm:text-[16px]"
                  baseSurfaceClassName="bg-[#000000]"
                  glowSurfaceClassName="bg-[#16A34A]"
                >
                  {loading ? (
                    <span
                      className="inline-flex items-center justify-center gap-3"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing In...
                    </span>
                  ) : (
                    <span
                      className="text-center"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Login
                    </span>
                  )}
                </OutlineGlowButton>

                <div className="flex w-full items-center gap-2">
                  <span className="h-px flex-1 bg-[#2E2E2E]" />

                  <span
                    className="shrink-0 whitespace-nowrap text-[12px] font-normal capitalize leading-[1.2] text-[#868686]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Or
                  </span>

                  <span className="h-px flex-1 bg-[#2E2E2E]" />
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <OutlineGlowButton
                    type="button"
                    onMouseDown={() => setGoogleIconWhite(true)}
                    onClick={handleGoogleButtonClick}
                    disabled={googleLoading || loading}
                    className="h-12 w-full px-5 normal-case disabled:cursor-not-allowed disabled:opacity-50 sm:text-[16px]"
                    baseSurfaceClassName="bg-[#000000]"
                    glowSurfaceClassName="bg-[#16A34A]"
                  >
                    {googleLoading ? (
                      <span className="inline-flex items-center gap-3">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Connecting...
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        <GoogleIcon isWhite={googleIconWhite} />
                        <span className="pt-[2px] text-center">
                          Continue with google
                        </span>
                      </span>
                    )}
                  </OutlineGlowButton>

                  <p
                    className="text-center text-[13px] leading-[1.6] text-[#868686] sm:text-[14px]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Didn&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-[#16a34a] underline decoration-solid transition hover:text-[#34d27a]"
                    >
                      Let&apos;s create your account
                    </Link>
                  </p>
                </div>
              </div>
            </form>

            <div
              className="phyo-hidden-google-login absolute h-0 w-0 overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
              />
            </div>
          </div>
        </section>
      </div>

      <ForgotPasswordModal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default function LoginPage() {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Suspense fallback={<AuthLoadingScreen />}>
        <LoginForm />
      </Suspense>
    </GoogleOAuthProvider>
  );
}
