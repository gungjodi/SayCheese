import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, Events} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { NewProjectPage } from '../pages/new-project/new-project';
import {AuthData} from '../providers/auth-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any=Page1;
    pages: Array<{title: string, component: any}>;
    public userData:any;
    public loggedIn:boolean=false;

    constructor(public platform: Platform,public auth:AuthData,public events:Events) {
        this.initialize();
        // used for an example of ngFor and navigation
        this.pages = [
          { title: 'My Account', component: Page1 },
          { title: 'Page Two', component: Page2 },
          { title: 'New Project', component: NewProjectPage}
        ];


        this.listenToLoginEvents();
    }

    initialize() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openPage(page) {
      this.nav.setRoot(page.component);
    }

    logout()
    {
      this.auth.logout();
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            console.log("LOGGEDIN")
            this.updateData()
        });

        this.events.subscribe('user:signup', () => {
            console.log("SIGNUP")
            this.updateData()
        });

        this.events.subscribe('user:logout', () => {
            console.log("LOGGEDOUT")
            this.updateData()
        });
    }

    updateData()
    {
        if(this.auth.authData.loggedIn)
        {
            this.rootPage=NewProjectPage;
            this.userData=this.auth.authData.data;
            this.loggedIn=true;
        }
        else
        {
            this.rootPage=Page1;
            this.userData={name:''};
        }
    }
}
