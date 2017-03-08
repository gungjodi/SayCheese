import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html'
})
export class MyAccountPage {
    constructor(public navCtrl: NavController,public auth:AuthData)
    {
      if(!this.auth.getLoginStatus())
      {
          this.navCtrl.setRoot(LoginPage);
      }
    }

    doLogout()
    {
        this.auth.logout();
    }
}
