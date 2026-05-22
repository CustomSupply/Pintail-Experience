import { PageHeader, EmptyState } from "@/components/page-header";

export default function CurriculumPage() {
  return (
    <div>
      <PageHeader
        title="Curriculum"
        subtitle="Teaching sessions in text and audio."
      />
      <EmptyState>
        The teaching library will fill in as sessions are published.
      </EmptyState>
    </div>
  );
}
