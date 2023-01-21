import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthRouting } from './auth.routing';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        AuthRouting,
        MatButtonModule,
    ],
  declarations: [
    LoginComponent,
  ],
})
export class AuthModule {
}
