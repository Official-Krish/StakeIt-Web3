import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const wallet = req.cookies.get('walletConnected')?.value === 'true';

  const protectedRoute = "/stake";
  const nftRoute = "/nft";
  const getstarted = "/";
  if (req.nextUrl.pathname === getstarted && wallet) {
    return NextResponse.redirect(new URL(protectedRoute, req.url));
  }
  if ((req.nextUrl.pathname === protectedRoute || req.nextUrl.pathname === nftRoute ) && !wallet) {
    return NextResponse.redirect(new URL(getstarted, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/stake", "/nft", "/"],
};