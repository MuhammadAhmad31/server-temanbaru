import { PetService } from "../service/pet.service";
import { AppContext } from "../types/app.type";
import { ApiResponseBuilder } from "../types/responseApi.type";

export class PetController {
  private petService: PetService;

  constructor(petService: PetService) {
    this.petService = petService;
  }

  async getPets(c: AppContext) {
    try {
      const url = new URL(c.req.url);
      const type = url.searchParams.get('type') || 'cat';

      const pets = await this.petService.getPets(type);

      const response = ApiResponseBuilder.success(
        pets,
        `Pets of type '${type}' retrieved successfully`,
        pets.animals?.length ?? 0
      );

      return c.json(response, 200);
    } catch (error) {
      console.error('PetController.getPets error:', error);
      
      const response = ApiResponseBuilder.internalError('Failed to fetch pets from Petfinder API');
      return c.json(response, 500);
    }
  }
}
