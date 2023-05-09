DROP TABLE IF EXISTS powerlifter;

CREATE TABLE powerlifter(
    id serial,
    gender varchar,
    weight integer,
    squat integer,
    bench integer,
    deadlift integer,
    equipped boolean
)