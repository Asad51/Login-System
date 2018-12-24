import { ToastrService } from "ngx-toastr";
import { UserService } from "./../services";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
    user: Object = null;
    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userService.getProfile().subscribe(
            data => {
                this.user = data;
            },
            err => {
                this.toastr.error(err.error["error"]);
                this.router.navigate(["login"]);
            }
        );
    }
}
