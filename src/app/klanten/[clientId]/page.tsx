import { redirect } from "next/navigation";
import { NAV_TABS } from "@/lib/constants";

export default async function ClientIndexPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  redirect(`/klanten/${clientId}/${NAV_TABS[0].href}`);
}
