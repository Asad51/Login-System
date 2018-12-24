import { ToastrService } from "ngx-toastr";
import { UserService } from "./../services";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
    constructor(
        private userService: UserService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit() {}

    isLoggedIn() {
        if (localStorage.getItem("x-auth")) {
            return true;
        } else {
            return false;
        }
    }

    onLogout() {
        this.userService.logout().subscribe(
            data => {
                this.toastr.success(data["success"]);
            },
            err => {
                this.toastr.error(err.error["error"]);
            }
        );
        localStorage.removeItem("x-auth");
        this.router.navigate(["login"]);
    }
}
