
export interface Animal {
    id: number;
    name: string;
    user_email: string;
    age: number;
    gender: string;
    type: string;
    status: string;
    image: string;
}

export interface AdoptionData {
    animal: Animal;
}