import {Component, ViewChild, OnInit,ElementRef} from '@angular/core';
import {NavController,Platform, NavParams, AlertController, Slides} from 'ionic-angular';
import { ImagePicker } from 'ionic-native';
import {waitRendered} from '../../components/utils';

/*
  Generated class for the NewProject page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var domtoimage:any;

@Component({
  selector: 'page-new-project',
  templateUrl: 'new-project.html'
})

export class NewProjectPage implements OnInit{
    @ViewChild(Slides) slides: Slides;
    images:any[];
    options:{};
    data:any;
    slidesArray:any[];
    activeSlide:number;
    isDevice:boolean = false;
    dW:number;
    dH:number;
    dom:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public alertCtrl:AlertController,private platform: Platform,private _elementRef:ElementRef) {
        this.images = [
            {url:'image1.jpg',slideIndex:1},
            {url:'image3.jpg',slideIndex:1},
            {url:'image2.jpg',slideIndex:2}
        ];
        this.options = {
            maximumImagesCount: 4,
        };
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
        console.log('images'+index);
        let node = document.getElementById('images'+index);

        domtoimage.toPng(node)
          .then(function (dataUrl) {
            let img = new Image();
            img.src = dataUrl;
            document.getElementById('printed'+index).appendChild(img);
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
    }

    pickImage()
    {
        console.log(this.isDevice);

        // this.platform.ready().then(() =>{
        //   this.isDevice = true;
        // });
        if(this.isDevice==true)
        {
          ImagePicker.hasReadPermission().then(result=>{
            if(!result)
            {
              ImagePicker.requestReadPermission();
            }
          });
          ImagePicker.getPictures(this.options).then((results) => {
            for (var i = 0; i < results.length; i++) {
              console.log('Image URI: ' + results[i]);
            }
          }, (err) => { });
        }
        else
        {
          let i = Math.floor((Math.random()*3)+1);
          let url = 'image'+i+'.jpg';

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


}
