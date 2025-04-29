import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.sass'],
  standalone: false,
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
 

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  submitUser(): void {
    if (this.addUserForm.valid) {
      const formValue = this.addUserForm.value;
  
      const newUser = {
        username: formValue.username,
        password: formValue.password,
        role: formValue.role,
        myList: []
      };
  
      const success = this.userService.addUser(newUser);
  
      if (success) {
        this.snackBar.open('User added successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.snackBar.open('Username already exists or not allowed', 'Close', { duration: 3000 });
      }
    }
  }
}
