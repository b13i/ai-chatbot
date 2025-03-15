"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "./toast";

export function PaymentSuccessChecker() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast({
        type: "success",
        description:
          "Payment successful! A confirmation email will be sent to you shortly.",
      });

      // Remove the query parameter to prevent showing the toast again on page refresh
      router.replace("/");
    }
  }, [searchParams, router]);

  return null;
}
