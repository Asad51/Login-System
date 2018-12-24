import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private url = "http://localhost:3000/";
    headers = new HttpHeaders().append("Content-Type", "application/json");
    options: Object = {
        observe: "body",
        withCredentials: true,
        headers: this.headers
    };

    constructor(private http: HttpClient) {}

    register(userInfo) {
        return this.http.post(this.url + "signup", userInfo, this.options);
    }

    login(loginInfo) {
        return this.http.post(this.url + "signin", loginInfo, this.options);
    }

    getProfile() {
        return this.http.get(this.url + "dashboard", this.options);
    }

    logout() {
        return this.http.get(this.url + "signout", this.options);
    }
}
