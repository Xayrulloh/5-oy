-- initialization (just copy and paste)

-- connect to another db
\c postgres;

-- drop database if exists
drop database if exists look;

-- create database look
create database look;

-- connect to database look
\c look;

----------------------------------------------------------
-- model

-- extensions
create extension if not exists "uuid-ossp";

-- users table
drop table if exists users;
create table users (
    user_id uuid default uuid_generate_v4() primary key,
    user_name character varying(255) not null,
    user_contact character varying(12) not null,
    user_created_at timestamptz default current_timestamp,
    user_deleted_at timestamptz default null
);

-- foods table
drop table if exists foods;
create table foods (
    food_id uuid default uuid_generate_v4() primary key,
    food_name character varying(255) not null,
    food_img text not null,
    food_price decimal(8, 2) not null,
    food_created_at timestamptz default current_timestamp,
    food_deleted_at timestamptz default null
);

-- orders table
drop table if exists orders;
create table orders (
    order_id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references users(user_id),
    food_id uuid not null references foods(food_id),
    order_count int default 1,
    order_created_at timestamptz default current_timestamp,
    order_deleted_at timestamptz default null 
);