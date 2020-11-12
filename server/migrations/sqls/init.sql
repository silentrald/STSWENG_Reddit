CREATE DATABASE stsweng_db;
CREATE ROLE stsweng_user WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE stsweng_db TO stsweng_user;

/* psql -h localhost -p 5432 -U stsweng_user -W -d stsweng_db */