import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || '465285',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();


  await client.query(`
    CREATE TABLE users(
        id serial primary key,
        name VARCHAR(30) not null,
        date date not null default current_date
      );`);

  await client.query(`
    create table categories(
        id serial primary key not null,
        name VARCHAR(30) not null
      );`);

  await client.query(`
    create table authors(
        id serial primary key not null,
        name VARCHAR(30) not null
      );`);

  await client.query(`
    create table books(
        id serial primary key,
        title VARCHAR(30) not null,
        userid INTEGER NOT NULL,
        foreign KEY(userid) references users (id) on delete cascade,
        authorid INTEGER NOT NULL,
        foreign key(authorid) references authors (id) on delete cascade,
        categoryid INTEGER NOT NULL,
        foreign key(categoryid) references categories (id) on delete cascade
      );`);

  await client.query(`
     create table descriptions(
        id serial primary key not null,
        description VARCHAR(1000) not null,
        bookid INTEGER NOT NULL,
        foreign key(bookid) references books(id) on delete cascade
    );`);

  await client.query(`
    create table reviews(
        id serial primary key not null,
        message VARCHAR(10000) not null,
        userid INTEGER NOT NULL,
        FOREIGN KEY(userid) REFERENCES users(id) on delete cascade,
        bookid INTEGER NOT NULL,
        foreign key(bookid) references books(id) on delete cascade
    );`);

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
