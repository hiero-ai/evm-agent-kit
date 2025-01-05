import { z } from "zod";
import { DynamicStructuredTool } from "langchain/tools";

import { EVMKit } from "../index";

const network = process.env.BASE_NETWORK!;

const signatureExplorerUrl = (tx: string) =>
  network === "mainnet"
    ? `https://basescan.org/tx/${tx}`
    : `https://sepolia.basescan.org/tx/${tx}`;

const walletExplorerUrl = (address: string) =>
  network === "mainnet"
    ? `https://basescan.org/address/${address}`
    : `https://sepolia.basescan.org/address/${address}`;

/**
 * This tool is used to get the balance of an EVM wallet.
 */
const balanceSchema = z.object({
  address: z.string().describe("The wallet address to check balance for."),
});

export class evmBalanceTool extends DynamicStructuredTool {
  constructor(private evmKit: EVMKit) {
    const fields = {
      name: "evm_balance",
      description: "Get the native balance of an EVM wallet.",
      schema: balanceSchema,
      func: async (params: z.infer<typeof balanceSchema>) => {
        const balance = await this.evmKit.getBalance(params.address);
        return `${balance} ETH`;
      },
    };
    super(fields);
  }
}

/**
 * This tool is used to transfer ETH or ERC20 tokens to another address.
 */
const transferSchema = z.object({
  to: z.string().describe("The wallet address to transfer to."),
  amount: z.string().describe("The amount of tokens to transfer."),
  tokenAddress: z
    .string()
    .describe("The ERC20 token address to transfer.")
    .optional(),
});

export class evmTransferTool extends DynamicStructuredTool {
  constructor(private evmKit: EVMKit) {
    const fields = {
      name: "evm_transfer",
      description: "Transfer ETH or ERC20 tokens to another address.",
      schema: transferSchema,
      func: async (params: z.infer<typeof transferSchema>) => {
        try {
          if (!params.tokenAddress) {
            const tx = await this.evmKit.transfer(params.to, params.amount);
            return `Transaction sent. View on ${signatureExplorerUrl(tx)}`;
          } else {
            const tx = await this.evmKit.erc20Transfer(
              params.tokenAddress,
              params.to,
              params.amount
            );
            return `Transaction sent. View on ${signatureExplorerUrl(tx)}`;
          }
        } catch (error: any) {
          return JSON.stringify({
            status: "error",
            message: error.message,
          });
        }
      },
    };
    super(fields);
  }
}

export const createEvmTools = (evmKit: EVMKit) => {
  return [
    //
    new evmBalanceTool(evmKit),
    new evmTransferTool(evmKit),
  ];
};
