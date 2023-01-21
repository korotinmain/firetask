import { Component, OnInit } from '@angular/core';
import { signInWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '@firetasks/models';
import { Observable } from 'rxjs';
import { UserService } from '../../../../core/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  users$?: Observable<User[]>;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.users$ = this.userService.subscribeToUsers();
  }

  async loginAs(user: User) {
    console.log('loginAs', user);
    const credentials = await signInWithEmailAndPassword(getAuth(), user.email, (user as any).password);
    console.log('credentials', credentials);

    this.router.navigate(['/']);
  }
}
