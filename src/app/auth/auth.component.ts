import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthRequestData } from '../services/auth.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import * as AuthActions from '../store/actions/auth.actions';
import { AppState } from '../store/reducers';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = true;
  loading = false;
  error: string | null = null;
  private closeSub: Subscription; 
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective) 
  alertHost: PlaceholderDirective;

  constructor(
    private store: AppState
  ) { }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
    this.error = null;
  }

  onSubmit(form: NgForm) {
    this.error = null;
    if (!form.valid) return;
    this.loading = true;
    const authData: AuthRequestData = {
      email: form.value['email'],
      password: form.value['password'],
      returnSecureToken: true
    };
    if (this.loginMode) {
      this.store.dispatch(AuthActions.loginStart(authData));
    } else {
      this.store.dispatch(AuthActions.signupStart(authData));
    };
    this.store.select(state => state.auth.user)
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(state => state.auth).subscribe(
      ({ loading, authError }) => {
        this.loading = loading;
        this.error = authError;
        if (this.error) {
          this.showErrorAlert(this.error)
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    };
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  onCloseError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    this.alertHost.viewContainerRef.clear();
    const alerComponentRef = this.alertHost.viewContainerRef
      .createComponent(AlertComponent);
    alerComponentRef.instance.message = message;
    this.closeSub = alerComponentRef.instance.close.subscribe(
      () => {
        this.closeSub.unsubscribe();
        this.alertHost.viewContainerRef.clear();
      }
    );
  }
}
