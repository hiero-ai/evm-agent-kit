import { parseAbi, parseUnits, Address } from "viem";
import { EVMKit } from "../index";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]);

// ERC20 READ
const erc20BalanceOf = async (
  agent: EVMKit,
  tokenAddress: Address,
  ownerAddress: Address
) => {
  if (!ownerAddress) {
    throw new Error("ownerAddress required for balanceOf");
  }
  const [rawBalance, decimals, symbol] = await Promise.all([
    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [ownerAddress],
    }),
    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    }),
    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "symbol",
    }),
  ]);

  return {
    balance: rawBalance,
    symbol,
    decimals,
  };
};

const erc20Transfer = async (
  agent: EVMKit,
  tokenAddress: string,
  to: string,
  amount: string
) => {
  if (!to || !amount) {
    throw new Error("Missing 'to' or 'amount'");
  }

  const contractAddress: Address = tokenAddress as Address;
  const toAddress: Address = to as Address;

  const decimals = await agent.publicClient.readContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const parsedAmount = parseUnits(amount, decimals);

  return agent.walletClient.writeContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [toAddress, parsedAmount],
  });
};

const erc20Allowance = async (
  agent: EVMKit,
  tokenAddress: Address,
  owner: Address,
  spender: Address
) => {
  if (!owner || !spender) {
    throw new Error("Missing 'owner' or 'spender'");
  }

  const [rawAllowance, decimals, symbol] = await Promise.all([
    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [owner, spender],
    }),

    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    }),

    agent.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "symbol",
    }),
  ]);

  return {
    allowance: rawAllowance,
    symbol,
    decimals,
  };
};

const erc20Approve = async (
  agent: EVMKit,
  tokenAddress: Address,
  spender: Address,
  amount: string
) => {
  if (!spender || !amount) {
    throw new Error("Missing 'spender' or 'amount'");
  }

  const decimals = await agent.publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const parsedAmount = parseUnits(amount, decimals);

  return agent.walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, parsedAmount],
  });
};

const erc20TransferFrom = async (
  agent: EVMKit,
  tokenAddress: Address,
  from: Address,
  to: Address,
  amount: string
) => {
  if (!from || !to || !amount) {
    throw new Error("Missing 'from', 'to' or 'amount'");
  }

  const decimals = await agent.publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const parsedAmount = parseUnits(amount, decimals);

  return agent.walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "transferFrom",
    args: [from, to, parsedAmount],
  });
};

export const erc20Tools = {
  erc20BalanceOf,
  erc20Transfer,
  erc20Allowance,
  erc20Approve,
  erc20TransferFrom,
};
