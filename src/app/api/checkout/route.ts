import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { items, couponCode, paymentMethod } = body;

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "No items in cart" },
      { status: 400 }
    );
  }

  let subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  let discount = 0;
  if (couponCode) {
    const code = couponCode.toUpperCase();
    if (code === "EXAMVERSE10") {
      discount = subtotal * 0.1;
    } else if (code === "STUDENT20") {
      discount = subtotal * 0.2;
    } else if (code === "FIRST50") {
      discount = Math.min(subtotal * 0.5, 200);
    }
  }

  const total = Math.max(subtotal - discount, 0);

  return NextResponse.json({
    success: true,
    orderId: `EV-${Date.now()}`,
    items,
    subtotal,
    discount,
    total,
    paymentMethod,
    message: "Purchase successful!",
  });
}
