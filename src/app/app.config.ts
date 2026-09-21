import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

// LanguageService loads and sets translations itself (see services/language.service.ts),
// so TranslateModule doesn't need its own HTTP loader here - just the default language.
export const appConfig: ApplicationConfig = {
  providers: [
    // withFetch() lets HttpClient resolve LanguageService's relative translation-file
    // request during SSR/prerendering; without it, that request fails server-side and
    // the prerendered HTML ships raw translation keys instead of translated text.
    provideHttpClient(withFetch()),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en'
      })
    )
  ]
};