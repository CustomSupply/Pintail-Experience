import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { VendorForm } from "../vendor-form";

export default function NewVendorPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/vendors"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to vendors
      </Link>
      <div className="mt-2">
        <PageHeader title="New vendor" />
      </div>
      <VendorForm vendor={null} />
    </div>
  );
}
