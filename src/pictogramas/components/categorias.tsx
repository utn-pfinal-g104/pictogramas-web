import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { ICategoria } from '../models/categoria';
import { ObtenerCategorias } from '../services/pictogramas-services';
import PictogramasPorCategoria from './pictogramasPorCategoria';

const Categorias = (props: any) => {

  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({} as ICategoria|null)

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <Container>
      {categorias.map((categoria) => {
        return (
          <Container>
            <Card
              sx={{ maxWidth: 345 }}
              style={{ marginTop: '10px' }}
              onClick={() => {
                //EXPANDIR CATEGORIA
              }}
            >
              <CardActionArea
                onClick={() => {
                  console.log('Clickearon una categoria: ', categoria.id)
                  if (categoriaSeleccionada == null || categoriaSeleccionada !== categoria)
                    setCategoriaSeleccionada(categoria)
                  else
                    setCategoriaSeleccionada(null)
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
                  alt="MESSI"
                ></CardMedia>
                <CardHeader title={categoria.nombre}></CardHeader>
                <CardContent>{/* Quizas agregar una imagen */}</CardContent>
              </CardActionArea>
            </Card>
            {categoria === categoriaSeleccionada && <PictogramasPorCategoria categoria={categoriaSeleccionada.id}>
            </PictogramasPorCategoria> }
          </Container>
        );
      })}
    </Container>
  );
};

export default Categorias;
