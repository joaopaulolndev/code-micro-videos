import { Category, Genre } from './models';

export function getGenresFromCategory(genres: Genre[], category: Category) {
  return genres.filter(
    (genre) => genre.categories.filter((item) => item.id === category.id).length !== 0,
  );
}
