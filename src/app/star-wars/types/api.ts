export interface ResourceItem {
  readonly created: string;
  readonly edited: string;
  readonly url: string;
}

export interface ResultsList<T> {
  readonly count: number;
  readonly previous: string | null;
  readonly next: string | null;
  readonly results: readonly T[];
}

export interface ResultsListParams {
  readonly search?: string;
  readonly page?: string;
}

export interface Person extends ResourceItem {
  readonly birth_year: string; // The birth year of ...
  readonly eye_color: string; // The eye color of ...
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  gender: string;
  homeworld: string | null;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
}

export interface Planet extends ResourceItem {
  readonly name: string;
  readonly diameter: string;
  readonly rotation_period: string;
  readonly orbital_period: string;
  readonly gravity: string;
  readonly climate: string;
  readonly terrain: string;
  readonly surface_water: string;
  readonly residents: string[];
  readonly films: string[];
  readonly population: number;
}

export interface Film extends ResourceItem {
  readonly title: string; // The title of this film
  readonly episode_id: number; // The episode number of this film.
  readonly opening_crawl: string; // The opening paragraphs at the beginning of this film.
  readonly director: string; // The name of the director of this film.
  readonly producer: string; // The name(s) of the producer(s) of this film. Comma separated.
  readonly release_date: string; // The ISO 8601 date format of film release at original creator country.
  readonly species: string[]; // An array of species resource URLs that are in this film.
  readonly starships: string[]; // An array of starship resource URLs that are in this film.
  readonly vehicles: string[]; // An array of vehicle resource URLs that are in this film.
  readonly characters: string[]; // An array of people resource URLs that are in this film.
  readonly planets: string[]; // An array of planet resource URLs that are in this film.
}
