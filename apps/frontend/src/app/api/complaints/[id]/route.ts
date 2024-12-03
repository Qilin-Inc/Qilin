// src/app/api/complaints/[id]/route.ts

import { NextResponse } from "next/server";
import {
  getComplaint,
  assignComplaint,
  resolveComplaint,
} from "@/lib/complaintService";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const complaint = getComplaint(params.id);
    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch complaint" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    if (body.staffEmail) {
      const updatedComplaint = await assignComplaint(
        params.id,
        body.staffEmail,
      );
      return NextResponse.json(updatedComplaint);
    }

    if (body.resolution) {
      const updatedComplaint = await resolveComplaint(
        params.id,
        body.resolution,
      );
      return NextResponse.json(updatedComplaint);
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
