
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useNavigate
} from 'react-router-dom';

import './style.css';

// --------------------------------------------------
// Configuración de la API.
// --------------------------------------------------

// Dirección del servidor Express.
const API = 'http://localhost:3001/api/series';

// --------------------------------------------------
// Hook personalizado para consultar las series.
// --------------------------------------------------

function useSeries() {
  const [series, setSeries] = useState([]);
  const [error, setError] = useState('');

  // Obtiene todas las series desde el servidor.
  async function refresh() {
    try {
      const respuesta = await fetch(API);

      if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las series');
      }

      const datos = await respuesta.json();

      setSeries(datos);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  // Carga las series al abrir el tablero.
  useEffect(() => {
    refresh();
  }, []);

  return { series, error, refresh };
}

// --------------------------------------------------
// Componente de navegación y estructura general.
// --------------------------------------------------

function Layout({ children }) {
  return (
    <>
      {/* Encabezado principal. */}
      <header className="site-header">
        <div className="container header-content">

          <Link to="/" className="brand">
            <span className="brand-icon">✦</span>
            Maratón<span className="brand-dot">.</span>
          </Link>

          <nav className="main-nav">
            <NavLink to="/" end>
              Tablero
            </NavLink>

            <NavLink to="/nueva">
              Nueva serie
            </NavLink>
          </nav>

        </div>
      </header>

      {/* Contenido de cada página. */}
      <main className="container main-content">
        {children}
      </main>

      {/* Pie de página. */}
      <footer className="site-footer">
        <div className="container">
          Maratón de series · Mi colección personal
        </div>
      </footer>
    </>
  );
}

// --------------------------------------------------
// Componente para mostrar una tarjeta de serie.
// --------------------------------------------------

function SeriesCard({ serie, onToggle, onRemove }) {

  // Comprueba si la serie está terminada.
  const terminada = serie.estado === 'terminada';

  // Muestra correctamente singular o plural.
  const textoTemporadas =
    Number(serie.temporadas) === 1
      ? '1 temporada'
      : `${serie.temporadas} temporadas`;

  return (
    <article className="series-card">

      {/* Ícono y estado de la serie. */}
      <div className="card-top">

        <div className="series-icon">
          🎬
        </div>

        <span
          className={
            terminada
              ? 'status status-done'
              : 'status status-pending'
          }
        >
          {terminada ? 'Terminada' : 'Pendiente'}
        </span>

      </div>

      {/* Información de la serie. */}
      <div className="card-content">

        <p className="card-category">
          {serie.genero}
        </p>

        <h3>
          <Link to={`/serie/${serie.id}`}>
            {serie.titulo}
          </Link>
        </h3>

        <p className="card-description">
          {textoTemporadas}
        </p>

      </div>

      {/* Botones de acciones. */}
      <div className="card-actions">

        <button
          type="button"
          className="btn btn-primary-custom"
          onClick={() => onToggle(serie)}
        >
          {terminada
            ? 'Marcar como pendiente'
            : 'Marcar como terminada'}
        </button>

        <button
          type="button"
          className="btn btn-delete"
          onClick={() => onRemove(serie.id)}
        >
          Eliminar
        </button>

      </div>

    </article>
  );
}

// --------------------------------------------------
// Componente del tablero principal.
// --------------------------------------------------

function Board() {

  // Obtiene las series desde el hook.
  const { series, error, refresh } = useSeries();

  // Estados para búsqueda y filtros.
  const [filter, setFilter] = useState('todas');
  const [search, setSearch] = useState('');

  // Calcula las estadísticas de las series.
  const total = series.length;

  const terminadas = series.filter(
    serie => serie.estado === 'terminada'
  ).length;

  const pendientes = series.filter(
    serie => serie.estado === 'pendiente'
  ).length;

  // Filtra las series por estado y título.
  const visible = series.filter(serie => {

    const coincideEstado =
      filter === 'todas' || serie.estado === filter;

    const coincideBusqueda = serie.titulo
      .toLowerCase()
      .includes(search.toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  // --------------------------------------------------
  // Eliminar una serie.
  // --------------------------------------------------

  async function remove(id) {

    // Solicita confirmación antes de eliminar.
    if (!window.confirm('¿Eliminar esta serie?')) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la serie');
      }

      // Actualiza el tablero después de eliminar.
      await refresh();

    } catch (e) {
      window.alert(e.message);
    }
  }

  // --------------------------------------------------
  // Cambiar el estado de una serie.
  // --------------------------------------------------

  async function toggle(serie) {

    // Determina el nuevo estado.
    const nuevoEstado =
      serie.estado === 'terminada'
        ? 'pendiente'
        : 'terminada';

    try {
      const respuesta = await fetch(`${API}/${serie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: nuevoEstado
        })
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo cambiar el estado');
      }

      // Actualiza las estadísticas y tarjetas.
      await refresh();

    } catch (e) {
      window.alert(e.message);
    }
  }

  // --------------------------------------------------
  // Contenido visual del tablero.
  // --------------------------------------------------

  return (
    <Layout>

      {/* Sección principal de presentación. */}
      <section className="hero-section">

        <div className="hero-text">

          <span className="eyebrow">
            Tu espacio de entretenimiento
          </span>

          <h1>
            Organiza tus series
            <br />
            <span>favoritas.</span>
          </h1>

          <p>
            Lleva el control de lo que ves,
            descubre lo que tienes pendiente
            y disfruta cada historia.
          </p>

          <Link to="/nueva" className="btn btn-gold">
            + Agregar nueva serie
          </Link>

        </div>

        <div className="hero-decoration">
          <span>✦</span>
        </div>

      </section>

      {/* Tarjetas de estadísticas. */}
      <section className="stats-grid">

        <div className="stat-card">
          <p>Total de series</p>
          <strong>{total}</strong>
          <span>En tu colección</span>
        </div>

        <div className="stat-card stat-blue">
          <p>Series terminadas</p>
          <strong>{terminadas}</strong>
          <span>Historias completadas</span>
        </div>

        <div className="stat-card stat-gold">
          <p>Series pendientes</p>
          <strong>{pendientes}</strong>
          <span>Por descubrir</span>
        </div>

      </section>

      {/* Sección de colección de series. */}
      <section className="collection-section">

        <div className="section-heading">

          <span className="section-label">
            Mi biblioteca
          </span>

          <h2>Mi colección</h2>

          <p>
            Todas tus series en un solo lugar.
          </p>

        </div>

        {/* Campo de búsqueda y filtro por estado. */}
        <div className="filters-bar">

          <input
            className="form-control search-input"
            aria-label="Buscar serie"
            placeholder="Buscar una serie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="form-select filter-select"
            aria-label="Filtrar estado"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="terminada">Terminadas</option>
          </select>

        </div>

        {/* Mensaje si ocurre un error de conexión. */}
        {error && (
          <p className="error-message" role="alert">
            {error}. Verifica que Express esté iniciado.
          </p>
        )}

        {/* Muestra las tarjetas de las series. */}
        <div className="series-grid">

          {visible.map(serie => (
            <SeriesCard
              key={serie.id}
              serie={serie}
              onToggle={toggle}
              onRemove={remove}
            />
          ))}

        </div>

        {/* Mensaje si no existen resultados. */}
        {!error && visible.length === 0 && (
          <div className="empty-state">

            <span>✦</span>

            <h3>No encontramos series</h3>

            <p>
              Prueba con otro filtro o agrega
              una nueva serie.
            </p>

          </div>
        )}

      </section>

    </Layout>
  );
}

// --------------------------------------------------
// Componente para mostrar el detalle de una serie.
// --------------------------------------------------

function Detail() {

  // Obtiene el ID de la serie desde la URL.
  const { id } = useParams();

  // Estados de la información y posibles errores.
  const [serie, setSerie] = useState(null);
  const [error, setError] = useState('');

  // Consulta los datos de una serie específica.
  useEffect(() => {

    setSerie(null);
    setError('');

    fetch(`${API}/${id}`)
      .then(respuesta => {

        if (!respuesta.ok) {
          throw new Error('Serie no encontrada');
        }

        return respuesta.json();
      })
      .then(datos => {
        setSerie(datos);
      })
      .catch(e => {
        setError(e.message);
      });

  }, [id]);

  return (
    <Layout>

      {/* Encabezado de la página. */}
      <div className="page-heading">

        <Link to="/" className="back-link">
          ← Volver al tablero
        </Link>

        <span className="section-label">
          Información de la serie
        </span>

        <h1>Detalle de la serie</h1>

      </div>

      {/* Muestra error, información o carga. */}
      {error ? (

        <p className="error-message" role="alert">
          {error}
        </p>

      ) : serie ? (

        <article className="detail-card">

          {/* Estado actual de la serie. */}
          <span
            className={
              serie.estado === 'terminada'
                ? 'status status-done'
                : 'status status-pending'
            }
          >
            {serie.estado === 'terminada'
              ? 'Terminada'
              : 'Pendiente'}
          </span>

          <h2>{serie.titulo}</h2>

          {/* Género. */}
          <div className="detail-row">
            <span>Género</span>
            <strong>{serie.genero}</strong>
          </div>

          {/* Cantidad de temporadas. */}
          <div className="detail-row">
            <span>Temporadas</span>

            <strong>
              {Number(serie.temporadas) === 1
                ? '1 temporada'
                : `${serie.temporadas} temporadas`}
            </strong>
          </div>

          {/* Estado. */}
          <div className="detail-row">
            <span>Estado</span>

            <strong>
              {serie.estado === 'terminada'
                ? 'Terminada'
                : 'Pendiente'}
            </strong>
          </div>

        </article>

      ) : (

        <p>Cargando serie...</p>

      )}

    </Layout>
  );
}

// --------------------------------------------------
// Componente del formulario para agregar series.
// --------------------------------------------------

function NewSeries() {

  // Permite navegar a otra página.
  const navigate = useNavigate();

  // Estados de los campos del formulario.
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [temporadas, setTemporadas] = useState(1);
  const [error, setError] = useState('');

  // --------------------------------------------------
  // Guardar una nueva serie.
  // --------------------------------------------------

  async function submit(e) {

    // Evita que el navegador recargue la página.
    e.preventDefault();

    setError('');

    try {

      // Envía los datos al servidor Express.
      const respuesta = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          genero: genero.trim(),
          temporadas: Number(temporadas),
          estado: 'pendiente'
        })
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();

        throw new Error(
          datos.error || 'Error al guardar la serie'
        );
      }

      // Regresa al tablero al guardar correctamente.
      navigate('/');

    } catch (e) {
      setError(e.message);
    }
  }

  // --------------------------------------------------
  // Contenido visual del formulario.
  // --------------------------------------------------

  return (
    <Layout>

      <div className="page-heading">

        <Link to="/" className="back-link">
          ← Volver al tablero
        </Link>

        <span className="section-label">
          Amplía tu colección
        </span>

        <h1>Agregar nueva serie</h1>

        <p>
          Registra una serie que quieras ver
          y organiza tu entretenimiento.
        </p>

      </div>

      <div className="form-card">

        <form onSubmit={submit}>

          {/* Campo para el título. */}
          <div className="form-group">

            <label htmlFor="titulo">
              Título de la serie
            </label>

            <input
              id="titulo"
              className="form-control"
              required
              maxLength="120"
              placeholder="Ej. Breaking Bad"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />

          </div>

          {/* Campo para el género. */}
          <div className="form-group">

            <label htmlFor="genero">
              Género
            </label>

            <input
              id="genero"
              className="form-control"
              required
              maxLength="60"
              placeholder="Ej. Drama"
              value={genero}
              onChange={e => setGenero(e.target.value)}
            />

          </div>

          {/* Campo para la cantidad de temporadas. */}
          <div className="form-group">

            <label htmlFor="temporadas">
              Cantidad de temporadas
            </label>

            <input
              id="temporadas"
              className="form-control"
              type="number"
              min="1"
              max="100"
              required
              value={temporadas}
              onChange={e => setTemporadas(e.target.value)}
            />

          </div>

          {/* Muestra errores al guardar. */}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {/* Botones del formulario. */}
          <div className="form-actions">

            <button
              type="submit"
              className="btn btn-primary-custom"
            >
              Guardar serie
            </button>

            <Link
              to="/"
              className="btn btn-secondary-custom"
            >
              Cancelar
            </Link>

          </div>

        </form>

      </div>

    </Layout>
  );
}

// --------------------------------------------------
// Configuración de las rutas de React Router.
// --------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página principal. */}
        <Route
          path="/"
          element={<Board />}
        />

        {/* Página para agregar una serie. */}
        <Route
          path="/nueva"
          element={<NewSeries />}
        />

        {/* Página de detalle de una serie. */}
        <Route
          path="/serie/:id"
          element={<Detail />}
        />

        {/* Página para rutas inexistentes. */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="empty-state">

                <h2>Página no encontrada</h2>

                <Link to="/">
                  Volver al tablero
                </Link>

              </div>
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

// --------------------------------------------------
// Inicio de la aplicación React.
// --------------------------------------------------

createRoot(document.getElementById('root')).render(
  <App />
);
