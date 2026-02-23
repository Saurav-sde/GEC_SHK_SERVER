
export interface JwtPayload {
    id: number,
    role: "STUDENT" | "FACULTY" | "ADMIN"
}