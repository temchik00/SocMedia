import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../Interfaces/city';
import { Sex } from '../Interfaces/sex';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  constructor(private httpClient: HttpClient) {}

  public getCity(cityId: number): Promise<City> {
    return firstValueFrom(
      this.httpClient.get<City>(`${environment.apiUrl}/city/${cityId}/`)
    );
  }

  public getSex(sexId: number): Promise<Sex> {
    return firstValueFrom(
      this.httpClient.get<Sex>(`${environment.apiUrl}/sex/${sexId}/`)
    );
  }
}
