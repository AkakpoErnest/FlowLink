/**
 * Server-side wallet utilities for FlowLink managed wallets.
 * Uses the encrypted private key stored in the DB to sign transactions
 * without requiring MetaMask or any browser wallet.
 */
import { privateKeyToAccount } from "viem/accounts"
import { createWalletClient, createPublicClient, http, parseUnits, parseAbi } from "viem"
import { hashkeyTestnet } from "viem/chains"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/wallet-crypto"

const RPC = process.env.NEXT_PUBLIC_HASHKEY_TESTNET_RPC || "https://hashkeychain-testnet.alt.technology"

export const ERC20_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
])

export function getPublicClient() {
  return createPublicClient({
    chain: hashkeyTestnet,
    transport: http(RPC),
  })
}

/**
 * Fetch and decrypt a managed user's private key from the DB.
 * Throws if the user has no managed wallet.
 */
export async function getUserPrivateKey(userId: string): Promise<`0x${string}`> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletType: true, encryptedPrivateKey: true },
  })
  if (!user) throw new Error("User not found")
  if (user.walletType !== "managed") throw new Error("User does not have a managed wallet")
  if (!user.encryptedPrivateKey) throw new Error("No encrypted private key stored")
  return decrypt(user.encryptedPrivateKey) as `0x${string}`
}

/**
 * Get a viem WalletClient for a managed user — ready to sign + broadcast.
 */
export async function getUserWalletClient(userId: string) {
  const privateKey = await getUserPrivateKey(userId)
  const account = privateKeyToAccount(privateKey)
  return createWalletClient({
    account,
    chain: hashkeyTestnet,
    transport: http(RPC),
  })
}

/**
 * Send an ERC-20 token from a managed user's wallet.
 */
export async function userSendERC20(
  userId: string,
  tokenAddress: `0x${string}`,
  toAddress: `0x${string}`,
  amountHuman: number
): Promise<{ txHash: string; success: boolean; error?: string }> {
  try {
    const client = await getUserWalletClient(userId)
    const publicClient = getPublicClient()
    const decimals = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    })
    const amount = parseUnits(amountHuman.toString(), decimals)
    const hash = await client.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [toAddress, amount],
    })
    return { txHash: hash, success: true }
  } catch (e: any) {
    return { txHash: "", success: false, error: e.message }
  }
}

/**
 * Send native HSK from a managed user's wallet.
 */
export async function userSendNative(
  userId: string,
  toAddress: `0x${string}`,
  amountHSK: number
): Promise<{ txHash: string; success: boolean; error?: string }> {
  try {
    const client = await getUserWalletClient(userId)
    const { parseEther } = await import("viem")
    const hash = await client.sendTransaction({
      to: toAddress,
      value: parseEther(amountHSK.toString()),
    })
    return { txHash: hash, success: true }
  } catch (e: any) {
    return { txHash: "", success: false, error: e.message }
  }
}
