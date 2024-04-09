import { getValue, setValue } from 'express-ctx';
import { LanguageCode } from '../const/language-code';
import { TokenPayloadModel } from '../auth/basic-auth';


export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static readonly languageKey = 'language_key';

  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: TokenPayloadModel): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey) || LanguageCode.vi;
  }

  static getAuthUser(): TokenPayloadModel | undefined {
    return ContextProvider.get<TokenPayloadModel>(ContextProvider.authUserKey);
  }
}
