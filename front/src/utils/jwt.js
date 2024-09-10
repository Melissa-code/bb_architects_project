import { jwtDecode } from "jwt-decode";

export function getUserRole(){
    const token = localStorage.getItem('BBStorage_token')
    return jwtDecode(token)
}