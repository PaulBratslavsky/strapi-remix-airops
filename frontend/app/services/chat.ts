


export async function chat(videoId: string, query: string) {
  const airOpsApiKey = process.env.AIR_OPS_API_KEY;
  const airOpsAppId = process.env.AIR_OPS_APP_ID;
  const airOpsUrl = process.env.AIR_OPS_URL;

  const path = `/public_api/agent_apps/${airOpsAppId}/chat/v2`;
  const url = new URL(path, airOpsUrl);

  try {
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + airOpsApiKey,
      },
      body: JSON.stringify({ message: query }),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Failed to send query: ${error}`);
    throw new Error(`Failed to send query: ${error}`);
  }

}






