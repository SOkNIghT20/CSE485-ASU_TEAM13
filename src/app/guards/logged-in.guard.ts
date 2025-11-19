import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Event } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard  {

  constructor(private router: Router,private auth: AuthService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      return true;
    }

    // logged in so redirect to search page
    this.router.navigate(['/search']);
    // CHANGE TO FALSE TO REACTIVATE GUARD
    return true;
  }
}
