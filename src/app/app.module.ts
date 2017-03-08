import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { MyAccountPage } from '../pages/my-account/my-account';
import { Page2 } from '../pages/page2/page2';
import { NewProjectPage } from '../pages/new-project/new-project';
import { LoginPage } from '../pages/login/login';
import {ArrayFilterPipe} from './group.pipe';
import {AuthData} from '../providers/auth-data';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { BtnCustom } from '../components/btn-custom/btn-custom';

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': 'fc356c54'
    }
};

@NgModule({
    declarations: [
        MyApp,
        MyAccountPage,
        Page2,
        NewProjectPage,
        ArrayFilterPipe,
        LoginPage,
        CreateAccountPage,
        BtnCustom
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        CloudModule.forRoot(cloudSettings)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MyAccountPage,
        Page2,
        NewProjectPage,
        LoginPage,
        CreateAccountPage,
    ],
    providers: [AuthData,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
