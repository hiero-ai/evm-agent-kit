# EVM Agent Kit

An open-source toolkit for connecting AI agents to EVM protocols. Initial version inspired by [Solana Agent Kit](https://github.com/hiero-ai/solana-agent-kit).

![NPM Downloads](https://img.shields.io/npm/dm/@hiero-ai/evm-agent-kit?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/hiero-ai/evm-agent-kit?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/hiero-ai/evm-agent-kit?style=for-the-badge)


- Trade tokens
- Launch new tokens
- Launch tokens on AMMs

## Core Features

[TBO]

## 📦 Installation

```bash
yarn add @hiero-ai/evm-agent-kit
```

## Quick Start

```typescript
import { EVMKit, createEVMTools } from "evm-agent-kit";
import { base } from "viem/chains"; // or any other chain

// Initialize with private key and optional RPC URL
const chain = base;
const privateKey = "evm-wallet-private-key";

const agent = new EVMKit(privateKey, chain);

// Create LangChain tools
const tools = createEVMTools(agent);
```

## AI integrations

### Langchain

Ready-to-use LangChain tools for blockchain operations

### Vercel AI SDK

Vercel AI SDK for AI agent integration

## Dependencies

- viem
- langchain
- @langchain/core

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project.

<!-- ## Contributors

<a href="https://github.com/hiero-ai/evm-agent-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hiero-ai/evm-agent-kit" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hiero-ai/evm-agent-kit&type=Date)](https://star-history.com/#hiero-ai/evm-agent-kit&Date) -->

## Security

The EVM Agent Kit handles private keys and transactions. Always ensure you're using it in a secure environment and never share your private keys.
