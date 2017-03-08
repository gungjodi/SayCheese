import { Directive, Renderer, ElementRef } from '@angular/core';

/*
  Generated class for the BtnCustom directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[btn-custom]' // Attribute selector
})
export class BtnCustom {

  constructor(public renderer: Renderer, public element:ElementRef) {}

  ngOnInit()
  {
    this.renderer.setElementClass(this.element.nativeElement, 'btn-custom', true);
  }

}
