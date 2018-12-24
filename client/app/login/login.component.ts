import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

import { UserService } from "./../services";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            userName: ["", [Validators.required, Validators.minLength(4)]],
            password: ["", [Validators.required, Validators.minLength(4)]]
        });
    }

    onLoginFormSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.userService
            .login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                async data => {
                    this.toastr.success(data["success"]);
                    localStorage.setItem("x-auth", data["token"]);
                    this.router.navigate(["dashboard"]);
                },
                err => {
                    if (err.error["error"]) {
                        localStorage.removeItem("x-auth");
                        this.toastr.error(err.error["error"]);
                        this.router.navigate(["login"]);
                    } else {
                        this.toastr.error(
                            "Something Went Wrong. Please Try Again Later."
                        );
                    }
                }
            );
    }

    get userName() {
        return this.loginForm.get("userName");
    }
    get password() {
        return this.loginForm.get("password");
    }
}
