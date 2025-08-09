import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authorization-service';
import { JwtTokenModel } from '../../models/jwt-token-model';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-register-area',
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './register-area.html',
    styleUrl: './register-area.css'
})
export class RegisterAreaComponent {
   

    registerForm: FormGroup;
    showPassword: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private _authService: AuthService,
        private _router :Router
    ) {
        this.registerForm = this.formBuilder.group({
            name:["",[Validators.required]],
            email: ["", [Validators.required]],
            password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
            artName: ["", [Validators.required]]
        });
    }

    onSubmit(){
        if(this.registerForm.invalid) return;
        const { name, email, password, artName } = this.registerForm.value;
        this._authService.register({
            name, 
            email, 
            password, 
            artName
        }).subscribe({
            next: (res) => {
                console.log('Registrazione avvenuta con successo:', res);  
                this._router.navigate(['/log-in-area']);
                console.warn('Token ricevuto ma userId non presente nel payload');
            },
            error: (err) => {
                console.error('Errore durante la registrazione:', err);
            }
        });
    }

    goToLogIn() {
        this._router.navigate(['/log-in-area']);
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}

