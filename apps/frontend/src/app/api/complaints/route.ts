// src/app/api/complaints/route.ts

import { NextResponse } from "next/server";
import { getComplaints, addComplaint } from "@/lib/complaintService";

export async function GET() {
  try {
    const complaints = getComplaints();
    return NextResponse.json(complaints);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newComplaint = addComplaint(body);
    return NextResponse.json(newComplaint);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
