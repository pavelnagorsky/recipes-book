import { Directive, HostBinding, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  @HostBinding('class.show') showMode: boolean = false;

  // @HostListener('click') toogleOpen(eventData: Event) {
  //   this.showMode = !this.showMode;
  //   // change show class on the nextSibling element
  //   if (this.showMode) {
  //     this.renderer.addClass(this.elRef.nativeElement.nextElementSibling, "show");
  //   } else {
  //     this.renderer.removeClass(this.elRef.nativeElement.nextElementSibling, "show");
  //   }
  // }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.showMode = this.elRef.nativeElement.contains(event.target) ? !this.showMode : false;
    // change show class on the nextSibling element
    if (this.showMode) {
      this.renderer.addClass(this.elRef.nativeElement.nextElementSibling, "show");
    } else {
      this.renderer.removeClass(this.elRef.nativeElement.nextElementSibling, "show");
    }
  }
}
