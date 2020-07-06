BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('Johnny', 'jj@gmail.com', 5, '2020-06-30');
INSERT INTO login (hash, email) VALUES ('$2a$10$joqwWutyIxfucntraGDg8OujeyT3lIbro9PF9N6o6vXX.gxXKdaTu', 'jj@gmail.com');

COMMIT;