-- Active: 1750763277253@@127.0.0.1@3306
CREATE DATABASE clockin CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE clockin;

CREATE TABLE empresa(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clockin.endereco (
    id INT AUTO_INCREMENT,
    id_empresa INT NOT NULL UNIQUE,
    rua VARCHAR(100) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    numero VARCHAR(10),
    cep VARCHAR(9),
    estado CHAR(2) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE configs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    status ENUM('ativo', 'desligado') NOT NULL DEFAULT 'ativo',
    tipo ENUM('user', 'funcionario', 'admin') NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    data_cadastro DATE NOT NULL,
    data_demissao DATE,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(64),
    resetToken VARCHAR(255) DEFAULT NULL,
    tokenExpira BIGINT DEFAULT NULL,
    CREATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
    UPDATE_AT DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE nominal(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    dia_semana ENUM('Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado') NOT NULL,
    hora1 TIME DEFAULT '08:00:00',
    hora2 TIME DEFAULT '12:00:00',
    hora3 TIME DEFAULT '14:00:00',
    hora4 TIME DEFAULT '18:00:00',
    hora5 TIME,
    hora6 TIME,
    FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clockin.registros(
    id int AUTO_INCREMENT,
    id_usuario int NOT NULL,
    data date NOT NULL,
    registo1 time,
    registo2 time,
    registo3 time,
    registo4 time,
    registo5 time,
    registo6 time,
    obs text,
    mode ENUM('Folga', 'Feriado', 'Feriado Meio', 'Folga bonificada'),
    status ENUM('Aberto','Fechado') DEFAULT 'Aberto',
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES clockin.users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clockin.saldo_diario(
    id int AUTO_INCREMENT,
    id_usuario int NOT NULL,
    data date NOT NULL,
    saldo50 int, 
    saldo100 int,
    saldo int, /*Saldo acumulado*/
    mode ENUM('Aberto', 'Fechado'),
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES clockin.users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;