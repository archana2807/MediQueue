import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role =
      req.nextauth.token?.role;

    const pathname =
      req.nextUrl.pathname;

    // ADMIN only
    if (
      pathname.startsWith(
        "/doctors"
      ) &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          req.url
        )
      );
    }

    // ADMIN + DOCTOR
    if (
      pathname.startsWith(
        "/queue"
      ) &&
      ![
        "ADMIN",
        "DOCTOR",
      ].includes(
        String(role)
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          req.url
        )
      );
    }

    // ADMIN + PATIENT
    if (
      pathname.startsWith(
        "/appointments/new"
      ) &&
      ![
        "ADMIN",
        "PATIENT",
      ].includes(
        String(role)
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          req.url
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({
        token,
      }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/doctors/:path*",
    "/queue/:path*",
    "/appointments/:path*",
  ],
};