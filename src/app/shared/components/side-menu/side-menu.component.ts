import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  usuario: string = '';

  constructor(
    private authService: AuthService) {
    if ( this.authService.user$ ) {
      this.authService.user$.subscribe( user => {
        if ( user ) {
          this.usuario = user.name;
        } else {
          this.usuario = '';
        }
      });
    }
  }
  ngOnInit() {}

  onLogOut() {
    this.authService.logout();
  }
}
