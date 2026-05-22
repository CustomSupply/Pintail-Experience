import { PageHeader, EmptyState } from "@/components/page-header";

export default function PhotosPage() {
  return (
    <div>
      <PageHeader title="Photos" subtitle="The trip, as it happens." />
      <EmptyState>
        Photos will appear here in real time during the trip.
      </EmptyState>
    </div>
  );
}
