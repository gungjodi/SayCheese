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
    constructor(public auth: Auth, public user: User,public events: Events) {}

    getLoginStatus()
    {
        return this.auth.isAuthenticated();
    }

    loginEvent()
    {
        this.events.publish('user:login');
    }

    registeredEvent()
    {
        this.events.publish('user:registered');
    }

    getAuthData()
    {
        return this.user.details;
    }

    loginUser(newEmail: any, newPassword: any)
    {
        return this.auth.login('basic',{email: newEmail, password: newPassword});
    }

    logout() {
        this.auth.logout();
        this.events.publish('user:logout');
    }

    signUp(name:string,email: string, password: string) {
        return this.auth.signup({'email':email, 'password':password});
    }

    updateName(name:string)
    {
        this.user.details.name=name;
        this.user.save();
        this.user.load().then(()=>{
            this.events.publish('user:updated');
        },(err)=>{
            console.log(err);
        });
    }

}
