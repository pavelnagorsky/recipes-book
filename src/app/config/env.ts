import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
  useValue: environment
})
export class Environment {
  readonly production: boolean;
  readonly baseUrl: string;
  readonly authBaseUrl: string;
  readonly authKey: string;
  // some other fields maybe 
};