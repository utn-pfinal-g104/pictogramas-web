import { Autocomplete, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Filtros(props: any) {

  const [filtrosSeleccionados, setfiltrosSeleccionados] = useState([] as any[])
  const [filtros, setFiltros] = useState(props.filtros as any[])

  return (
    <Grid container direction="row">
      <Grid item xs={12}>
        <Autocomplete
          value={filtrosSeleccionados}
          multiple
          id="tags-standard"
          options={filtros}
          getOptionLabel={(option) => option.nombre}
          disableCloseOnSelect
          defaultValue={filtrosSeleccionados}
          onChange={(event, value) => setfiltrosSeleccionados(value)}
          renderOption={(propps, option: any, { selected }) => (
            <React.Fragment key={option.id}>
              <Checkbox
                style={{ color: '#00A7E1' }}
                checked={selected}
                onClick={() => { 
                  if(!selected)
                  {
                    let newFilters = [...filtrosSeleccionados]
                    newFilters.push(option)
                    props.setFiltros(newFilters)
                    setfiltrosSeleccionados(newFilters)
                  }
                  else {
                    let filtrado = filtrosSeleccionados.filter(f => f.nombre !== option.nombre)
                    props.setFiltros(filtrado)
                    setfiltrosSeleccionados(filtrado)
                  }
                }}
              />
              {option.nombre}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={props.filtro}
              placeholder="Seleccione una o más categorías"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};


