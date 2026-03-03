import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    success: true,
    statusCode: 200,
    message: "Admin summary fetched",
    data: {
      totalUsers: 1250,
      totalTransactions: 3847,
      totalSubscribers: 856,
      totalIncome: 45230.5,
    },
  };

  return NextResponse.json(data);
}
