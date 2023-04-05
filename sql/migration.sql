DROP TABLE pet;

CREATE TABLE pet (
    id serial PRIMARY KEY,
    name varchar(40) NOT NULL,
    age int NOT NULL,
    kind varchar(40) NOT NULL
)