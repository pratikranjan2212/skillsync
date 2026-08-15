import { NextResponse } from "next/server";
import { addSubscriber, getSubscribers } from "@/lib/newsletter";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, source } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email address is required." }, { status: 400 });
    }

    const result = await addSubscriber(email, source || "footer");

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        alreadySubscribed: result.alreadySubscribed,
        subscriber: { id: result.subscriber.id, email: result.subscriber.email },
      },
      { status: result.alreadySubscribed ? 200 : 201 }
    );
  } catch (error) {
    if (error.message === "INVALID_EMAIL") {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 422 });
    }
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve subscribers." }, { status: 500 });
  }
}