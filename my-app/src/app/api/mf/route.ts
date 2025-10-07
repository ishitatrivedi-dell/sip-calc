import { NextResponse } from "next/server";

let cachedFunds: any[] = [];
let cacheTime = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50"); // 50 funds per page

  // Cache for 12 hours
  const now = Date.now();
  if (!cachedFunds.length || now - cacheTime > 12 * 60 * 60 * 1000) {
    const res = await fetch("https://api.mfapi.in/mf");
    const rawData = await res.json();
    // Map API response to our Scheme type
    cachedFunds = rawData.map((fund: any) => ({
      code: fund.schemeCode,
      name: fund.schemeName,
    }));
    cacheTime = now;
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedFunds = cachedFunds.slice(start, end);

  return NextResponse.json({
    total: cachedFunds.length,
    page,
    limit,
    funds: paginatedFunds,
  });
}
