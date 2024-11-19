import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';
import type {OpenAIService} from '../base/openAiServices.ts';

export class VectorService {
  private client: QdrantClient;
  private openAIService: OpenAIService;

  constructor(openAIService: OpenAIService) {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
    this.openAIService = openAIService;
  }

  async ensureCollection(name: string) {
    const collections = await this.client.getCollections();
    if (!collections.collections.some(c => c.name === name)) {
      await this.client.createCollection(name, {
        vectors: { size: 3072, distance: "Cosine" }
      });
    }
  }

  async hasCollection(name: string) {
    const collections = await this.client.getCollections();
   return collections.collections.some(c  => c.name === name);
  }

  async addPoints(collectionName: string, points: { id: string, text: string, tags: string[] }[]) {
    const pointsToUpsert = await Promise.all(points.map(async point => {
      const embedding = await this.openAIService.createEmbedding(point.text);
      let id = point.id;
      point.id = '';
      return {
        id: id,
        vector: embedding,
        payload: point
      };
    }));

    await this.client.upsert(collectionName, {
      wait: true,
      points: pointsToUpsert
    });
  }

  async performSearch(collectionName: string, query: string, limit: number = 5, tags:string[]= []) {
    const queryEmbedding = await this.openAIService.createEmbedding(query);
    return this.client.search(collectionName, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
      filter: {
        should: tags.map(tag=> {
          return { key: 'tags', match: { value: tag } }
        })
      }
    });
  }
}
