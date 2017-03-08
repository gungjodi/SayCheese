import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthData } from '../../providers/auth-data';
import { CreateAccountPage } from '../create-account/create-account';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    public loginForm: any;
    public loading: any;

    constructor(public navCtrl: NavController,
                public formBuilder: FormBuilder, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,public authData:AuthData)
    {
        this.loginForm = formBuilder.group({
            email: ['kk@kk.com', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['garuda', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    loginUser(){
        if (!this.loginForm.valid){
            console.log(this.loginForm.value);
        }
        else
        {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then( authData => {
                    this.authData.loginEvent();
                },(error)=>{
                    this.loading.dismiss().then( () => {
                        let alert = this.alertCtrl.create({
                            title:'Failed',
                            subTitle:"Failed to Login",
                            buttons:['OK']
                        });
                        alert.present();
                    });
                });
            this.loading = this.loadingCtrl.create({
                dismissOnPageChange: true,
            });

            this.loading.present();
        }

    }

    createAccount()
    {
        this.navCtrl.push(CreateAccountPage);
    }
}
