import { Injectable } from '@angular/core';

import { HeroJobAdComponent } from './hero-job-ad.component';
import { HeroProfileComponent } from './hero-profile.component';
import { RIItem } from './ri-item';

@Injectable()
export class RIService {
  getRIs() {
    return [
      new RIItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),

      new RIItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

      new RIItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
                                        body: 'Submit your resume today!'}),

      new RIItem(HeroJobAdComponent,   {headline: 'Openings in all departments',
                                        body: 'Apply today'}),
    ];
  }
}
