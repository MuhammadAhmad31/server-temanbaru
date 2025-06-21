import { AdoptionModel } from "../models/adoption.model";
import { Animal } from "../types/adoption.type";
import { PetService } from "./pet.service";

export class AdoptionService {
  constructor(private petService: PetService, private adoptionModel: AdoptionModel) {}

  async processAdoption(animalId: string, userEmail: string) {
    const animalData = await this.petService.getPetById(animalId);

    const dataToSave: Animal = {
      id: animalData.animal.id,
      name: animalData.animal.name,
      type: animalData.animal.type,
      age: animalData.animal.age,
      gender: animalData.animal.gender,
      status: animalData.animal.status,
      user_email: userEmail,
      image: animalData.animal.primary_photo_cropped.small || "",
    };

    return await this.adoptionModel.create(dataToSave);
  }

   async getAdoptionByUserEmail(userEmail: string) {
    if (!userEmail) {
      throw new Error("User email is required");
    }

    const adoptionRequests = await this.adoptionModel.getAdoptionByUserEmail(userEmail);
    
    if (!adoptionRequests || adoptionRequests.length === 0) {
      return [];
    }

    return adoptionRequests;
   }
}
