export interface JwtPayloadModel {
    userId: number,
    sub: string,
    iat: number, //data di creazione
    exp: number,
    [key: string]: any; //expiration
}