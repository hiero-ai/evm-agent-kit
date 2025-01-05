import {
  createWalletClient,
  createPublicClient,
  http,
  Chain,
  Address,
  Account,
  parseEther,
  formatEther,
  WalletClient,
  PublicClient,
  Transport,
} from "viem";

import { privateKeyToAccount } from "viem/accounts";

// Tools
import { erc20Tools } from "./tools/erc20";
import { erc721Tools } from "./tools/erc721";

export class EVMKit {
  walletClient: WalletClient<Transport, Chain, Account>;
  publicClient: PublicClient;
  walletAccount: Account;

  constructor(privateKey: string, chain: Chain, rpcUrl?: string) {
    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    this.walletAccount = privateKeyToAccount(privateKey as Address);
    this.walletClient = createWalletClient({
      chain,
      account: this.walletAccount,
      transport: http(rpcUrl),
    });
  }

  // Native balance
  async getBalance(address: string) {
    const recipient = address as Address;
    const rawBalance = await this.publicClient.getBalance({
      address: recipient,
    });
    return formatEther(rawBalance);
  }

  // Native transfer
  async transfer(to: string, amount: string) {
    const recipient = to as Address;
    return this.walletClient.sendTransaction({
      to: recipient,
      value: parseEther(amount),
    });
  }

  // ERC20 TOOLS
  async erc20BalanceOf(tokenAddress: Address, ownerAddress: Address) {
    erc20Tools.erc20BalanceOf(this, tokenAddress, ownerAddress);
  }

  async erc20Transfer(tokenAddress: string, to: string, amount: string) {
    erc20Tools.erc20Transfer(this, tokenAddress, to, amount);
  }

  async erc20Allowance(
    tokenAddress: Address,
    owner: Address,
    spender: Address
  ) {
    erc20Tools.erc20Allowance(this, tokenAddress, owner, spender);
  }

  async erc20Approve(tokenAddress: Address, spender: Address, amount: string) {
    erc20Tools.erc20Approve(this, tokenAddress, spender, amount);
  }

  async erc20TransferFrom(
    tokenAddress: Address,
    from: Address,
    to: Address,
    amount: string
  ) {
    erc20Tools.erc20TransferFrom(this, tokenAddress, from, to, amount);
  }

  // ERC721 TOOLS
  async erc721Approve(tokenAddress: Address, to: Address, tokenId: string) {
    erc721Tools.erc721Approve(this, tokenAddress, to, tokenId);
  }

  async erc721TransferFrom(
    tokenAddress: Address,
    from: Address,
    to: Address,
    tokenId: string
  ) {
    erc721Tools.erc721TransferFrom(this, tokenAddress, from, to, tokenId);
  }
}
