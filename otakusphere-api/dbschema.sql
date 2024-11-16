CREATE DATABASE OtakuSphere;

USE OtakuSphere;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Anime (
    anime_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    anime_description TEXT,
    img_url VARCHAR(255)
);

CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    anime_id INT,
    rating INT NOT NULL,
    review_text TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (anime_id) REFERENCES Anime(anime_id) ON DELETE CASCADE
);

CREATE TABLE Watchlist (
    watchlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    anime_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (anime_id) REFERENCES Anime(anime_id) ON DELETE CASCADE
);

/* test data to insert into tables - gpt generated data */

INSERT INTO User (username, email, password)
VALUES 
    ('animeFan123', 'animefan123@example.com', 'password1'),
    ('otakuKing', 'otakuking@example.com', 'password2'),
    ('mangaLover', 'mangalover@example.com', 'password3');

INSERT INTO Anime (title, genre, anime_description, img_url)
VALUES 
    ('Naruto', 'Action', 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage.', 'https://example.com/naruto.jpg'),
    ('Attack on Titan', 'Action, Drama', 'Humanity fights for survival against giants.', 'https://example.com/attack_on_titan.jpg'),
    ('My Hero Academia', 'Action, Superhero', 'A young boy born without superpowers in a world where they are common dreams of becoming a hero.', 'https://example.com/my_hero_academia.jpg'),
    ('Spirited Away', 'Fantasy', 'A girl discovers a mysterious world ruled by gods, witches, and spirits.', 'https://example.com/spirited_away.jpg');

INSERT INTO Review (user_id, anime_id, rating, review_text)
VALUES 
    (1, 1, 5, 'Naruto is a classic with amazing character development.'),
    (2, 2, 4, 'Attack on Titan is intense and has an incredible storyline.'),
    (1, 3, 4, 'My Hero Academia is inspirational but could have faster pacing.'),
    (3, 4, 5, 'Spirited Away is a masterpiece! Every scene is like art.');

INSERT INTO Watchlist (user_id, anime_id)
VALUES 
    (1, 2),  -- animeFan123 added Attack on Titan to their watchlist
    (1, 4),  -- animeFan123 added Spirited Away to their watchlist
    (2, 1),  -- otakuKing added Naruto to their watchlist
    (3, 3);  -- mangaLover added My Hero Academia to their watchlist
