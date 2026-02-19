import { Injectable, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  constructor(
    @Inject("systemConfig") public SystemConfig,
    private translate: TranslateService
  ) {}

  langCheck() {
    const supportedLanguages = this.SystemConfig.supportedLanguages || [
      { code: "en", name: "English" }
    ];
    this.translate.addLangs(
      supportedLanguages.map(item => {
        return item.code;
      })
    );
    this.translate.setDefaultLang(supportedLanguages[0].code);
    const storedLang = localStorage.getItem("language");
    if (!storedLang) {
      const browserLang = this.translate.getBrowserLang();
      const lang = browserLang.match(
        "/" +
          supportedLanguages
            .map(item => {
              return item.code;
            })
            .join("|") +
          "/"
      )
        ? browserLang
        : "en";
      this.translate.use(lang);
      localStorage.setItem("language", lang);
    } else {
      this.translate.use(storedLang);
    }
  }

  set language(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("language", lang);
  }

  get languages() {
    return this.SystemConfig.supportedLanguages || [
      { code: "en", name: "English" }
    ];
  }

  get language() {
    return localStorage.getItem("language");
  }
}
