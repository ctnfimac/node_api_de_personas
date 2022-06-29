CREATE DATABASE curso_node;

--
-- \c curso_node


CREATE TABLE usuario (
    id integer NOT NULL,
    nombre character varying(50),
    direccion character varying(250),
    latitud double precision,
    longitud double precision
);

CREATE TABLE administrador(
    id SERIAL PRIMARY KEY,
    nombre character varying(50),
    contraseña character varying(50)
);

INSERT INTO usuario(id, nombre, direccion, latitud, longitud)
VALUES
(1,'Christian','Uspallata 2272',-34.6372209999999967, -58.3930000000000007),
(2,'Adri','angel roffo 7029', -34.6388060000000024, -58.5286680000000032),
(3,'Saavedra','Lacarra 535', -34.6400649999999999, -58.481577999999999),
(4,'UTN', 'Medrano 951', -34.598787999999999, -58.4202489999999983),
(5,'GCBA Inovacion', 'Juan Carlos Gómez 276', -34.637594, -58.3908529999999999),
(6,'Ricardo', 'las tunas 11122', -34.6396390000000025, -58.5216009999999969),
(7,'chacarita', 'Av. Guzmán 680', -34.5873940000000033, -58.4551820000000006),
(8,'Obelisco', '9 de julio y Corrientes', -34.6040350000000032, -58.3809639999999987);


INSERT INTO administrador(nombre, contraseña)
VALUES
    ('Christian', '123456');