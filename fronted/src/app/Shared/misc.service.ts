import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public getCities(): Promise<City[]> {
    return firstValueFrom(
      this.httpClient.get<City[]>(`${environment.apiUrl}/city/`)
    );
  }

  public getSex(sexId: number): Promise<Sex> {
    return firstValueFrom(
      this.httpClient.get<Sex>(`${environment.apiUrl}/sex/${sexId}/`)
    );
  }

  public getSexes(): Promise<Sex[]> {
    return firstValueFrom(
      this.httpClient.get<Sex[]>(`${environment.apiUrl}/sex/`)
    );
  }

  public sendPicture(
    file: File,
    tokenHeader: HttpHeaders
  ): Promise<{ filename: string }> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return firstValueFrom(
      this.httpClient.post<{ filename: string }>(
        environment.apiUrl + '/file/',
        formData,
        {
          headers: tokenHeader,
        }
      )
    );
  }
}
