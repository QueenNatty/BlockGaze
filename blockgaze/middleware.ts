import { NextResponse, type NextRequest } from "next/server";

// Most hosts (Vercel, Netlify) already redirect HTTP to HTTPS. This covers
// self-hosted deployments behind a proxy that sets x-forwarded-proto.
export function middleware(req: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
