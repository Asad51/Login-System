import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AuthService implements CanActivate {
    constructor(private router: Router) {}
    canActivate() {
        if (localStorage.getItem("x-auth")) {
            return true;
        }
        this.router.navigate(["/login"]);
        return false;
    }
}
