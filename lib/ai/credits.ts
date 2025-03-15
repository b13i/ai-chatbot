import { getModelById } from "./models";
import {
  paymentsClient,
  CREDIT_PACKAGE,
} from "@/lib/payments/lemon-squeezy-client";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Interface representing a credit purchase transaction
 */
export interface CreditPurchase {
  id: string;
  userId: string;
  creditsAmount: number;
  costInDollars: number;
  timestamp: Date;
}

/**
 * Interface representing a credit usage record
 */
export interface CreditUsage {
  id: string;
  userId: string;
  modelId: string;
  creditsUsed: number;
  timestamp: Date;
}

/**
 * Constants for credit packages - now using the single LemonSqueezy package
 */
export const CREDIT_PACKAGES = [
  {
    id: "standard",
    credits: CREDIT_PACKAGE.credits,
    price: CREDIT_PACKAGE.price,
  },
];

/**
 * Calculate the cost in dollars for a given number of credits
 * @param credits Number of credits to purchase
 * @returns The cost in dollars
 */
export function calculateCreditCost(credits: number): number {
  // Now using fixed price from LemonSqueezy package
  return CREDIT_PACKAGE.price;
}

/**
 * Check if a user has enough credits to use a specific model
 * @param userId User ID
 * @param modelId Model ID
 * @returns Boolean indicating if user has enough credits
 */
export async function hasEnoughCredits(
  userId: string,
  modelId: string
): Promise<boolean> {
  const userCredits = await getUserCredits(userId);
  const model = getModelById(modelId);

  if (!model) {
    return false;
  }

  return userCredits >= model.creditsPerMessage;
}

/**
 * Get the current credit balance for a user
 * @param userId User ID
 * @returns Number of credits available
 */
export async function getUserCredits(userId: string): Promise<number> {
  try {
    // Get user credits from database
    const credits = await db.query.userCredits.findFirst({
      where: (userCredits, { eq: eqOp }) => eqOp(userCredits.userId, userId),
    });

    return credits?.balance || 0;
  } catch (error) {
    console.error("Error getting user credits:", error);
    return 0;
  }
}

/**
 * Create a checkout for purchasing credits
 * @param userId User ID
 * @param email User's email
 * @returns Checkout URL or empty string if failed
 */
export async function createCreditCheckout(
  userId: string,
  email: string
): Promise<string> {
  return paymentsClient.createCheckout(userId, email);
}

/**
 * Process a successful checkout and add credits to the user's account
 * @param userId User ID
 * @param checkoutId Checkout ID from LemonSqueezy
 * @returns Boolean indicating success
 */
export async function processCreditPurchase(
  userId: string,
  checkoutId: string
): Promise<boolean> {
  try {
    // Create purchase record
    const purchase: CreditPurchase = {
      id: checkoutId,
      userId,
      creditsAmount: CREDIT_PACKAGE.credits,
      costInDollars: CREDIT_PACKAGE.price,
      timestamp: new Date(),
    };

    // Update user credits in database
    await db.transaction(async (tx: typeof db) => {
      // Add purchase record
      await tx.insert(schema.creditPurchases).values({
        id: purchase.id,
        userId: purchase.userId,
        amount: purchase.creditsAmount,
        costInDollars: purchase.costInDollars,
        timestamp: purchase.timestamp,
      });

      // Update user credit balance
      const userCredits = await getUserCredits(userId);
      await tx
        .update(schema.userCredits)
        .set({ balance: userCredits + purchase.creditsAmount })
        .where(eq(schema.userCredits.userId, userId));
    });

    return true;
  } catch (error) {
    console.error("Error processing credit purchase:", error);
    return false;
  }
}

/**
 * Record usage of credits for a model
 * @param userId User ID
 * @param modelId Model ID
 * @returns The usage record
 */
export async function recordCreditUsage(
  userId: string,
  modelId: string
): Promise<CreditUsage | null> {
  const model = getModelById(modelId);

  if (!model) {
    return null;
  }

  try {
    // Create usage record
    const usage: CreditUsage = {
      id: `usage-${Date.now()}`,
      userId,
      modelId,
      creditsUsed: model.creditsPerMessage,
      timestamp: new Date(),
    };

    // Update user credits in database
    await db.transaction(async (tx: typeof db) => {
      // Add usage record
      await tx.insert(schema.creditUsages).values({
        id: usage.id,
        userId: usage.userId,
        modelId: usage.modelId,
        amount: usage.creditsUsed,
        timestamp: usage.timestamp,
      });

      // Update user credit balance
      const userCredits = await getUserCredits(userId);
      await tx
        .update(schema.userCredits)
        .set({ balance: Math.max(0, userCredits - usage.creditsUsed) })
        .where(eq(schema.userCredits.userId, userId));
    });

    return usage;
  } catch (error) {
    console.error("Error recording credit usage:", error);
    return null;
  }
}

/**
 * Get credit usage history for a user
 * @param userId User ID
 * @returns Array of credit usage records
 */
export async function getCreditUsageHistory(
  userId: string
): Promise<CreditUsage[]> {
  try {
    // Get user credit usage history from database
    const usages = await db.query.creditUsages.findMany({
      where: (creditUsages, { eq: eqOp }) => eqOp(creditUsages.userId, userId),
      orderBy: (creditUsages, { desc: descOp }) => [
        descOp(creditUsages.timestamp),
      ],
    });

    return usages.map((usage) => ({
      id: usage.id,
      userId: usage.userId,
      modelId: usage.modelId,
      creditsUsed: usage.amount,
      timestamp: usage.timestamp,
    }));
  } catch (error) {
    console.error("Error getting credit usage history:", error);
    return [];
  }
}

/**
 * Get purchase history for a user
 * @param userId User ID
 * @returns Array of credit purchase records
 */
export async function getPurchaseHistory(
  userId: string
): Promise<CreditPurchase[]> {
  try {
    // Get user purchase history from database
    const purchases = await db.query.creditPurchases.findMany({
      where: (creditPurchases, { eq: eqOp }) =>
        eqOp(creditPurchases.userId, userId),
      orderBy: (creditPurchases, { desc: descOp }) => [
        descOp(creditPurchases.timestamp),
      ],
    });

    return purchases.map((purchase) => ({
      id: purchase.id,
      userId: purchase.userId,
      creditsAmount: purchase.amount,
      costInDollars: purchase.costInDollars,
      timestamp: purchase.timestamp,
    }));
  } catch (error) {
    console.error("Error getting purchase history:", error);
    return [];
  }
}
