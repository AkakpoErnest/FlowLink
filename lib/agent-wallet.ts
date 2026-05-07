import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, createPublicClient, http, parseUnits, parseAbi } from 'viem'
import { hashkey } from 'viem/chains'

const RPC = process.env.NEXT_PUBLIC_HASHKEY_MAINNET_RPC || 'https://mainnet.hsk.xyz'

export function deriveAgentWallet(agentIndex: number) {
  const mnemonic = process.env.DEPLOYER_MNEMONIC
  if (!mnemonic) throw new Error('DEPLOYER_MNEMONIC not set')
  const seed = mnemonicToSeedSync(mnemonic)
  const hdKey = HDKey.fromMasterSeed(seed)
  const child = hdKey.derive(`m/44'/60'/0'/0/${agentIndex}`)
  const privateKey = `0x${Buffer.from(child.privateKey!).toString('hex')}` as `0x${string}`
  const account = privateKeyToAccount(privateKey)
  return { account, privateKey, address: account.address }
}

export function getAgentWalletClient(agentIndex: number) {
  const { account } = deriveAgentWallet(agentIndex)
  return createWalletClient({
    account,
    chain: hashkey,
    transport: http(RPC),
  })
}

export function getPublicClient() {
  return createPublicClient({
    chain: hashkey,
    transport: http(RPC),
  })
}

export const ERC20_ABI = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
])

export async function agentSendERC20(
  agentIndex: number,
  tokenAddress: `0x${string}`,
  toAddress: `0x${string}`,
  amountHuman: number
): Promise<{ txHash: string; success: boolean; error?: string }> {
  try {
    const client = getAgentWalletClient(agentIndex)
    const publicClient = getPublicClient()
    const decimals = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })
    const amount = parseUnits(amountHuman.toString(), decimals)
    const hash = await client.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
    })
    return { txHash: hash, success: true }
  } catch (e: any) {
    return { txHash: '', success: false, error: e.message }
  }
}

export async function agentSendNative(
  agentIndex: number,
  toAddress: `0x${string}`,
  amountHSK: number
): Promise<{ txHash: string; success: boolean; error?: string }> {
  try {
    const client = getAgentWalletClient(agentIndex)
    const { parseEther } = await import('viem')
    const hash = await client.sendTransaction({
      to: toAddress,
      value: parseEther(amountHSK.toString()),
    })
    return { txHash: hash, success: true }
  } catch (e: any) {
    return { txHash: '', success: false, error: e.message }
  }
}
