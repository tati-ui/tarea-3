# Parte A — Aplicación React: Gestor de Series

## Descripción del proyecto

Esta aplicación web permite administrar un catálogo personal de series mediante una interfaz desarrollada con React y un servidor API construido con Express.

El proyecto forma parte de la Tarea 3 de Programación Web Avanzada y demuestra conceptos de componentes, manejo de estado, navegación y comunicación entre frontend y backend.

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React | Construcción de la interfaz |
| Vite | Entorno de desarrollo del frontend |
| React Router | Navegación entre páginas |
| JavaScript | Lógica de la aplicación |
| CSS | Diseño visual y adaptación de la interfaz |
| Node.js | Ejecución del servidor |
| Express | API REST |
| MongoDB y Mongoose | Persistencia de series en una base de datos |

**Nota:** El servidor Express utiliza MongoDB mediante Mongoose. Los datos se conservan después de reiniciar el servidor.

## Funcionalidades

La aplicación permite:

- Consultar el catálogo de series.
- Buscar series por nombre.
- Filtrar las series por estado.
- Consultar el detalle de una serie.
- Registrar nuevas series.
- Modificar información de series existentes.
- Eliminar series.
- Navegar entre las distintas vistas mediante React Router.

## Conceptos de React aplicados

### Componentes

La interfaz se organiza mediante componentes reutilizables que permiten separar responsabilidades y facilitar el mantenimiento del código.

### Props y children

Las propiedades permiten transmitir información entre componentes. `children` permite incluir contenido dentro de componentes reutilizables.

### Eventos y useState

Los eventos permiten responder a las acciones del usuario, mientras que `useState` administra los datos y estados necesarios para actualizar la interfaz.

### React Router

La navegación permite acceder a las vistas del tablero, detalle de series, formulario de nueva serie y página no encontrada.

### Consumo de API

El frontend utiliza solicitudes HTTP para comunicarse con Express.

| Método | Función |
|---|---|
| GET | Consultar información |
| POST | Registrar una serie |
| PATCH | Actualizar información |
| DELETE | Eliminar una serie |

## Estructura del proyecto

```text
tarea-3-react/
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   └── package.json
├── servidor/
│   ├── index.js
│   └── package.json
├── servidor-net/
└── README.md
```

Las carpetas `node_modules` se generan durante la instalación de dependencias y no deben subirse al repositorio.

## Requisitos para ejecutar la aplicación

- Node.js instalado.
- npm disponible.
- Visual Studio Code u otro editor de código.
- Un navegador web.

## Instrucciones de ejecución

### 1. Iniciar el servidor Express

Abrir una terminal en la carpeta `tarea-3-react` y ejecutar:

```bash
cd servidor
npm install
npm start
```

El servidor estará disponible en:

http://localhost:3001

### 2. Iniciar la aplicación React

Abrir una segunda terminal desde la carpeta `tarea-3-react
