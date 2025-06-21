import axios from "axios";
type PetCache = {
  [type: string]: {
    data: any;
    expiry: number;
  };
};

export class PetService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private cache: PetCache = {};

  constructor(private clientId: string, private clientSecret: string) {}

  private async authenticate() {
    const now = Math.floor(Date.now() / 1000);

    if (this.accessToken && this.tokenExpiry > now) {
      return this.accessToken;
    }

    const response = await axios.post(
      "https://api.petfinder.com/v2/oauth2/token",
      {
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = now + response.data.expires_in;

    return this.accessToken;
  }

  public async getPets(type: string) {
    const now = Math.floor(Date.now() / 1000);

    const cached = this.cache[type];
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const token = await this.authenticate();

    const response = await axios.get(
      `https://api.petfinder.com/v2/animals?type=${encodeURIComponent(type)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    this.cache[type] = {
      data: response.data,
      expiry: now + 60,
    };

    return response.data;
  }

  public async getPetById(id: string) {
    const token = await this.authenticate();
    const response = await axios.get(
      `https://api.petfinder.com/v2/animals/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
}
