import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { environment } from '@environments/environment.development';
import { map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(()=> Object.keys(this.searchHistory())) 

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`, {
        params: { api_key: environment.giphyApiKey, limit: 20 },
      })
      .subscribe((response) => {
        const gifs = GifMapper.mapGiphyItemToGifArray(response.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string) {
    return this.http
      .get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`, {
        params: { api_key: environment.giphyApiKey, limit: 20, q: query },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemToGifArray(items)),
        tap( items => {
          this.searchHistory.update( history => ({
            ...history,
            [query.toLowerCase()]: items,
          }))
        })
      );
  }

  getHistoryGifs(query: string) {
    return this.searchHistory()[query] ?? [];
  }

  // .subscribe((response) => {
  //   const gifs = GifMapper.mapGiphyItemToGifArray(response.data);

  // });  }
}
