import {ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Event} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';

interface EventComponent {
  event: Event;
  isAdmin: boolean;
  paymentMeans: PaymentMeans[];
}

@Directive({
  selector: '[appResolveComponent]'
})
export class ResolveComponentDirective implements OnInit {
  @Input() component: any;
  @Input() event: Event;
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];

  constructor(public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    if (this.event) {
      (<EventComponent>componentRef.instance).event = this.event;
    }
    if (typeof this.isAdmin !== 'undefined') {
      (<EventComponent>componentRef.instance).isAdmin = this.isAdmin;
    }
    if (typeof this.paymentMeans !== 'undefined') {
      (<EventComponent>componentRef.instance).paymentMeans = this.paymentMeans;
    }
  }
}
