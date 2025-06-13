CREATE DATABASE checkin;
use checkin;


CREATE TABLE clockin.empresa(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    status int NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE clockin.users(
    id int AUTO_INCREMENT,
    id_empresa int NOT NULL,
    nome varchar(255) NOT NULL,
    tipo ENUM('user', 'funcionario', 'admin') NOT NULL,
    cpf varchar(14) UNIQUE NOT NULL,
    telefone varchar(20) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    senha varchar(64) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_empresa) REFERENCES clockin.empresa(id),
    CREATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
    UPDATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

drop table clockin.empresa;