import { Component, OnInit } from '@angular/core';
//import { LearnIR } from '../learnir';
//import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  //heroes: Hero[] = [];

  //constructor(private heroService: HeroService) { }
  constructor() {}

  ngOnInit() {
    //this.getHeroes();
  }

  /*getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
  */
}
