import { redirect } from "next/navigation";

import { stripe } from "@/lib/payments/stripe";

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  if (typeof session_id !== "string") {
    redirect("/");
  }

  let status: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
    status = session.status;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    redirect("/");
  }

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // This will cause the homepage to show the success toast
    redirect("/?payment=success");
  }

  redirect("/");
}
