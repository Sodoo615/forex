import type { Metadata } from "next";
import SettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize theme, timezone and default calendar filters.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <SettingsForm />
    </div>
  );
}
