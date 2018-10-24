import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Stock Tracker';

  constructor(private router: Router, public authService: AuthService, public translate: TranslateService) {
    translate.setDefaultLang(translate.getBrowserLang());
  }

  switchLanguage(language: string) {
    this.translate.setDefaultLang(language);
  }

  active(url: string): boolean {
    return this.router.url === url;
  }

  logout() {
    this.authService.logout();
  }
}
