import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/giphy.interfaces";

export class GifMapper {
    static mapGiphyItemToGif(item: GiphyItem): Gif {
        return {
            id: item.id,
            type: item.type,
            title: item.title,
            url: item.images.original.url
        };
    }

    static mapGiphyItemToGifArray(items: GiphyItem[]): Gif[] {
        return items.map(this.mapGiphyItemToGif);
    }
}