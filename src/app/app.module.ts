import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { NewProjectPage } from '../pages/new-project/new-project';
import {ArrayFilterPipe} from './group.pipe';
import {AuthData} from '../providers/auth-data';
const cloudSettings: CloudSettings = {
    'core': {
        'app_id': 'fc356c54'
    }
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    NewProjectPage,
    ArrayFilterPipe
  ],
  imports: [
      IonicModule.forRoot(MyApp),
      CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    NewProjectPage
  ],
  providers: [AuthData,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
