import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Stock Tracker';

  constructor(private router: Router, public authService: AuthService) {

  }

  active(url: string): boolean {
    return this.router.url === url;
  }

  logout() {
    this.authService.logout();
  }
}
