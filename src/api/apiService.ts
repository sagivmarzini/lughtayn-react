import { Client } from "@gradio/client";

class ApiService {
  private client: any | null = null;
  initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    try {
      this.client = await Client.connect("guymorlan/levanti_he_ar");
    } catch (error) {
      console.error("Failed to initialize Gradio client:", error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    await this.initialized;
  }

  async fetchSentences(): Promise<string[]> {
    await this.ensureInitialized();
    try {
      const response = await fetch('/hebrew-sentences.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Hebrew sentences:', error);
      return [];
    }
  }

  async translateSentence(sentence: string): Promise<string> {
    await this.ensureInitialized();
    try {
      if (!this.client) {
        throw new Error("Client not initialized");
      }
      const result = await this.client.predict("/run_translate", {
        text: sentence
      });
      return result.data[1];
    } catch (error) {
      console.error('Error translating sentence:', error);
      return '';
    }
  }

  async diacritizeSentence(arabicSentence: string): Promise<string> {
    await this.ensureInitialized();
    try {
      if (!this.client) {
        throw new Error("Client not initialized");
      }
      const result = await this.client.predict("/diacritize", {
        text: arabicSentence
      });
      return result.data[0];
    } catch (error) {
      console.error('Error diacritizing sentence:', error);
      return '';
    }
  }

  async generateTaatik(diacritizedSentence: string): Promise<string> {
    await this.ensureInitialized();
    try {
      if (!this.client) {
        throw new Error("Client not initialized");
      }
      const result = await this.client.predict("/taatik", {
        text: diacritizedSentence
      });
      return result.data[0];
    } catch (error) {
      console.error('Error generating taatik:', error);
      return '';
    }
  }

  async generateSentenceAudio(sentence: string): Promise<string> {
    await this.ensureInitialized();
    try {
      if (!this.client) {
        throw new Error("Client not initialized");
      }
      const result = await this.client.predict("/get_audio", {
        input_text: sentence
      });
      return result.data[0].url;
    } catch (error) {
      console.error('Error generating sentence audio:', error);
      return '';
    }
  }
}

export default new ApiService();
