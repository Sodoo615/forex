import type { Metadata } from "next";
import SettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize theme, timezone and default calendar filters.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
      <p className="mb-6 text-muted">
        Customize your experience. Preferences are saved locally in your browser.
      </p>
      <SettingsForm />
    </div>
  );
}
