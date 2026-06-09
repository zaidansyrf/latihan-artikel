import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function loginAdmin(formData: FormData) {
  "use server";

  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "admin" && password === "admin123") {
    const cookieStore = await cookies();

    cookieStore.set("admin_token", "logged-in", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <form action={loginAdmin} className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Login hanya untuk admin.</p>

        <input
          name="username"
          placeholder="Username"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </main>
  );
}