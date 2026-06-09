"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete("admin_token");

  cookieStore.set("admin_token", "", {
    path: "/",
    maxAge: 0,
  });

  redirect("/admin/login");
}