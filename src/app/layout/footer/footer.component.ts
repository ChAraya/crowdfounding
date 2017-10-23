import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  language = {
    'en': {
      'shortLang': 'en',
      'longLan': 'English',
      'class': 'flag-en'
    },
    'de': {
      'shortLang': 'de',
      'longLan': 'Deutsche',
      'class': 'flag-de'
    },
    'es': {
      'shortLang': 'es',
      'longLan': 'Español',
      'class': 'flag-es'
    },
    'it': {
      'shortLang': 'it',
      'longLan': 'Italiano',
      'class': 'flag-it'
    },
    'fr': {
      'shortLang': 'fr',
      'longLan': 'français',
      'class': 'flag-fr'
    },
    'pt': {
      'shortLang': 'pt',
      'longLan': 'Portugues',
      'class': 'flag-pt'
    }
  };

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'de', 'it', 'es', 'pt']);
    translate.setDefaultLang('es');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es/) ? browserLang : 'es');
  }

  ngOnInit() {
  }

}
