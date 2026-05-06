"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound, Mail } from "lucide-react";
import {
  changePasswordAction,
  sendPasswordOtpAction,
  resetPasswordWithOtpAction,
} from "@/actions/account/password";

export default function SecuritySection({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const [method, setMethod] = useState<"current" | "otp">("current");

  // Current password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  // OTP form state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpNewPassword, setOtpNewPassword] = useState("");
  const [otpConfirmPassword, setOtpConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsChanging(true);
    const res = await changePasswordAction(currentPassword, newPassword);
    setIsChanging(false);

    if (res.success) {
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.error || "Failed to update password.");
    }
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    const res = await sendPasswordOtpAction();
    setIsSendingOtp(false);

    if (res.success) {
      toast.success(res.message);
      setOtpSent(true);
    } else {
      toast.error(res.error || "Failed to send OTP.");
    }
  };

  const handleOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpNewPassword !== otpConfirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (otpNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!otpCode) {
      toast.error("Please enter the OTP.");
      return;
    }

    setIsResetting(true);
    const res = await resetPasswordWithOtpAction(otpCode, otpNewPassword);
    setIsResetting(false);

    if (res.success) {
      toast.success("Password reset successfully.");
      setOtpSent(false);
      setOtpCode("");
      setOtpNewPassword("");
      setOtpConfirmPassword("");
      setMethod("current");
    } else {
      toast.error(res.error || "Failed to reset password.");
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-6">
      <div className="md:w-1/3">
        <h2 className="text-lg font-semibold text-white">Security</h2>
        <p className="mt-1 text-sm text-white/50">
          Manage your password and secure your account.
        </p>
      </div>

      <div className="md:w-2/3">
        {!hasPassword ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/80 mb-4">
              Password login is not enabled for this account. You are logging in via a connected provider (like Google or GitHub).
            </p>
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
              >
                {isSendingOtp && <Loader2 className="h-4 w-4 animate-spin" />}
                <Mail className="h-4 w-4" />
                Set a Password via Email OTP
              </button>
            ) : (
              <form onSubmit={handleOtpReset} className="flex flex-col gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Enter OTP sent to your email
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={otpNewPassword}
                    onChange={(e) => setOtpNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={otpConfirmPassword}
                    onChange={(e) => setOtpConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:opacity-50"
                  >
                    {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Set Password
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                type="button"
                onClick={() => setMethod("current")}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  method === "current"
                    ? "text-white border-b-2 border-cyan-400 bg-white/5"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                }`}
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setMethod("otp")}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  method === "otp"
                    ? "text-white border-b-2 border-cyan-400 bg-white/5"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                }`}
              >
                Reset via OTP
              </button>
            </div>

            <div className="p-6">
              {method === "current" && (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isChanging}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
                    >
                      {isChanging && <Loader2 className="h-4 w-4 animate-spin" />}
                      <KeyRound className="h-4 w-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              )}

              {method === "otp" && (
                <div className="flex flex-col gap-4">
                  {!otpSent ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Mail className="h-10 w-10 text-white/30 mb-4" />
                      <p className="text-sm text-white/80 mb-6 max-w-sm">
                        We will send a 6-digit one-time passcode to your email address to verify your identity.
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                      >
                        {isSendingOtp && <Loader2 className="h-4 w-4 animate-spin" />}
                        Send OTP Code
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOtpReset} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">
                          OTP Code
                        </label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          required
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={otpNewPassword}
                          onChange={(e) => setOtpNewPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={otpConfirmPassword}
                          onChange={(e) => setOtpConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isResetting}
                          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:opacity-50"
                        >
                          {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                          Reset Password
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
