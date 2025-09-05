<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  API financiera desarrollada con <a href="http://nestjs.com/" target="_blank">NestJS</a> + TypeScript.
</p>

---

## 📖 Descripción

Este proyecto es una **API de finanzas personales** construida con [NestJS](https://nestjs.com/).  
Permite registrar **usuarios, categorías, transacciones** y generar **indicadores financieros (KPIs)** como ingresos, gastos y balance neto.

---

## 📂 Tecnologías usadas

- [NestJS](https://nestjs.com/) - Framework backend en Node.js
- [TypeORM](https://typeorm.io/) - ORM para la base de datos
- [PostgreSQL](https://www.postgresql.org/) (base de datos remota, no Docker)
- [Yarn](https://yarnpkg.com/) - Gestor de paquetes
- [JWT](https://jwt.io/) - Autenticación
- [Passport](http://www.passportjs.org/) - Estrategia de seguridad

---

## ⚙️ Variables de entorno

Crea un archivo **`.env`** en la raíz del proyecto con al menos:

```env
# App
PORT=4000
JWT_KEY=super_secret_key
VALID_HOSTS=http://localhost:3000,http://tudominio.com

# DB
DATABASE_URL=

# Control de migraciones
RUN_MIGRATIONS=true
AUTO_LOAD_ENTITTIES=true
```

---

## 🚀 Instalación
1. Clonar el repositorio:

```bash
git clone https://github.com/deJow1990/finance-api-jobbi.me.git
cd finance-api-jobbi.me
```

2. Instalar dependencias:
```bash
yarn install
```

---

## ▶️ Levantar la aplicación
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```