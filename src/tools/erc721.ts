import { parseAbi, Address } from "viem";
import { EVMKit } from "../index";

const ERC721_ABI = parseAbi([
  // View functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address owner)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",

  // Transfer-related functions
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address operator)",
  "function setApprovalForAll(address operator, bool _approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",

  // Interface support
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
]);

const erc721Approve = async (
  agent: EVMKit,
  tokenAddress: Address,
  to: Address,
  tokenId: string
) => {
  if (!to || !tokenId) {
    throw new Error("Missing 'to' or 'tokenId'");
  }

  return agent.walletClient.writeContract({
    address: tokenAddress,
    abi: ERC721_ABI,
    functionName: "approve",
    args: [to, BigInt(tokenId)],
  });
};

const erc721TransferFrom = async (
  agent: EVMKit,
  tokenAddress: Address,
  from: Address,
  to: Address,
  tokenId: string
) => {
  if (!from || !to || !tokenId) {
    throw new Error("Missing 'from', 'to' or 'tokenId'");
  }

  return agent.walletClient.writeContract({
    address: tokenAddress,
    abi: ERC721_ABI,
    functionName: "transferFrom",
    args: [from, to, BigInt(tokenId)],
  });
};

export const erc721Tools = {
  erc721Approve,
  erc721TransferFrom,
};
