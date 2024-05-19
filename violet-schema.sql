CREATE TABLE users (
  username VARCHAR(30) PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(50) NOT NULL
);


CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  title VARCHAR(20) NOT NULL,
  description TEXT,
  user_username VARCHAR(20) NOT NULL REFERENCES users(username)

);


CREATE TABLE songs (

  id SERIAL PRIMARY KEY,
  artist VARCHAR(50),
  album TEXT,
  title VARCHAR(50) NOT NULL,
  playlist_id INT NOT NULL REFERENCES playlists(id),
  url TEXT NOT NULL

);


CREATE TABLE genre (

  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL

);


CREATE TABLE song_genre (

  id SERIAL PRIMARY KEY,
  song_id INT NOT NULL REFERENCES songs(id),
  genre_id INT NOT NULL REFERENCES genre(id)

);




