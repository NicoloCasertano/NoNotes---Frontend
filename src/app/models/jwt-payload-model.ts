export interface JwtPayloadModel {
    userId: number,
    sub: string,
    userName: string;

    email: string;
    artName: string;
    authorities: string[];
    works: string[];
    iat: number, //data di creazione
    exp: number,
    [key: string]: any; //expiration
}