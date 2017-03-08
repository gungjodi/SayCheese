import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
    public authData:any;
    constructor(public auth: Auth, public user: User,public events: Events) {
        if (this.auth.isAuthenticated()) {
            this.authData = {loggedIn:true,data:user.details};
        }
        else
        {
            this.authData = {loggedIn:false,data:''};
        }
    }

    loginUser(newEmail: any, newPassword: any)
    {
        this.authData = {loggedIn:true,data:this.user.details};
        this.events.publish('user:login');
        return this.auth.login('basic',{email: newEmail, password: newPassword});
    }

    logout() {
        this.authData = {loggedIn:false,data:''};
        this.events.publish('user:logout');
        this.auth.logout();
    }

    signUp(email: string, password: string) {
        return this.auth.signup({'email':email, 'password':password});
    }


}
