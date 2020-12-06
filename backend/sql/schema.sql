-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS mail;

CREATE TABLE users(userid SERIAL PRIMARY KEY, userinfo jsonb);
CREATE TABLE mail(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), userid integer REFERENCES users (userid), mailbox VARCHAR(32), mail jsonb);
