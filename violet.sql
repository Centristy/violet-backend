\echo 'Delete and recreate jobly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE violet;
CREATE DATABASE violet;
\connect violet

\i violet-schema.sql


\echo 'Delete and recreate violet_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE violet_test;
CREATE DATABASE violet_test;
\connect violet_test

\i violet-schema.sql
