import { Wallet } from "@/models";

export async function createWallet(role, userId) {
  try {
    const wallet = new Wallet({
      role,
      userId,
      balance: 0,
    });

    await wallet.save();
    console.log("Wallet created successfully");
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw new Error("Failed to create wallet");
  }
}