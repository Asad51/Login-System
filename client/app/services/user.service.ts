import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private url = "http://localhost:3000/";

    constructor(private http: HttpClient) {}

    register(userInfo) {
        return this.http.post(this.url + "signup", userInfo);
    }
}
