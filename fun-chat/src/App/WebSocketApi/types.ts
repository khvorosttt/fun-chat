import { UserResponseType, UserType } from '../View/Validation/types';

export enum RequestType {
    LOGIN = 'USER_LOGIN',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    LOGOUT = 'USER_LOGOUT',
    MSG_SEND = 'MSG_SEND',
    MSG_FROM_USER = 'MSG_FROM_USER',
    MSG_READ = 'MSG_READ',
}

export enum ResponseType {
    LOGIN = 'USER_LOGIN',
    ERROR = 'ERROR',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    LOGOUT = 'USER_LOGOUT',
    USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
    USER_EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
    MSG_SEND = 'MSG_SEND',
    MSG_FROM_USER = 'MSG_FROM_USER',
    MSG_DELIVER = 'MSG_DELIVER',
    MSG_READ = 'MSG_READ',
}

export interface RequestInfo {
    id: string;
    type: string;
    payload: UserPayload | null | MessageSendPayload | MessageRequaredReadPayload;
}

export interface ResponseInfo {
    id: string;
    type: string;
    payload: UserResponsePayload &
        ErrorInfo &
        UsersResponsePayload &
        MessagesSendResponse &
        MessageSendResponse &
        MessageResponseStatusPayload;
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

export interface CallbackMessageInfo {
    callback: (message: MessageSendResponseType) => void;
}

export interface CallbackMessagesInfo {
    callback: (messages: MessageSendResponseType[]) => void;
}

export interface MessageSendPayload {
    message: MessageSendType;
}

export interface MessageSendType {
    to: string;
    text: string;
}

export interface Status {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
}

export interface MessageSendResponse {
    message: MessageSendResponseType;
}

export interface MessagesSendResponse {
    messages: MessageSendResponseType[];
}

export interface MessageSendResponseType {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: Status;
}

export interface MessageResponseStatusPayload {
    message: MessageResponseDeliveredType | MessageResponseReadType;
}

export interface MessageResponseDeliveredType {
    id: string;
    status: Pick<Status, 'isDelivered'>;
}

export interface MessageRequaredReadPayload {
    message: MessageRequaredReadType;
}

export interface MessageRequaredReadType {
    id: string;
}

export interface MessageResponseReadType {
    id: string;
    status: Pick<Status, 'isReaded'>;
}

export interface CallbackDeliveredInfo {
    callback: (message: MessageResponseDeliveredType) => void;
}

export interface CallbackReadedInfo {
    callback: (message: MessageResponseReadType) => void;
}
