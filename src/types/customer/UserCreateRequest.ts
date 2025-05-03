export interface UserCreateRequest {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    password: string;
    address: string;
    weight: number;
    height: number;
    enabled: boolean;
    photo: string;
    role: string;
}