import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const wallet = req.cookies.get('walletConnected')?.value === 'true';

  const protectedRoute = "/stake";
  const nftRoute = "/nft";
  const myNftsRoute = "/myNfts";
  const getstarted = "/";
  const adminRoute = "/admin";
  if (req.nextUrl.pathname === getstarted && wallet) {
    return NextResponse.redirect(new URL(protectedRoute, req.url));
  }
  if ((req.nextUrl.pathname === protectedRoute || req.nextUrl.pathname === nftRoute  || req.nextUrl.pathname === myNftsRoute) && !wallet) {
    return NextResponse.redirect(new URL(getstarted, req.url));
  }

  if (req.nextUrl.pathname === adminRoute && !wallet) {
    return NextResponse.redirect(new URL(getstarted, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/stake", "/nft", "/"],
};