import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, Events} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MyAccountPage } from '../pages/my-account/my-account';
import { NewProjectPage } from '../pages/new-project/new-project';
import {AuthData} from '../providers/auth-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any=MyAccountPage;
    pages: Array<{title: string, component: any}>;
    public userData:any;

    constructor(public platform: Platform,public auth:AuthData,public events:Events) {
        this.initialize();
        this.pages = [
          { title: 'My Account', component: MyAccountPage },
          { title: 'New Project', component: NewProjectPage}
        ];
        this.listenToLoginEvents();
        this.updateData();
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
        if(this.auth.getLoginStatus())
        {
            this.nav.setRoot(page.component);
        }
        else
        {
            this.rootPage=MyAccountPage;
        }
    }

    logout()
    {
      this.auth.logout();
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            console.log("LOGGEDIN EVENT")
            this.updateData()
        });

        this.events.subscribe('user:registered', () => {
            console.log("REGISTERED EVENT")
        });

        this.events.subscribe('user:updated', () => {
            console.log("UPDATED EVENT")
            this.updateData()
        });

        this.events.subscribe('user:logout', () => {
            console.log("LOGGEDOUT EVENT")
            this.updateData()
        });
    }

    updateData()
    {
        if(this.auth.getLoginStatus())
        {
            this.rootPage=NewProjectPage;
        }
        else
        {
            this.rootPage=MyAccountPage;
        }
        this.userData = this.auth.getAuthData();
    }
}
