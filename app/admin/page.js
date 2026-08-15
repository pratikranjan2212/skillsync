import { redirect } from "next/navigation";

/**
 * Root Admin route handler.
 * Automatically redirects to the main Evidence Pipeline Log view.
 */
export default function AdminRootPage() {
  redirect("/admin/pipeline");
}
