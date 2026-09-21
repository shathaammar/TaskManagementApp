import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private currentLang: string;
  private isBrowser: boolean;

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    let langToUse = 'en'; 
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('lang');
      if (savedLang) {
        langToUse = savedLang;
      }
    }

    this.currentLang = langToUse;
    this.translate.setDefaultLang(langToUse);
    this.loadTranslations(langToUse);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.loadTranslations(lang);
    this.setDirection(lang);

    if (this.isBrowser) {
      localStorage.setItem('lang', lang);
    }
  }

  private loadTranslations(lang: string) {
    this.http.get(`/assets/i18n/${lang}.json`).subscribe({
      next: (translations: any) => {
        this.translate.setTranslation(lang, translations, true);
        this.translate.use(lang);
      },
      error: (err) => {
        console.error(`Could not load translations for '${lang}':`, err);
      }
    });

    this.setDirection(lang);
  }

  private setDirection(lang: string) {
    if (this.isBrowser) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}