
export interface JwtPayload {
    id: number,
    role: "student" | "faculty" | "admin"
}