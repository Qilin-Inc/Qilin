// src/app/api/staff/[id]/route.ts

import { NextResponse } from "next/server";
import { updateStaffMember, removeStaffMember } from "@/lib/staffService";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updatedStaff = updateStaffMember(params.id, body);
    return NextResponse.json(updatedStaff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    removeStaffMember(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
