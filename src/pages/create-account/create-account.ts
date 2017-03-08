import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthData} from "../../providers/auth-data";
import {EmailValidator} from "../../validators/email";
import {MyAccountPage} from "../../pages/my-account/my-account";
import { IDetailedError } from '@ionic/cloud-angular';
/*
  Generated class for the CreateAccount page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html'
})

export class CreateAccountPage {
    public registerForm: any;
    public loading: any;
    constructor(public navCtrl: NavController, public navParams: NavParams,
                public formBuilder: FormBuilder, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,public authData:AuthData)
    {
        this.registerForm = formBuilder.group({
            name:['GJGJ'],
            email: ['kk@kk.com', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['garuda', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    doCreateAccount()
    {
        if (!this.registerForm.valid){
            console.log(this.registerForm.value);
        }
        else
        {
            this.authData.signUp(this.registerForm.value.name,this.registerForm.value.email,this.registerForm.value.password).then(() => {
                this.loading.dismiss().then( () => {
                    let alert = this.alertCtrl.create({
                        title:'Success',
                        subTitle:"Successfuly Registered",
                        buttons:[{
                            text:'OK',
                            handler:()=>{
                                console.log("LOGIN NOW");
                                this.authData.loginUser(this.registerForm.value.email, this.registerForm.value.password)
                                    .then( authData => {
                                        this.authData.updateName(this.registerForm.value.name);
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
                        }]
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
