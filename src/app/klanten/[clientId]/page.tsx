import { redirect } from "next/navigation";
import { DEFAULT_TAB_HREF } from "@/lib/constants";

export default async function ClientIndexPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  redirect(`/klanten/${clientId}/${DEFAULT_TAB_HREF}`);
}
