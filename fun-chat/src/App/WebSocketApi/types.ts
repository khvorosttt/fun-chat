import { UserResponseType, UserType } from '../View/Validation/types';

export enum RequestType {
    LOGIN = 'USER_LOGIN',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    LOGOUT = 'USER_LOGOUT',
    MSG_SEND = 'MSG_SEND',
}

export enum ResponseType {
    LOGIN = 'USER_LOGIN',
    ERROR = 'ERROR',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    LOGOUT = 'USER_LOGOUT',
    USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
    USER_EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
}

export interface RequestInfo {
    id: string;
    type: string;
    payload: UserPayload | null | MessageSendPayload;
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

export interface MessageSendPayload {
    message: MessageSendType;
}

export interface MessageSendType {
    to: string;
    text: string;
}
