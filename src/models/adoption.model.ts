import { D1Database } from "@cloudflare/workers-types";
import { AdoptionData, Animal } from "../types/adoption.type";

export class AdoptionModel {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async create(petData: Animal) {
    const animal = petData;

    const result = await this.db
      .prepare(
        `
        INSERT INTO adoptions ( name, age, gender, type, status, animal_id, user_email, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *`
      )
      .bind(
        animal.name,
        animal.age,
        animal.gender,
        animal.type,
        animal.status,
        animal.id,
        animal.user_email,
        animal.image || ""
      )
      .first();

    if (!result) throw new Error("Failed to insert adoption record");
    return result;
  }

  async getAdoptionByUserEmail(userEmail: string): Promise<AdoptionData[]> {
    if (!userEmail) {
      throw new Error("User email is required");
    }

    const { results } = await this.db
      .prepare(
        `
            SELECT * FROM adoptions WHERE user_email = ? ORDER BY created_at DESC`
      )
      .bind(userEmail)
      .all<AdoptionData>();

    return results || [];
  }
}
