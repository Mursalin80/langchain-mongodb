import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { vectorStore } from "@/utils/mongo";

const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

export const promptTemp = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.5,
  maxRetries: 2,
  apiKey: process.env.GOOGLE_API_KEY,

  // other params...
});

export const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: { fetchK: 10, lambda: 0.25 },
  k: 3,
});

export const combineDocsChain = await createStuffDocumentsChain({
  llm,
  prompt: promptTemp,
  outputParser: new StringOutputParser(),
});

export const retrievalChains = await createRetrievalChain({
  retriever,
  combineDocsChain,
});
