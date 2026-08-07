import { redirect } from "next/navigation";

export default async function UithoudingsvermogenIndexPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  redirect(`/klanten/${clientId}/uithoudingsvermogen/max-aeroob`);
}
