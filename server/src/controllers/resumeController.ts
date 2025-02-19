import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

interface FileUploadRequest extends Request {
  files?: fileUpload.FileArray;
}

// 🔹 Step 1: Get Adobe API Access Token
const getAdobeAccessToken = async (): Promise<string> => {
  const response = await fetch("https://ims-na1.adobelogin.com/ims/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.ADOBE_CLIENT_ID!,
      client_secret: process.env.ADOBE_CLIENT_SECRET!,
      grant_type: "client_credentials",
      scope: "openid,AdobeID,read_organizations",
    }),
  });

  const data = await response.json();
  return data.access_token;
};

// 🔹 Step 2: Upload PDF to Adobe
export const uploadPdfToAdobe = async (filePath: string, accessToken: string): Promise<string> => {
  const fileBuffer = await fs.promises.readFile(filePath);

  const response = await fetch("https://pdf-services.adobe.io/assets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/pdf",
    },
    body: fileBuffer,
  });

  const data = await response.json();
  return data.assetID;
};

// 🔹 Step 3: Create Adobe Extraction Job
export const createAdobeJob = async (assetID: string, accessToken: string): Promise<string> => {
  const response = await fetch("https://pdf-services.adobe.io/jobs/extractpdf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assetID, format: "text" }),
  });

  const data = await response.json();
  return data.jobID;
};

// 🔹 Step 4: Poll Adobe API Until Job Completes
const pollAdobeJob = async (jobID: string, accessToken: string): Promise<string> => {
  let status = "IN_PROGRESS";
  let outputURL = "";

  while (status === "IN_PROGRESS") {
    const response = await fetch(`https://pdf-services.adobe.io/jobs/${jobID}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    status = data.status;

    if (status === "DONE") {
      outputURL = data.output;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec before polling again
    }
  }

  return outputURL;
};

// 🔹 Step 5: Download Extracted Text
const downloadExtractedText = async (outputURL: string, accessToken: string): Promise<string> => {
  const response = await fetch(outputURL, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return await response.text();
};

// 🔹 Step 6: Send Extracted Text to OpenAI for Cleaning
const cleanTextWithOpenAI = async (extractedText: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      prompt: `Clean and rewrite the following text: \n\n${extractedText}`,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].text;
};

// 🔹 Main Function to Handle File Upload, Adobe Processing, and OpenAI Cleanup
export const processResume = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !req.files.resume) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const file = req.files.resume as fileUpload.UploadedFile;
    const tempFilePath = path.join(__dirname, "../../temp", file.name);

    // Save file temporarily
    await file.mv(tempFilePath);

    // Get Adobe Access Token
    const accessToken = await getAdobeAccessToken();

    // Upload PDF and Get Asset ID
    const assetID = await uploadPdfToAdobe(tempFilePath, accessToken);

    // Create Extraction Job and Get Job ID
    const jobID = await createAdobeJob(assetID, accessToken);

    // Poll for Adobe Job Completion & Get Output URL
    const outputURL = await pollAdobeJob(jobID, accessToken);

    // Download Extracted Text
    const extractedText = await downloadExtractedText(outputURL, accessToken);

    // Send Extracted Text to OpenAI for Cleaning
    const cleanedText = await cleanTextWithOpenAI(extractedText);

    // Send Final Response
    res.json({ cleanedText });

    // Delete Temp File
    fs.unlinkSync(tempFilePath);

  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ error: "Server error processing the resume." });
  }
};
