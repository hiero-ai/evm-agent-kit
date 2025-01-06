import { EVMKit } from "../src";
import { createEvmTools } from "../src/langchain";

import { baseSepolia } from "viem/chains";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";

import { ChatOpenAI } from "@langchain/openai";

import "dotenv/config";

const AGENT_PROMPT = `
You are helpful ai assistant that can interact onchain. 
If you need funds you can provide your wallet details and request funds from the user. 
If you can help with your available tools, briefly explain so.

If you need to use a ERC20 contract to demonstrate your capabilities use: 0x22c0DB4CC9B339E34956A5699E5E95dC0E00c800
`;

const createAgent = () => {
  const chain = baseSepolia;
  const checkpointSaver = new MemorySaver();

  const privateKey = process.env.WALLET_PRIVATE_KEY!;

  try {
    const toolkit = new EVMKit(privateKey, chain);
    const tools = createEvmTools(toolkit);

    const llm = new ChatOpenAI({
      apiKey: process.env.OPEN_AI_API_KEY!,
      model: "gpt-4o-mini",
      temperature: 0.3,
    });

    return createReactAgent({
      llm,
      tools,
      checkpointSaver,
      messageModifier: AGENT_PROMPT,
    });
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
};

async function run(agent: any, interval = 5) {
  let runNumber = 0;
  while (true) {
    console.log("Run number :: ", runNumber++);
    try {
      const userMessage = [
        {
          role: "user",
          content:
            "Be creative and do something interesting using your tools. Think and execute a set of actions to show your capabilities.",
        },
      ];

      const stream = await agent.stream(
        { messages: userMessage },
        { configurable: { thread_id: "1" } },
        { streamMode: "values" }
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("--------------------------------");
      }
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      break;
    }
  }
}

async function main() {
  const agent = createAgent();
  await run(agent);
}

main();
