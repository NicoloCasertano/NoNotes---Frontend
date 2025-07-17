import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
    userId!: number;
    roleName: string = 'ADMIN';
    success = false;
    error: string| null = null;
    private userService = inject(UserService);

    promote() {
      this.success = false;
      this.error   = null;

      this.userService.updateUserRole(this.userId)
        .subscribe({
          next: () => this.success = true,
          error: (err) => this.error = err.message || 'Errore generico'
        });
    }
}
