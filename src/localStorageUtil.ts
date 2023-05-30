export class LocalStorageUtil {

  protected static readonly localStorageName = 'gmsLS'

  public static getStorage(): LocalStorage {
    const userJson = localStorage.getItem(this.localStorageName);
    return userJson !== null ? JSON.parse(userJson) : new LocalStorage();
  }

  public static setStorage(data: LocalStorage): void {
    localStorage.setItem(this.localStorageName, JSON.stringify(data));
  }

  public static clearStorage(): void {
    LocalStorageUtil.setStorage(new LocalStorage());
  }

}

export class LocalStorage {
  id!: number;
  name!: string;
  email!: string;
  is_admin!: boolean;
  is_approved!: boolean;
  token!: any
}
