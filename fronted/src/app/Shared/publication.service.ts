import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Likes } from '../Interfaces/likes';
import { Publication } from '../Interfaces/publication';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(private httpClient: HttpClient) {}

  public async getLikes(publicationId: number): Promise<number[]> {
    let likes: Likes = await firstValueFrom(
      this.httpClient.get<Likes>(
        `${environment.apiUrl}/publication/${publicationId}/likes/`
      )
    );
    return Promise.resolve(likes.user_ids);
  }

  public async getPublications(userId: number): Promise<Publication[]> {
    let publications: Publication[] = await firstValueFrom(
      this.httpClient.get<Publication[]>(
        `${environment.apiUrl}/publication/${userId}/`
      )
    );

    for (let i = 0; i < publications.length; i++) {
      publications[i].time_posted = new Date(publications[i].time_posted);
    }
    return Promise.resolve(publications);
  }

  public async toggleLike(
    publicationId: number,
    tokenHeader: HttpHeaders
  ): Promise<void> {
    await firstValueFrom(
      this.httpClient.put(
        `${environment.apiUrl}/publication/${publicationId}/like/`,
        {},
        { headers: tokenHeader }
      )
    );
  }
}
