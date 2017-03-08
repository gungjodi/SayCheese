import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthData } from '../../providers/auth-data';
import { NewProjectPage } from '../../pages/new-project/new-project';
import { IDetailedError } from '@ionic/cloud-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
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
                this.navCtrl.setRoot(NewProjectPage);
            },(error)=>{
                console.log(error);
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

    doCreateAccount()
    {
        if (!this.loginForm.valid){
            console.log(this.loginForm.value);
        }
        else
        {
            this.authData.signUp(this.loginForm.value.email,this.loginForm.value.password).then(() => {
                this.loading.dismiss().then( () => {
                    let alert = this.alertCtrl.create({
                        title:'Success',
                        subTitle:"Successfuly Registered",
                        buttons:['OK']
                    });
                    alert.present();
                });
            }, (err: IDetailedError<string[]>) => {
                for (let e of err.details) {
                    let errors = '';
                    if(e === 'required_email') errors += 'Email is required.<br/>';
                    if(e === 'required_password') errors += 'Password is required.<br/>';
                    if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
                    //don't need to worry about conflict_username
                    if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
                    this.loading.dismiss().then( () => {
                        let alert = this.alertCtrl.create({
                            title:'Failed',
                            subTitle:errors,
                            buttons:['OK']
                        });
                        alert.present();
                    });
                }
            });
            this.loading = this.loadingCtrl.create({
                dismissOnPageChange: true,
            });
            this.loading.present();
        }

    }
}
