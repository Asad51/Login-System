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

    login(loginInfo) {
        return this.http.post(this.url + "signin", loginInfo);
    }

    logout() {
        return this.http.get(this.url + "signout");
    }
}
