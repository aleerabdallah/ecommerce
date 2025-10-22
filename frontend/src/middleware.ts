// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = pathname === "/login" || pathname === "/signup";

  // Define shared paths accessible to everyone, regardless of login status
  const isSharedPath =
    pathname === "/" || pathname === "/about" || pathname === "/contact-us";

  // Define paths accessible only to admin
  const isAdminPath = [
    "/admin/add-student",
    "/admin/students",
    "/admin/edit-student",
    "/admin/send-newsletter",
    "/admin/view-newsletter",
    "/admin/edit-newsletter",
    "/admin/view-events",
    "/admin/add-event",
  ].some((path) => pathname.startsWith(path));

  // Define paths accessible only to Students
  const isStudentPath = [
    "/dashboard-profile",
    "/profile",
    "/calendar",
    "/study-bot",
  ].some((path) => pathname.startsWith(path));

  // Define paths accessible only to Staffs
  const isStaffPath = [
    "/dashboard-profile",
    "/profile",
    "/calendar",
    "/study-bot",
  ].some((path) => pathname.startsWith(path));

  // Retrieve user token and roles from cookies
  const token = request.cookies.get("access_token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  let user = null;
  let userRole = null;

  try {
    if (userCookie) {
      user = JSON.parse(userCookie);
      if (user?.groups?.length > 0) {
        userRole = user.groups[0].name;
      } else if (user?.role) {
        userRole = user.role;
      }
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // Redirect logged-in users away from public paths (login/signup)
  if (isPublicPath && token) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/students", request.url));
    } else if (userRole === "student" || userRole === "staff") {
      return NextResponse.redirect(new URL("/profile", request.url));
    } else {
      // Default redirect for authenticated users without specific role
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Shared paths are accessible to everyone
  if (isSharedPath) {
    return NextResponse.next();
  }

  // Protect admin-only routes
  if (isAdminPath) {
    if (token && userRole === "admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect student-only routes
  if (isStudentPath) {
    if (token && (userRole === "student" || userRole === "admin")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect staff-only routes
  if (isStaffPath) {
    if (token && userRole === "staff") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For any other routes that aren't explicitly defined, allow access
  // You might want to add additional protection here if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
