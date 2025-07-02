import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authorization-service';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../models/user-model';
import { JwtTokenModel } from '../../models/jwt-token-model';
import { UserService } from '../../services/user-service';
import { UserNoPassModel } from '../../models/user-nopass-model';

@Component({
    selector: 'app-log-in-area',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './log-in-area.html',
    styleUrl: './log-in-area.css'
})
export class LogInArea {
    formBuilder = inject(FormBuilder);
    private _authService = inject(AuthService);
    private _router = inject(Router);

    loginForm: FormGroup = this.formBuilder.group({
        email:["", [Validators.required]],
        password:["", [Validators.required]]
    });
    
    onSubmit() {
        if(this.loginForm.invalid) return;
        
        this._authService.login(this.loginForm.value).subscribe({
            next:(response: JwtTokenModel) => {
                const token = response.token;

                if(token) {
                    this._authService.setToken(token);
                    this._router.navigate(['/home']);
                } else {
                    console.error('Token non presente nella risposta');
                }
            },
            error: (err: any) => {
                console.log('Errore durante il login: ', err);
            }
            
        });
        
    }

    gotToSignIn() {
        this._router.navigate(['/register-area']);
    }
    
}
