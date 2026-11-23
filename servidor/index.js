
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());

// Modelo de datos de MongoDB.
const serieSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  genero: { type: String, required: true },
  temporadas: { type: Number, required: true, min: 1 },
  estado: {
    type: String,
    enum: ['pendiente', 'terminada'],
    default: 'pendiente'
  }
});

const Serie = mongoose.model('Serie', serieSchema);

// Convierte los documentos al formato que espera React.
function formatoSerie(documento) {
  return {
    id: documento._id.toString(),
    titulo: documento.titulo,
    genero: documento.genero,
    temporadas: documento.temporadas,
    estado: documento.estado
  };
}

// Obtener todas las series.
app.get('/api/series', async (req, res) => {
  try {
    const series = await Serie.find();
    res.json(series.map(formatoSerie));
  } catch {
    res.status(500).json({ error: 'Error al consultar series' });
  }
});

// Obtener una serie por ID.
app.get('/api/series/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    const serie = await Serie.findById(req.params.id);

    if (!serie) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    res.json(formatoSerie(serie));
  } catch {
    res.status(500).json({ error: 'Error al consultar la serie' });
  }
});

// Agregar una nueva serie.
app.post('/api/series', async (req, res) => {
  try {
    const { titulo, genero, temporadas, estado = 'pendiente' } = req.body;

    if (
      typeof titulo !== 'string' || !titulo.trim() ||
      typeof genero !== 'string' || !genero.trim() ||
      !Number.isInteger(temporadas) || temporadas < 1 ||
      !['pendiente', 'terminada'].includes(estado)
    ) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const serie = await Serie.create({
      titulo: titulo.trim(),
      genero: genero.trim(),
      temporadas,
      estado
    });

    res.status(201).json(formatoSerie(serie));
  } catch {
    res.status(500).json({ error: 'Error al guardar la serie' });
  }
});

// Cambiar el estado de una serie.
app.patch('/api/series/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    if (!['pendiente', 'terminada'].includes(req.body.estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const serie = await Serie.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true, runValidators: true }
    );

    if (!serie) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    res.json(formatoSerie(serie));
  } catch {
    res.status(500).json({ error: 'Error al actualizar la serie' });
  }
});

// Eliminar una serie.
app.delete('/api/series/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    const serie = await Serie.findByIdAndDelete(req.params.id);

    if (!serie) {
      return res.status(404).json({ error: 'No encontrada' });
    }

    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Error al eliminar la serie' });
  }
});

// Conectar MongoDB antes de iniciar Express.
async function iniciarServidor() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/maraton_series');

    console.log('MongoDB conectado correctamente');

    app.listen(3001, () => {
      console.log('API en http://localhost:3001');
    });
  } catch (error) {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
