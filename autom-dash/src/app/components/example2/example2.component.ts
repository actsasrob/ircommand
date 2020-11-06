import { Component, OnInit } from '@angular/core';
import { HostListener  } from "@angular/core";

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss']
})
export class Example2Component implements OnInit {

  defaultTouch = { x: 0, y: 0, time: 0 };

  public event: MouseEvent;
  public clientX = 0;
  public clientY = 0;

  constructor() { }

  ngOnInit(): void {
  }

  //@HostListener("click") onClick(){
  //  console.log("Example2.onClick(): User Click using Host Listener")
  //}

  @HostListener('click', ['$event'])
  onClick(event: any) {
     //console.log("Example2.onClick(): " + JSON.stringify(event));
     console.log("Example2.onClick(): " + event.target);
  }

  //private onClick() {
  //  console.log('Example2.onClick()');
  //}

    onEvent(event: MouseEvent): void {
        console.log("Example2.onEvent()");
        this.event = event;
    }

    coordinates(event: MouseEvent): void {
        this.clientX = event.clientX;
        this.clientY = event.clientY;
    }

  @HostListener('touchstart', ['$event'])
  //@HostListener('touchmove', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event) {
      console.log("Example2.handleTouch()");
      let touch = event.touches[0] || event.changedTouches[0];

      // check the events
      if (event.type === 'touchstart') {
          this.defaultTouch.x = touch.pageX;
          this.defaultTouch.y = touch.pageY;
          this.defaultTouch.time = event.timeStamp;
      } else if (event.type === 'touchend') {
          let deltaX = touch.pageX - this.defaultTouch.x;
          let deltaY = touch.pageY - this.defaultTouch.y;
          let deltaTime = event.timeStamp - this.defaultTouch.time;

          // simulte a swipe -> less than 500 ms and more than 60 px
          if (deltaTime < 500) {
              // touch movement lasted less than 500 ms
              if (Math.abs(deltaX) > 60) {
                  // delta x is at least 60 pixels
                  if (deltaX > 0) {
                      this.doSwipeRight(event);
                  } else {
                      this.doSwipeLeft(event);
                  }
              }

              if (Math.abs(deltaY) > 60) {
                  // delta y is at least 60 pixels
                  if (deltaY > 0) {
                      this.doSwipeDown(event);
                  } else {
                      this.doSwipeUp(event);
                  }
              }
          }
      }
  }

  doSwipeLeft(event) {
      console.log('swipe left', event);
  }

  doSwipeRight(event) {
      console.log('swipe right', event);
  }

  doSwipeUp(event) {
      console.log('swipe up', event);
  }

  doSwipeDown(event) {
      console.log('swipe down', event);
  }
}
