import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NoAuthService, AuthService } from "./services";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { Error404Component } from "./error404/error404.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [NoAuthService]
    },
    { path: "login", component: LoginComponent, canActivate: [NoAuthService] },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthService]
    },
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "**", component: Error404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
