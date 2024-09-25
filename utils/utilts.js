import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";
import { Readable } from "stream";

// huggingface embeddings
export const hf_embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

// ollama embeddings
export const ollama_embeddings = new OllamaEmbeddings({
  // model: "nomic-embed-text", // 768
  // model: "mxbai-embed-large", //Default , 1024
  model: "all-minilm", // 384
  baseUrl: "http://localhost:11434", // Default value
});

// RecursiveCharacterTextSplitter
export const text_splitter = async (doc) => {
  return await new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  }).splitDocuments(doc);
};

// fileloader

export const fileLoader = async (file) => {
  let fileName = file.name.toLowerCase();
  if (!existsSync("./tmp")) await mkdir("./tmp");
  const tempFilePath = `./tmp/${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(tempFilePath, fileBuffer);
  //      document_loaders
  const loader = new PDFLoader(tempFilePath);
  const doc = await loader.load();
  await rm(tempFilePath);
  return doc;
};

export const stringToNodeStream = (text) => {
  return Readable.from(text);
};
