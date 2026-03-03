import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    success: true,
    statusCode: 200,
    message: "User traffic data by period fetched",
    data: {
      weekly: [
        {
          date: "2026-02-25",
          registeredUsers: 5,
        },
        {
          date: "2026-02-26",
          registeredUsers: 8,
        },
        {
          date: "2026-02-27",
          registeredUsers: 3,
        },
        {
          date: "2026-02-28",
          registeredUsers: 12,
        },
        {
          date: "2026-03-01",
          registeredUsers: 15,
        },
        {
          date: "2026-03-02",
          registeredUsers: 7,
        },
        {
          date: "2026-03-03",
          registeredUsers: 10,
        },
      ],
      monthly: [
        {
          week: "2026-02-03 to 2026-02-09",
          registeredUsers: 42,
        },
        {
          week: "2026-02-10 to 2026-02-16",
          registeredUsers: 58,
        },
        {
          week: "2026-02-17 to 2026-02-23",
          registeredUsers: 35,
        },
        {
          week: "2026-02-24 to 2026-03-02",
          registeredUsers: 55,
        },
        {
          week: "2026-03-03 to 2026-03-09",
          registeredUsers: 10,
        },
      ],
      yearly: [
        {
          month: "2025-03",
          registeredUsers: 145,
        },
        {
          month: "2025-04",
          registeredUsers: 267,
        },
        {
          month: "2025-05",
          registeredUsers: 312,
        },
        {
          month: "2025-06",
          registeredUsers: 289,
        },
        {
          month: "2025-07",
          registeredUsers: 405,
        },
        {
          month: "2025-08",
          registeredUsers: 378,
        },
        {
          month: "2025-09",
          registeredUsers: 456,
        },
        {
          month: "2025-10",
          registeredUsers: 523,
        },
        {
          month: "2025-11",
          registeredUsers: 487,
        },
        {
          month: "2025-12",
          registeredUsers: 612,
        },
        {
          month: "2026-01",
          registeredUsers: 698,
        },
        {
          month: "2026-02",
          registeredUsers: 785,
        },
      ],
    },
  };

  return NextResponse.json(data);
}
