"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import {
  changePasswordAction,
  createPasswordWithOtpAction,
  resetPasswordWithOtpAction,
  sendCreatePasswordOtpAction,
  sendPasswordOtpAction,
} from "@/actions/account/password";

function getProviderLabel(provider: string) {
  switch (provider) {
    case "GOOGLE":
      return "Google";
    case "GITHUB":
      return "GitHub";
    case "CREDENTIALS":
      return "Email and password";
    default:
      return "your connected provider";
  }
}

function validatePasswordPair(password: string, confirmPassword: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (password !== confirmPassword) {
    return "New passwords do not match.";
  }

  return null;
}

function InlineError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
      {message}
    </p>
  );
}

function getOtpSentMessage(emailHint?: string) {
  return `OTP sent to ${emailHint ?? "your email"}. Check your Inbox, Spam, or Promotions folder.`;
}

export default function SecuritySection({
  hasPassword,
  authProvider,
}: {
  hasPassword: boolean;
  authProvider: string;
}) {
  const [passwordEnabled, setPasswordEnabled] = useState(hasPassword);
  const [method, setMethod] = useState<"current" | "otp">("current");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [isSendingResetOtp, setIsSendingResetOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [createOtpSent, setCreateOtpSent] = useState(false);
  const [createOtpCode, setCreateOtpCode] = useState("");
  const [createNewPassword, setCreateNewPassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const [isSendingCreateOtp, setIsSendingCreateOtp] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);

  const [inlineError, setInlineError] = useState<string | null>(null);
  const providerLabel = getProviderLabel(authProvider);
  const canCreatePassword = !passwordEnabled && (authProvider === "GOOGLE" || authProvider === "GITHUB");

  const clearResetForm = () => {
    setResetOtpSent(false);
    setResetOtpCode("");
    setResetNewPassword("");
    setResetConfirmPassword("");
  };

  const clearCreateForm = () => {
    setCreateOtpSent(false);
    setCreateOtpCode("");
    setCreateNewPassword("");
    setCreateConfirmPassword("");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!currentPassword) {
      setInlineError("Current password is required.");
      return;
    }

    const validationError = validatePasswordPair(newPassword, confirmPassword);
    if (validationError) {
      setInlineError(validationError);
      return;
    }

    if (currentPassword === newPassword) {
      setInlineError("New password must be different from your current password.");
      return;
    }

    setIsChanging(true);
    const res = await changePasswordAction(currentPassword, newPassword);
    setIsChanging(false);

    if (res.success) {
      toast.success(res.message ?? "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    setInlineError(res.error || "Failed to update password.");
  };

  const handleSendResetOtp = async () => {
    setInlineError(null);
    setIsSendingResetOtp(true);
    const res = await sendPasswordOtpAction();
    setIsSendingResetOtp(false);

    if (res.success) {
      toast.success(getOtpSentMessage(res.emailHint));
      setResetOtpSent(true);
      return;
    }

    setInlineError(res.error || "Failed to send OTP.");
  };

  const handleOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!resetOtpCode.trim()) {
      setInlineError("Please enter the OTP.");
      return;
    }

    const validationError = validatePasswordPair(resetNewPassword, resetConfirmPassword);
    if (validationError) {
      setInlineError(validationError);
      return;
    }

    setIsResetting(true);
    const res = await resetPasswordWithOtpAction(resetOtpCode, resetNewPassword);
    setIsResetting(false);

    if (res.success) {
      toast.success(res.message ?? "Password updated successfully.");
      clearResetForm();
      setMethod("current");
      return;
    }

    setInlineError(res.error || "Failed to reset password.");
  };

  const handleSendCreateOtp = async () => {
    setInlineError(null);
    setIsSendingCreateOtp(true);
    const res = await sendCreatePasswordOtpAction();
    setIsSendingCreateOtp(false);

    if (res.success) {
      toast.success(getOtpSentMessage(res.emailHint));
      setCreateOtpSent(true);
      return;
    }

    setInlineError(res.error || "Failed to send OTP.");
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    if (!createOtpCode.trim()) {
      setInlineError("Please enter the OTP.");
      return;
    }

    const validationError = validatePasswordPair(createNewPassword, createConfirmPassword);
    if (validationError) {
      setInlineError(validationError);
      return;
    }

    setIsCreatingPassword(true);
    const res = await createPasswordWithOtpAction(createOtpCode, createNewPassword);
    setIsCreatingPassword(false);

    if (res.success) {
      toast.success(res.message ?? "Password login has been enabled.");
      clearCreateForm();
      setPasswordEnabled(true);
      setMethod("current");
      return;
    }

    setInlineError(res.error || "Failed to create password.");
  };

  return (
    <div className="flex flex-col gap-6 py-6 md:flex-row md:items-start md:justify-between">
      <div className="md:w-1/3">
        <h2 className="text-lg font-semibold text-white">Security</h2>
        <p className="mt-1 text-sm text-white/50">
          Manage your password and secure your account.
        </p>
      </div>

      <div className="md:w-2/3">
        {!passwordEnabled ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-cyan-300">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">
                  Password login is not enabled for this account.
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  You are signed in with {providerLabel}. Create a password if you also want to sign in using email and password.
                </p>
                <p className="mt-3 text-xs leading-5 text-white/40">
                  You can continue using {providerLabel} even after creating a password.
                </p>

                <div className="mt-5 space-y-4">
                  <InlineError message={inlineError} />

                  {!canCreatePassword ? (
                    <p className="text-sm text-white/55">
                      Password setup is not available for this account state.
                    </p>
                  ) : !createOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendCreateOtp}
                      disabled={isSendingCreateOtp}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSendingCreateOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      {isSendingCreateOtp ? "Sending OTP..." : "Create Password"}
                    </button>
                  ) : (
                    <form onSubmit={handleCreatePassword} className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          OTP Code
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={createOtpCode}
                          onChange={(e) => setCreateOtpCode(e.target.value)}
                          required
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          New Password
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={createNewPassword}
                          onChange={(e) => setCreateNewPassword(e.target.value)}
                          required
                          minLength={8}
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={createConfirmPassword}
                          onChange={(e) => setCreateConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            clearCreateForm();
                            setInlineError(null);
                          }}
                          className="h-10 rounded-lg px-4 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSendCreateOtp}
                          disabled={isSendingCreateOtp || isCreatingPassword}
                          className="h-10 rounded-lg px-4 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSendingCreateOtp ? "Sending..." : "Resend OTP"}
                        </button>
                        <button
                          type="submit"
                          disabled={isCreatingPassword}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isCreatingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isCreatingPassword ? "Creating..." : "Set Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="flex border-b border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMethod("current");
                  setInlineError(null);
                  clearResetForm();
                }}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  method === "current"
                    ? "border-b-2 border-cyan-400 bg-white/5 text-white"
                    : "text-white/50 hover:bg-white/2 hover:text-white/80"
                }`}
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("otp");
                  setInlineError(null);
                }}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  method === "otp"
                    ? "border-b-2 border-cyan-400 bg-white/5 text-white"
                    : "text-white/50 hover:bg-white/2 hover:text-white/80"
                }`}
              >
                Reset using OTP
              </button>
            </div>

            <div className="space-y-4 p-6">
              <InlineError message={inlineError} />

              {method === "current" && (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">
                      Current Password
                    </label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isChanging}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isChanging ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      {isChanging ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}

              {method === "otp" && (
                <div className="flex flex-col gap-4">
                  {!resetOtpSent ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Mail className="mb-4 h-10 w-10 text-white/30" />
                      <p className="mb-6 max-w-sm text-sm text-white/80">
                        We will send a 6-digit one-time passcode to your email address to verify your identity.
                      </p>
                      <button
                        type="button"
                        onClick={handleSendResetOtp}
                        disabled={isSendingResetOtp}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-500/10 px-6 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSendingResetOtp && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSendingResetOtp ? "Sending OTP..." : "Send OTP Code"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOtpReset} className="flex flex-col gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          OTP Code
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={resetOtpCode}
                          onChange={(e) => setResetOtpCode(e.target.value)}
                          required
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          New Password
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          required
                          minLength={8}
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/70">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            clearResetForm();
                            setInlineError(null);
                          }}
                          className="h-10 rounded-lg px-4 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleSendResetOtp}
                          disabled={isSendingResetOtp || isResetting}
                          className="h-10 rounded-lg px-4 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSendingResetOtp ? "Sending..." : "Resend OTP"}
                        </button>
                        <button
                          type="submit"
                          disabled={isResetting}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isResetting ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
