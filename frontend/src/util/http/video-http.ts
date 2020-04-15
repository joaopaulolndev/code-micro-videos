import { AxiosResponse } from 'axios';
import { VideoFileFieldsMap } from '../models';
import HttpResource from './http-resource';
import { httpVideo } from './index';

class VideoHttp extends HttpResource {
  create<T = any>(data): Promise<AxiosResponse<T>> {
    return this.http.post<T>(this.resource, this.sanitizeData(data, 'POST'));
  }

  update<T = any>(id, data): Promise<AxiosResponse<T>> {
    return this.http.post<T>(`${this.resource}/${id}`, this.sanitizeData(data, 'PUT'));
  }

  private sanitizeData(data, methodSpoofing: string) {
    const formData = new FormData();

    formData.append('_method', methodSpoofing);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('year_launched', data.year_launched);
    formData.append('duration', data.duration);
    formData.append('rating', data.rating);
    formData.append('opened', data.opened);

    data.cast_members.forEach((item) => formData.append('cast_members_id[]', item.id));
    data.genres.forEach((item) => formData.append('genres_id[]', item.id));
    data.categories.forEach((item) => formData.append('categories_id[]', item.id));

    Object.keys(VideoFileFieldsMap).forEach((field) => {
      if (data[field] instanceof File) {
        formData.append(field, data[field]);
      }
    });

    return formData;
  }
}

export default new VideoHttp(httpVideo, 'videos');
