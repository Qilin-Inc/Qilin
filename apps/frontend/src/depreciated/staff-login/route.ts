// src/app/api/auth/staff-login/route.ts

import { NextResponse } from "next/server";
import { getStaffList } from "@/lib/staffService";
// import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Get staff list
    const staffList = getStaffList();

    // Find staff member
    const staff = staffList.find((s) => s.email === email);

    if (!staff) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Staff Id",
        },
        { status: 401 },
      );
    }

    // Verify password
    // const isValidPassword = await bcrypt.compare(password, staff.password);
    const isValidPassword = password === staff.password;

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    // Return success with staff data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        status: staff.status,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 },
    );
  }
}
