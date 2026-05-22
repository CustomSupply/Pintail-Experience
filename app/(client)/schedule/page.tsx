import { PageHeader, EmptyState } from "@/components/page-header";

export default function SchedulePage() {
  return (
    <div>
      <PageHeader title="Schedule" subtitle="The run-of-show, day by day." />
      <EmptyState>The schedule will be published before the trip.</EmptyState>
    </div>
  );
}
