import {ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appResolveComponent]'
})
export class ResolveComponentDirective implements OnInit {
  @Input() component: any;

  constructor(public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.viewContainerRef.clear();
    this.viewContainerRef.createComponent(componentFactory);
  }
}
