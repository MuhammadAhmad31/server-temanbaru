
export interface Animal {
    id: number;
    name: string;
    user_email: string;
    age: number;
    gender: string;
    type: string;
    status: string;
    image: string;
    primary_photo_cropped?: {
        small?: string;
        medium?: string;
        large?: string;
    };
}

export interface AdoptionData {
    animal: Animal;
}