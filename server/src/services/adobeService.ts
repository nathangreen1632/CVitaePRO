import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

type AdobeAuthResponse = {
  access_token: string;
  expires_in: number;
};

const ADOBE_API_URL = 'https://pdf-services.adobe.io';

const getAdobeAccessToken = async (): Promise<string> => {
  const response = await fetch(`${ADOBE_API_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.ADOBE_CLIENT_ID!,
      client_secret: process.env.ADOBE_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  });
  const data: AdobeAuthResponse = await response.json();
  return data.access_token;
};

export const processAdobePDF = async (filePath: string): Promise<string> => {
  const accessToken = await getAdobeAccessToken();

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await fetch(`${ADOBE_API_URL}/extract-pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to process PDF with Adobe API');
  }

  const { extractedText } = await response.json();
  return extractedText;
};
