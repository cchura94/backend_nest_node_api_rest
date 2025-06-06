import { User } from "../interfaces/user.interface";

export class RegisterAuthDto implements User{
    
    username?: string | undefined;
    email: string;
    password: string;
}