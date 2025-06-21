import { D1Database } from "@cloudflare/workers-types";
import { UserModel } from "../models/user.model";
import { UserService } from "../service/user.service";
import { UserController } from "../controllers/user.controller";
import { Controllers } from "../types/app.type";
import { AuthModel } from "../models/auth.model";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { PetController } from "../controllers/pet.controller";
import { PetService } from "../service/pet.service";
import { Env } from "../types/db.type";
import { AdoptionController } from "../controllers/adoption.controller";
import { AdoptionService } from "../service/adoption.service";
import { AdoptionModel } from "../models/adoption.model";


export class AppFactory {
  private static controllers: Controllers | null = null;

  static getControllers(db: D1Database, env: Env): Controllers {
    if (!this.controllers) {
      const { PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET } = env;

      // Models
      const userModel = new UserModel(db);
      const authModel = new AuthModel(db);
      const adoptionModel = new AdoptionModel(db);

      // Services
      const userService = new UserService(userModel);
      const authService = new AuthService(authModel);
      const petService = new PetService(PETFINDER_CLIENT_ID, PETFINDER_CLIENT_SECRET);
      const adoptionService = new AdoptionService(petService, adoptionModel);

      this.controllers = {
        user: new UserController(userService),
        auth: new AuthController(authService),
        pet: new PetController(petService),
        adoption: new AdoptionController(adoptionService)
      };
    }

    return this.controllers;
  }

  static reset(): void {
    this.controllers = null;
  }
}
