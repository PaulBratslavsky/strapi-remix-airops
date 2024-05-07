// @ts-nocheck

const { ConversationalRetrievalQAChain } = require("langchain/chains");

class PluginManager {
  constructor() {
    this.settings = null;
  }

  async initialize(settings) {
    if (this.settings) return this.client;
    this.settings = settings;
    console.log("Initialization Complete", settings);
  }

  async createEmbedding(docs) {
    const BASE_URL = this.settings.airOpsUrl;
    const STORE_ID = this.settings.airOpsStoreId;
    const AIR_OPS_KEY = this.settings.airOpsKey;

    const path = `/public_api/vector_stores/${STORE_ID}/vector_store_documents`;
    const url = new URL(path, BASE_URL);

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + AIR_OPS_KEY,
    };

    try {
      const response = await fetch(url.href, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(docs),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to add document: ${error}`);
      throw new Error(`Failed to add document: ${error}`);
    }
  }

  async deleteEmbedding(id) {
    const BASE_URL = this.settings.airOpsUrl;
    const STORE_ID = this.settings.airOpsStoreId;
    const AIR_OPS_KEY = this.settings.airOpsKey;

    const path =
      `/public_api/vector_stores/${STORE_ID}/vector_store_documents/` + id;
    const url = new URL(path, BASE_URL);

    const headers = {
      Authorization: "Bearer " + AIR_OPS_KEY,
    };

    try {
      await fetch(url.href, {
        method: "DELETE",
        headers: headers,
      });
    } catch (error) {
      console.error(`Failed to delete document: ${error}`);
      throw new Error(`Failed to delete document: ${error}`);
    }
  }

  async queryEmbedding(query) {
    const BASE_URL = this.settings.airOpsUrl;
    const AIR_OPS_KEY = this.settings.airOpsKey;
    const AIR_OPS_CHAT_APP_ID = this.settings.airOpsChatAppId;

    const path = `/public_api/agent_apps/${AIR_OPS_CHAT_APP_ID}/chat/v2`;
    const url = new URL(path, BASE_URL);

    try {
      const response = await fetch(url.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + AIR_OPS_KEY,
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to send query: ${error}`);
      throw new Error(`Failed to send query: ${error}`);
    }
  }
}

module.exports = new PluginManager();
