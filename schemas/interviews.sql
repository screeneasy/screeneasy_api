CREATE TABLE interview_questions (
    id          SERIAL PRIMARY KEY,
    title       varchar(40) NOT NULL,
    body        varchar(500),
    tags        varchar(100),
    created     date
);
