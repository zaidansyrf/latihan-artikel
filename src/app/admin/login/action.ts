"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    email === "admin@gmail.com" &&
    password === "admin123"
  ) {
    (await cookies()).set("admin_token", "true", {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}