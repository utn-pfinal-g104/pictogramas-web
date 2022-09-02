import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { ICategoria } from '../../models/categoria';
import { ObtenerCategorias } from '../../services/pictogramas-services';
import CategoriaPropios from './categoriaPropios';

export default function Categorias(props: any) {
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    {} as ICategoria | null
  );

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <Container>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>
        {/* TODO: Agregar pictogramas favoritos o recientes si fuera necesario */}
        <CategoriaPropios setCategoriaSeleccionada={props.setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
        {/* 
        TODO: Se debe devolver solo las categorias que no tengan categoria padre 
          En caso de que tengan padre, se renderizaran dentro de la categoria seleccionada 
        */}
        {categorias.map((categoria) => {
          return (
            <Grid
              key={categoria.id + '-' + categoria.nombre}
              item xs={12} sm={4} md={2}
            >
              <Container key={categoria.id + '-' + categoria.nombre}>
                <Card
                  sx={{ maxWidth: 245, minWidth:150 }}
                  style={{ marginTop: '10px' }}
                  onClick={() => {}}
                >
                  <CardActionArea
                    onClick={() => {
                      console.log('Clickearon una categoria: ', categoria.id);
                      if (
                        categoriaSeleccionada == null ||
                        categoriaSeleccionada !== categoria
                      ) {
                        setCategoriaSeleccionada(categoria);
                        props.setCategoriaSeleccionada(categoria);
                      } else {
                        setCategoriaSeleccionada(null);
                        props.setCategoriaSeleccionada(null);
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
                      alt="MESSI"
                    ></CardMedia>
                    <CardHeader title={categoria.nombre}></CardHeader>
                    <CardContent></CardContent>
                  </CardActionArea>
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
