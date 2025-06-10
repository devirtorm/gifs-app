import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifsService } from '../../services/gifs.service';
import type { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent { 
  searchGifService = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string): void {
    this.searchGifService.searchGifs(query).subscribe(resp => {
      this.gifs.set(resp);
    })
  }
}
