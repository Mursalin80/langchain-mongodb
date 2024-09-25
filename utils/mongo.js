import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { hf_embeddings, ollama_embeddings } from "./utilts";

// mongoDB client
export const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");

// mongoDB collection
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME)
  .collection("vectorDb");
// .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

// mongoDB vector store
export const vectorStore = new MongoDBAtlasVectorSearch(hf_embeddings, {
  collection: collection,
  indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
  textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
  embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
});
