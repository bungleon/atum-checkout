import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[loading]',
})
export class LoadingDirective implements OnInit, OnChanges {
  @Input() loading = {};
  loadingDiv = null;
  textNode = null;

  constructor(private elem: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.loadingDiv = document.createElement('div');
    this.loadingDiv.className = 'loading';

    if (this.loading.hasOwnProperty('text')) {
      this.renderer.addClass(this.loadingDiv, 'loading-white');
      this.loadingDiv.appendChild(
        document.createTextNode(this.loading['text'])
      );
    }

    if (this.loading) {
      this.renderer.addClass(this.loadingDiv, 'active');
    } else {
      this.renderer.removeClass(this.loadingDiv, 'active');
    }

    const loadingIcon = document.createElement('i');
    loadingIcon.className = 'loading-icon';
    this.renderer.appendChild(this.elem.nativeElement, this.loadingDiv);
    this.renderer.appendChild(this.loadingDiv, loadingIcon);
  }

  ngOnChanges(changes) {
    if (changes.loading && this.loadingDiv) {
      if (this.loading) {
        this.renderer.addClass(this.loadingDiv, 'active');
      } else {
        this.renderer.removeClass(this.loadingDiv, 'active');
      }
    }
  }
}
