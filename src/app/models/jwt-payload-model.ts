export interface JwtPayloadModel {
    userId: string,
    sub: string,
    iat: number, //data di creazione
    exp: number,
    [key: string]: any //expiration
}