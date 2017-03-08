import {Component, ViewChild} from '@angular/core';
import {NavController,Platform, NavParams, AlertController, Slides} from 'ionic-angular';
import { ImagePicker } from 'ionic-native';


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

export class NewProjectPage{
  images:any[];
  options:{};
  data:any;
  slidesArray:any[];
  activeSlide:number;
  isDevice:boolean = false;
  dW:number;
  dH:number;
  dom:any;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl:AlertController,private platform: Platform) {
    this.images = [
                    {url:'image1.jpg',slideIndex:1},
                    {url:'image1.jpg',slideIndex:1},
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


  deleteSlide(index)
  {
    if(this.slidesArray.length-1==index)
    {
      this.slides.slideTo(index-1,500);
    }
    this.slidesArray[index] = null;

    console.log("deleted index is", index);
  }

  addSlide()
  {
    this.slidesArray.push({slideTitle:'Slide '});
    if(this.slidesArray.length==1)
    {
      this.activeSlide = this.slides.getActiveIndex()+1;
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewProjectPage');
  }

}
