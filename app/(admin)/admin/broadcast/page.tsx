import { emailConfigured } from "@/lib/email";
import { PageHeader } from "@/components/page-header";
import { BroadcastForm } from "./broadcast-form";

export default function BroadcastPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Send a broadcast"
        subtitle="Post an announcement to every attendee."
      />
      <BroadcastForm emailReady={emailConfigured()} />
    </div>
  );
}
