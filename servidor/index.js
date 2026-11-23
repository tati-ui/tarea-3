import express from 'express';import cors from 'cors';
const app=express();app.use(cors());app.use(express.json());
let nextId=4;let series=[{id:1,titulo:'Dark',genero:'Ciencia ficción',temporadas:3,estado:'terminada'},{id:2,titulo:'The Bear',genero:'Drama',temporadas:3,estado:'pendiente'},{id:3,titulo:'Arcane',genero:'Animación',temporadas:2,estado:'terminada'}];
app.get('/api/series',(req,res)=>res.json(series));
app.get('/api/series/:id',(req,res)=>{const s=series.find(x=>x.id===Number(req.params.id));return s?res.json(s):res.status(404).json({error:'No encontrada'})});
app.post('/api/series',(req,res)=>{const {titulo,genero,temporadas,estado='pendiente'}=req.body;if(typeof titulo!=='string'||!titulo.trim()||typeof genero!=='string'||!genero.trim()||!Number.isInteger(temporadas)||temporadas<1||!['pendiente','terminada'].includes(estado))return res.status(400).json({error:'Datos inválidos'});const s={id:nextId++,titulo:titulo.trim(),genero:genero.trim(),temporadas,estado};series.push(s);res.status(201).json(s)});
app.patch('/api/series/:id',(req,res)=>{const s=series.find(x=>x.id===Number(req.params.id));if(!s)return res.status(404).json({error:'No encontrada'});if(!['pendiente','terminada'].includes(req.body.estado))return res.status(400).json({error:'Estado inválido'});s.estado=req.body.estado;res.json(s)});
app.delete('/api/series/:id',(req,res)=>{const n=series.length;series=series.filter(x=>x.id!==Number(req.params.id));res.status(series.length<n?204:404).end()});
app.listen(3001,()=>console.log('API en http://localhost:3001'));
