export interface UserType {
    login: string;
    password?: string;
}

export interface UserResponseType {
    login: string;
    isLogined: boolean;
}
