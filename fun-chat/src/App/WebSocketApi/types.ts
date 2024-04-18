import { UserResponseType, UserType } from '../View/Validation/types';

export enum RequestType {
    LOGIN = 'USER_LOGIN',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
}

export enum ResponseType {
    LOGIN = 'USER_LOGIN',
    ERROR = 'ERROR',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
}

export interface RequestInfo {
    id: string;
    type: string;
    payload: UserPayload | null;
}

export interface ResponseInfo {
    id: string;
    type: string;
    payload: UserResponsePayload & ErrorInfo & UsersResponsePayload;
}

export interface ErrorInfo {
    error: string;
}

export interface UserPayload {
    user: UserType;
}

export interface UserResponsePayload {
    user: UserResponseType;
}

export interface UsersResponsePayload {
    users: UserResponseType[];
}

export interface CallbackErrorInfo {
    callback: (msg: string) => void;
}

export interface CallbackInfo {
    callback: () => void;
}

export interface CallbackUsersInfo {
    callback: (users: UserResponseType[]) => void;
}
