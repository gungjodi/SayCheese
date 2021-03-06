import {Component, ViewChild, OnInit,ElementRef} from '@angular/core';
import {NavController,Platform, NavParams, AlertController, Slides, ToastController, LoadingController, Loading} from 'ionic-angular';
import {Camera, File, Transfer, FilePath} from 'ionic-native';
import {waitRendered} from '../../components/utils';
import * as domtoimage from 'dom-to-image';
import { AuthData } from '../../providers/auth-data';
/*
  Generated class for the NewProject page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova:any;

@Component({
    selector: 'page-new-project',
    templateUrl: 'new-project.html'
})

export class NewProjectPage implements OnInit{
    @ViewChild(Slides) slides: Slides;
    images:any[];
    data:any;
    slidesArray:any[];
    activeSlide:number;
    isDevice:boolean = false;
    dW:number;
    dH:number;
    dom:any;
    lastImage: string = null;
    loading: Loading;
    imgUrl:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public alertCtrl:AlertController,private platform: Platform,
                private _elementRef:ElementRef,public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,public authData:AuthData) {
        this.images = [
            {url:'assets/images/image4.jpg',slideIndex:1},
            {url:'assets/images/image2.jpg',slideIndex:2}
        ];

        this.slidesArray=[{slideTitle:'Slide 1'},{slideTitle:'Slide 2'}];
        this.activeSlide=1;
        this.dW = this.platform.width();
        this.dH = this.platform.height();
    };

    public ngOnInit() {
        let swiperContainer = this._elementRef.nativeElement.getElementsByClassName('swiper-container')[0];
        waitRendered(swiperContainer).then(()=>{
            this.slides.update();
        });
        // let email = this.authData.getAuthData().email;
        // console.log(email);
    }

    deleteSlide(index)
    {
        this.deleteByValue(index);
        let deleted=index-1;
        //
        this.slidesArray.splice(deleted,1);
        this.slides.update();
        // this.updateByValue(index);
        this.slides.slidePrev();
        console.log("IMAGES: ",this.images);
    }

    detail(image)
    {
        console.log(image)
    }


    deleteByValue(val) {
        for(let i=0;i<this.images.length;i++)
        {
            if(this.images[i].slideIndex==val)
            {
                console.log("DELETED: ",this.images[i]);
                this.images.splice(i,1);
            }
        }
        for(let i=0;i<this.images.length;i++)
        {
            if(this.images[i].slideIndex>val)
            {
                console.log("UPDATED FROM: ",this.images[i]);
                this.images[i].slideIndex-=1;
                console.log("UPDATED TO: ",this.images[i]);
            }
        }
    }

    addSlide()
    {
        this.slidesArray.push({slideTitle:'Slide '});
        if(this.slidesArray.length==1)
        {
          this.activeSlide = this.slides.getActiveIndex()+1;
        }
        this.slides.update();
        console.log("IMAGES: ",this.images);
    }

    slideChanged() {
        let currentIndex = this.slides.getActiveIndex()+1;
        // let previousIndex = this.slides.getPreviousIndex()+1;
        if(this.slidesArray.length<=1)
        {
          currentIndex=0;
        }
        this.activeSlide = currentIndex;
        console.log("Current index is", this.activeSlide);
    }

    printImage(index)
    {
        console.log('image'+index);
        let div = document.getElementById('image'+index);
        console.log(div);
        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();
        domtoimage.toJpeg(div,{quality:0.95})
            .then((dataUrl) => {
                let img = new Image();
                img.src = dataUrl;
                // console.log(dataUrl);
                // this.uploadImage(dataUrl);
                document.getElementById("printed").appendChild(img);
                this.loading.dismissAll();
            })
            .catch((error)=>{
                console.error('oops, something went wrong!', error);
                this.loading.dismissAll();
                this.presentToast('oops, something went wrong!');
            });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    public uploadImage(dataurl) {

        // Destination URL
        let email = this.authData.getAuthData().email;
        let url = "http://findoctor.esy.es/saycheese/upload.php?email="+email;

        // let targetPath = dataurl;
        // let filename = "page_"+this.activeSlide+".png";

        for(let i=0;i<this.images.length;i++)
        {
            if(this.images[i].slideIndex==this.activeSlide)
            {
                console.log("DELETED TO UPDATE : ",this.images[i]);

                var targetPath = this.pathForImage(this.images[i]);
                var filename = "page_"+this.activeSlide+".png";
                const fileTransfer = new Transfer();
                let options = {
                    fileKey: "file",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "multipart/form-data",
                    params : {'fileName': filename}
                };
                // Use the FileTransfer to upload the image
                fileTransfer.upload(targetPath, url, options).then(data => {
                    this.loading.dismissAll()
                    this.presentToast('Image '+this.activeSlide+' succesfully uploaded.');
                    console.log(data);
                }, err => {
                    this.loading.dismissAll()
                    this.presentToast('Error while uploading file.');
                    console.log('Error while uploading file.',err);
                });
            }
        }




    }

    pickImage2()
    {
        if(this.activeSlide!=null)
        {
            console.log(this.images);
            for(let i=0;i<this.images.length;i++)
            {
                if(this.images[i].slideIndex==this.activeSlide)
                {
                    console.log("DELETED TO UPDATE : ",this.images[i]);
                    this.images.splice(i,1);
                }
            }
            this.slides.update();
        }

        let options = {
            maximumImagesCount: 1,
            sourceType        : Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType : Camera.DestinationType.FILE_URI,
            encodingType:Camera.EncodingType.JPEG,
            correctOrientation:true
        };

        Camera.getPicture(options).then((imagePath) => {
            if(this.activeSlide!=null)
            {
                // this.images.push({url:result,slideIndex:this.activeSlide});
                if (this.platform.is('android')) {
                    FilePath.resolveNativePath(imagePath)
                        .then(filePath => {
                            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                            console.log("P : "+correctPath+" - N : "+currentName);
                        });
                } else {
                    var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                    var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                }
            }

          },err=>{
            this.presentToast('Error while selecting image.');
        });

    }

    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            let path = this.pathForImage(this.lastImage);
            this.images.push({url:path,slideIndex:this.activeSlide});
            console.log(this.images);
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    pickImage()
    {

        if(this.activeSlide!=null)
        {
            console.log(this.images);
            for(let i=0;i<this.images.length;i++)
            {
                if(this.images[i].slideIndex==this.activeSlide)
                {
                    console.log("DELETED TO UPDATE : ",this.images[i]);
                    this.images.splice(i,1);
                }
            }
            this.slides.update();
        }

        if(!this.platform.is("mobileweb"))
        {
            let i = Math.floor((Math.random()*4)+1);
            let url = 'assets/images/image'+i+'.jpg';

            if(this.activeSlide!=null)
            {
                this.images.push({url:url,slideIndex:this.activeSlide});
                console.log(this.images);
            }
            // ImagePicker.hasReadPermission().then(result=>{
            //   if(!result)
            //   {
            //     ImagePicker.requestReadPermission();
            //   }
            // });

            //   ImagePicker.getPictures(this.options).then((results) => {
            //     for (let i = 0; i < results.length; i++) {
            //       console.log('Image URI: ' + results[i]);
            //         if(this.activeSlide!=null)
            //         {
            //             if (this.platform.is('android')) {
            //                 this.images.push({url:results[i],slideIndex:this.activeSlide});
            //             }
            //             else
            //             {
            //                 this.images.push({url:results[i],slideIndex:this.activeSlide});
            //             }
            //
            //             console.log(this.images);
            //         }
            //     }
            //   }, (err) => { });
            // }
        }
        else
        {
          let i = Math.floor((Math.random()*4)+1);
          let url = 'assets/images/image'+i+'.jpg';

          if(this.activeSlide!=null)
          {
            this.images.push({url:url,slideIndex:this.activeSlide});
            console.log(this.images);
          }
        }
    }

    showAlert() {
        let alert = this.alertCtrl.create({
            title: 'New Friend!',
            subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
            buttons: ['OK']
        });
        alert.present();
    }

    onLongClick(image)
    {
        for(let i=0;i<this.images.length;i++)
        {
            if(this.images[i]==image)
            {
                console.log("DELETED: ",this.images[i]);
                this.images.splice(i,1);
            }
        }
    }
}
