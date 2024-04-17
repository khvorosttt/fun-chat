import { UserResponseType, UserType } from '../View/Validation/types';

export enum RequestType {
    LOGIN = 'USER_LOGIN',
}

export enum ResponseType {
    LOGIN = 'USER_LOGIN',
    ERROR = 'ERROR',
}

export interface RequestInfo {
    id: string;
    type: string;
    payload: UserPayload;
}

export interface ResponseInfo {
    id: string;
    type: string;
    payload: UserResponsePayload & ErrorInfo;
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

export interface CallbackErrorInfo {
    callback: (msg: string) => void;
}

export interface CallbackInfo {
    callback: () => void;
}
