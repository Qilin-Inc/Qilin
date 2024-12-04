// src/app/api/staff/route.ts

import { NextResponse } from "next/server";
import { getStaffList, addStaffMember } from "@/lib/staffService";

export async function GET() {
  try {
    const staff = getStaffList();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff list" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newStaff = addStaffMember(body);
    return NextResponse.json(newStaff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
