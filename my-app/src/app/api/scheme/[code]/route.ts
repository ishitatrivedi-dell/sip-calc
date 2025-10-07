// src/app/api/scheme/[code]/route.ts
import { NextResponse } from "next/server";
import { getScheme } from "@/lib/api";

// Define interfaces for type safety
interface SchemeMeta {
  scheme_code: string;
  scheme_name: string;
  fund_house: string;
  scheme_category: string;
  plan: string;
  isin_growth: string;
}

interface NavData {
  date: string;
  nav: string | number; // Adjust based on actual API response
}

interface SchemeResponse {
  meta: SchemeMeta;
  data: NavData[];
}

interface ApiResponse {
  meta: SchemeMeta;
  navHistory: { date: string; nav: number }[];
}

interface Params {
  params: { code: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { code } = params;

    // Validate code parameter
    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json(
        { error: "Invalid scheme code" },
        { status: 400 }
      );
    }

    // Fetch scheme data
    const scheme: SchemeResponse = await getScheme(code);

    // Transform NAV history
    const navHistory = scheme.data.map((d: NavData) => ({
      date: d.date,
      nav: parseFloat(d.nav as string), // Ensure nav is parsed as a number
    }));

    // Prepare response
    const response: ApiResponse = {
      meta: scheme.meta, // Directly use the meta object
      navHistory,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error fetching scheme:", err); // Log error for debugging
    return NextResponse.json(
      { error: "Failed to fetch scheme data" }, // Generic error message
      { status: 500 }
    );
  }
}