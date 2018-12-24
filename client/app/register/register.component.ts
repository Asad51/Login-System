import { UserService } from "./../services";
import { PasswordValidator } from "./password-validator";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
    registrationForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        this.registrationForm = this.fb.group(
            {
                name: ["", [Validators.required, Validators.minLength(4)]],
                userName: ["", [Validators.required, Validators.minLength(4)]],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required, Validators.minLength(4)]],
                confirmPassword: [
                    "",
                    [Validators.required, Validators.minLength(4)]
                ]
            },
            {
                validator: PasswordValidator.MatchPassword
            }
        );
    }

    onRegistrationFormSubmit() {
        if (this.registrationForm.invalid) {
            return;
        }

        this.userService
            .register(this.registrationForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.toastr.success(data["success"]);
                    this.router.navigate(["/login"]);
                },
                err => {
                    if (err.error["error"]) {
                        for (let e of err.error["error"]) {
                            this.toastr.error(e);
                        }
                    } else {
                        this.toastr.error("Something went wrong.");
                    }
                    this.router.navigate(["/register"]);
                }
            );
    }

    get name() {
        return this.registrationForm.get("name");
    }

    get userName() {
        return this.registrationForm.get("userName");
    }

    get email() {
        return this.registrationForm.get("email");
    }

    get password() {
        return this.registrationForm.get("password");
    }

    get confirmPassword() {
        return this.registrationForm.get("confirmPassword");
    }
}
