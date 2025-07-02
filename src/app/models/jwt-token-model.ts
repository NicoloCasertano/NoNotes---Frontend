import { AuthorityModel } from "./authority-model"

export interface JwtTokenModel {
    token: string
    username: string,
    authorities: AuthorityModel[]
}