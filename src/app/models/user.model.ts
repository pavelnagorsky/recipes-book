interface IUser {
  email: string,
  id: string
};

export interface UserDataStorage extends IUser {
  _token: string,
  _tokenExpirationDate: Date
}

export class User implements IUser {
 constructor(
  public email: string,
  public id: string,
  private _token: string,
  private _tokenExpirationDate: Date
 ) {};

 get token() {
  if (!this._tokenExpirationDate || new Date() >= this._tokenExpirationDate) {
    return null;
  }
  return this._token;
 }


}
