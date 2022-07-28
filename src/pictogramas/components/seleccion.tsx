import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { IPictogram } from '../models/pictogram';
import React from 'react';
import Speech from 'react-speech';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function Seleccion(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  var i = 0;

  useEffect(() => {
    console.log('pictogramas Actualizados: ', props.pictogramas);
    setPictogramas(props.pictogramas);
  }, [props.pictogramas]);

  return (
    <Container style={{padding: 10}}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
      >
        {pictogramas.map((pictograma: IPictogram) => {
          return (
            <Grid key={i++} item xs={12} sm={4} md={2}>
              <Container key={i++}>
                <Card
                  sx={{ maxWidth: 345 }}
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    let nuevaLista = pictogramas.filter(
                      (p: IPictogram) => p.id != pictograma.id
                    );
                    console.log(
                      'removiendo pictograma, van a quedar: ',
                      nuevaLista
                    );
                    props.setPictogramas(nuevaLista);
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      // image={
                      //   apiPictogramas +
                      //   '/pictogramas/' +
                      //   pictograma.id +
                      //   '/obtener'
                      // }
                      src={`data:image/png;base64, ${pictograma.imagen}`}
                      alt={pictograma.keywords[0].keyword}
                    ></CardMedia>
                    <CardHeader
                      title={pictograma.keywords[0].keyword}
                    ></CardHeader>
                    <CardContent></CardContent>
                  </CardActionArea>
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
      {pictogramas.length > 0 && 
        <div>
            <Speech 
              // styles={"cursor: pointer; pointer-events: all; outline: none; background-color: gainsboro; border: 1px solid rgb(255, 255, 255); border-radius: 6px;"}
              // styles={{style}}
              textAsButton={true}
              displayText="Interpretacion Literal"
              text={(pictogramas.map(p => p.keywords[0].keyword)).toString()}
            />
        </div>
        }
    </Container>
  );
}

const style = {
  container: { },
  text: { },
  buttons: { },
  play: {
    hover: {
      backgroundColor: 'GhostWhite'
    },
    button: {
      cursor: 'pointer',
      //pointerEvents: 'play',
      outline: 'none',
      backgroundColor: 'Gainsboro',
      border: 'solid 1px rgba(255,255,255,1)',
      borderRadius: 6
    }
  },
  pause: {
    play: { },
    hover: { }
  },
  stop: {
    play: {
      hover: { },
      button: { }
    },
  },
  resume: {
    play: {
      hover: { },
      button: { }
    }
  }
};
