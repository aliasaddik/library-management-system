-- SQLite
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--since the use is only retrieved by id the index of id is for primary key natively added so ther eis no need for indexing


--user update trigger
CREATE TRIGGER update_user_timestamp
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    UPDATE user
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;






----------------------------------------------------------------------
----------------------------------------------------------------------
CREATE TABLE borrowing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    user_id INTEGERE NOT NULL,
    returned INTEGER DEFAULT 0 NOT NULL,
    due_date DATETIME NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(book_id) REFERENCES book(id) ,
    FOREIGN KEY(user_id) REFERENCES user(id) 
);
--index for book_id , user_id and due_date
CREATE UNIQUE INDEX borrowing_index
on borrowing (book_id, user_id, due_date);

CREATE INDEX book_borrowing 
on borrowing (book_id);

CREATE INDEX user_borrowing 
on borrowing (user_id);

-- borrowing update trigger
CREATE TRIGGER update_borrowing_timestamp
AFTER UPDATE ON borrowing
FOR EACH ROW
BEGIN
    UPDATE borrowing
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;



----------------------------------------------------------------------
----------------------------------------------------------------------
CREATE TABLE book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title text NOT NULL,
    author text NOT NULL,
    isbn text UNIQUE NOT NULL, 
    available_qty INTEGER NOT NULL,
    shelf_location text NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--index for title, author and isbn
-- no need for id or isbn indexing since they are unique
CREATE UNIQUE INDEX book_index
on book (title, author, isbn);

CREATE INDEX title_index
on book (title);

CREATE INDEX author_index
on book (author);

-- book update trigger
CREATE TRIGGER update_book_timestamp
AFTER UPDATE ON book
FOR EACH ROW
BEGIN
    UPDATE book
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;



