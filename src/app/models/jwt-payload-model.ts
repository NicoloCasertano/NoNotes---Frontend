export interface JwtPayloadModel {
    userId: string,
    sub: number,
    iat: number, //data di creazione
    exp: number,
    [key: string]: any //expiration
}