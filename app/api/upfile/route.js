import { NextResponse } from "next/server";

import { fileLoader, text_splitter } from "@/utils/utilts";
import { vectorStore } from "@/utils/mongo";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const uploadedFiles = formData.getAll("filepond");

    if (uploadedFiles && uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[1];
      if (uploadedFile instanceof File) {
        // parse the pdf file
        const docs = await fileLoader(uploadedFile);

        // split the text
        const chunks = await text_splitter(docs);
        let doc = await vectorStore.addDocuments(chunks);
        console.log(doc);
        // let search = await vectorStore.similaritySearch("ThinkStation", 3);
        // console.log("🚀 ~ POST ~ search:", search);

        return NextResponse.json(
          { message: "Uploaded to MongoDB" },
          { status: 200 }
        );
      } else {
        console.log("Uploaded file is not in the expected format.");
        return NextResponse.json(
          { message: "Uploaded file is not in the expected format" },
          { status: 500 }
        );
      }
    } else {
      console.log("No files found.");
      return NextResponse.json({ message: "No files found" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    // Handle the error accordingly, for example, return an error response.
    return new NextResponse("An error occurred during processing.", {
      status: 500,
    });
  }
}
