import { AdoptionService } from "../service/adoption.service";
import { AppContext } from "../types/app.type";
import { ApiResponseBuilder } from "../types/responseApi.type";

export class AdoptionController {
  private adoptionService: AdoptionService;

  constructor(adoptionService: AdoptionService) {
    this.adoptionService = adoptionService;
  }
  async postAdoptionRequest(c: AppContext) {
    try {
      const { id } = c.req.param();

      if (!id) {
        ApiResponseBuilder.notFound(`Animal with id ${id} not found.`);
      }

      const userEmail = c.get("jwtPayload")?.email;

      if (!userEmail) {
        return c.json(
          ApiResponseBuilder.unauthorized("User email not found in token"),
          401
        );
      }

      const adoption = await this.adoptionService.processAdoption(
        id,
        userEmail
      );
      if (!adoption) {
        return c.json(
          ApiResponseBuilder.notFound(`Animal with id ${id} not found.`),
          404
        );
      }

      const response = ApiResponseBuilder.success(
        adoption,
        "Adoption request processed successfully"
      );
      return c.json(response, 200);
    } catch (err) {
      console.error("postAdoptionRequest error:", err);
      return c.json({ code: 500, message: "Internal Server Error" }, 500);
    }
  }

  async getAdoption(c: AppContext) {
    try {
      const userEmail = c.get("jwtPayload")?.email;

      if (!userEmail) {
        return c.json(
          ApiResponseBuilder.unauthorized("User email not found in token"),
          401
        );
      }

      const requests = await this.adoptionService.getAdoptionByUserEmail(
        userEmail
      );
      const response = ApiResponseBuilder.success(
        requests,
        "Adoption requests retrieved successfully"
      );
      return c.json(response, 200);
    } catch (err) {
      console.error("getAdoptionRequests error:", err);
      return c.json({ code: 500, message: "Internal Server Error" }, 500);
    }
  }
}
