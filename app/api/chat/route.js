import { LangChainAdapter } from "ai";
import { NextResponse } from "next/server";
import { combineDocsChain, retriever } from "@/utils/llm";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🚀 ~ POST ~ body:", body);
    const messages = body.messages ?? [];
    const question = messages[messages.length - 1].content;

    const context = await retriever.invoke(question);
    console.log("🚀 ~ POST ~ context:", context[0].pageContent);

    const stream = await combineDocsChain.stream({
      input: question,
      chat_history: messages,
      context,
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ message: "Error Processing" }, { status: 500 });
  }
}
