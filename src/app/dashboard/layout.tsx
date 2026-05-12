import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "../(auth)/actions";
import { Sidebar } from "@/components/sidebar";
import { ChatPanel } from "@/components/chat-panel";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar
        userEmail={user.email!}
        businessName={business?.name ?? undefined}
        logoutAction={logoutAction}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ChatPanel />
    </div>
  );
}
