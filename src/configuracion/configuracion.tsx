import ResponsiveAppBar from '../commons/appBar';
import SettingsIcon from '@mui/icons-material/Settings';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { Container } from '@mui/system';
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { useEffect, useState } from 'react';
import {
  ActualizarUsuarioPassword,
  getUsuarioLogueado,
  usuarioLogueado,
} from '../services/usuarios-services';
import { useLocation, useNavigate } from 'react-router-dom';
import { Console } from 'console';
import Filtros from '../pictogramas/components/filtros';
import { ICategoria } from '../pictogramas/models/categoria';
import { formatDate, ObtenerCategorias } from '../pictogramas/services/pictogramas-services';
import React from 'react';
import FormDialogValidarAcceso from './components/validarCambioConfiguracion';
import imagenUsuario from '../commons/imagen-usuario.png'
import { ICategoriaPorUsuario } from '../pictogramas/models/categoriaPorUsuario';
import FiltroCategoriasPorUsuario from './components/filtroCategoriasPorUsuario';
import { AttachFile, HelpOutline, HelpRounded } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { AddRounded, AttachFileRounded, CancelRounded, PlusOneRounded, SaveRounded } from '@mui/icons-material';

function agruparElementos(datos, predicado) : ICategoria[] { //agrupar categorias por algun campo en particular

  return datos.reduce((a, v, i) => (a[predicado(v, i) ? 0 : 1].push(v), a), [[], []]);
}

export default function Configuracion() {
  let navigate = useNavigate();
  let location = useLocation();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState(IndexedDbService.create());
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );
  const [categoriasDeUsuario, setCategoriasDeUsuario] = useState(
    [] as ICategoriaPorUsuario[]
  );

  const [personalizarCategorias, setPersonalizarCategorias] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    
    setNivel(event.target.value as string);

    if(Number(event.target.value) === 3){
      setPersonalizarCategorias(true)
      obtenerCategoriasDeUsuario();
    } else {
      setPersonalizarCategorias(false)
    }
    if (userLogueado !== null)
      userLogueado.nivel = Number(nivel) 
  };


  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);
  const [nivel, setNivel] = React.useState('');
  const [violence, setViolence] = useState(false as boolean);
  const [sex, setSex] = useState(false as boolean);
  const [nombreUsuario, setNombreUsuario] = useState('' as string);

  const [schematic, setSchematic] = useState(false as boolean)

  const [file, setFile] = useState("" as string)

  const niveles = ["Inicial","Intermedio","Avanzado", "Personalizado"];

  const [categoriasPorUsuarioOriginal, setCategoriasPorUsuarioOriginal] = useState([] as ICategoriaPorUsuario[]);


  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    getUsuarioLogueado().then((usuario) => {
      if (usuario !== undefined) {
        setUserLogueado(usuario);
        setViolence(usuario.violence);
        setSex(usuario.sex);
        setSchematic(usuario.schematic);
        setNivel(usuario.nivel.toString());
        setNombreUsuario(usuario.nombreUsuario);
      }
      else{
        navigate('/cuenta/seleccionar' + location.search);
      }
    });
  }, []);

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  useEffect(() => {
    obtenerCategoriasDeUsuario();
  }, [categorias]);

  useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      let usuarioNivel =
      usuario !== undefined ? usuario.nivel : 0;
  if(usuarioNivel === 3){
    setPersonalizarCategorias(true);
  } else {
    setPersonalizarCategorias(false);
  }
    });   
  }, []);

  const actualizarUsuario = async () => {
    if (userLogueado) {
      console.log("ACTUALIZACION DE USUARIO")
      let usuario = userLogueado;
      usuario.nombreUsuario = nombreUsuario;
      usuario.violence = violence;
      usuario.sex = sex;
      usuario.schematic = schematic;
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      usuario.ultimaActualizacion = localISOTime;
      usuario.nivel = Number(nivel);
      (await db).putOrPatchValue('usuarios', usuario)
      dispatchEvent(new CustomEvent('sincronizar'));
    };
  }

  function guardarImagenBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if(reader.result && userLogueado){
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var fechaActualizacion = localISOTime
        userLogueado.ultimaActualizacion = fechaActualizacion;
        userLogueado.imagen = reader.result.toString()
        IndexedDbService.create().then(async (db) => {      
          await db.putOrPatchValue("usuarios", userLogueado)
          dispatchEvent(new CustomEvent('sincronizar'));
        })
      }
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  async function insertarCategoriasDeUsuario(categorias : ICategoria[]){
  
  if(userLogueado){
  categorias.forEach(async c => {
    let categoriaPorUsuario : ICategoriaPorUsuario = {
      id: userLogueado.id?.toString() + '_' + c.id,
      idCategoria: c.id,
      idUsuario: (userLogueado.id === undefined || userLogueado.id === null) ? 0 : userLogueado.id,
      pendienteAgregar: true,
      pendienteEliminar: false
    };
    await IndexedDbService.create().then(async (db) => {
      await db.putOrPatchValue('categoriasPorUsuario', categoriaPorUsuario);
      dispatchEvent(new CustomEvent('sincronizar'));
    })
     
  });  
    }
 }

 async function eliminarCategoriasDeUsuario(categorias : ICategoriaPorUsuario[]) {
      if(userLogueado){
        await IndexedDbService.create().then(async (db) => {
          let cxus = await (await db).searchCategoriasPorUsuarioByUser((userLogueado && userLogueado.id) ? userLogueado.id : 0);
          cxus.forEach(async cxu => {
            if(categorias.some(c => c.idCategoria === cxu.idCategoria)){
              cxu.pendienteAgregar = true;
              cxu.pendienteEliminar = true;
              await db.putOrPatchValue('categoriasPorUsuario', cxu);
            }           
          });
        })
        dispatchEvent(new CustomEvent('sincronizar'));
      }
 }

 async function obtenerCategoriasDeUsuario() {
    let usuario = (await getUsuarioLogueado());    
    if(usuario){
      IndexedDbService.create().then(async (db) => {
        let cxus = await (await (await db).searchCategoriasPorUsuarioByUser((usuario && usuario.id) ? usuario.id : 0)).filter(c => !c.pendienteEliminar);        
        setCategoriasDeUsuario(cxus);
        setCategoriasPorUsuarioOriginal(cxus);
        setCategoriasFiltradas(categorias.filter(c => cxus.some(cxu => cxu.idCategoria === c.id)));
        console.log('CATEGORIAS DE USUARIO: ', cxus);
        console.log('categorias: ', categorias);
        console.log('categorias filtradas: ', categorias.filter(c => cxus.some(cxu => cxu.idCategoria === c.id)));
      })
    }
 }

  return (
    <div
      style={{ 
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: "#e7ebf0" }}>
      {userLogueado && (
        <div>
          <ResponsiveAppBar />
          <Container>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel sx={{color: '#00A7E1'}}>
                <h1>
                  <SettingsIcon /> Configuración
                </h1>
              </FormLabel>
              <Paper 
                style={{ width: "100%" }}>
                <Container>
                  <Grid container 
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    rowSpacing={{ xs: 2, sm: 2, md: 2 }}
                    columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                    <Grid item sx={{marginTop: 2, marginBottom: 2}}>
                      <Grid item>
                        <Card
                        onClick={() => {}}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="140"
                              src={
                                userLogueado &&
                                userLogueado.imagen &&
                                userLogueado.imagen !== ""
                                  ? userLogueado.imagen
                                  : imagenUsuario
                              }
                              alt={userLogueado.nombreUsuario}>
                            </CardMedia>
                            <CardHeader
                              title={userLogueado.nombreUsuario}>
                            </CardHeader>
                            <CardContent></CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item>
                      <Button variant="contained" 
                        startIcon={<AttachFileRounded />} sx={{fontFamily:'Arial', fontWeight:'bold', background: '#00A7E1'}}>
                          Adjuntar nueva foto
                        <input
                            type="file"
                            hidden
                            onChange={(evt) => {
                              if (evt.target.files) {
                                guardarImagenBase64(evt.target.files[0]);
                                navigate("../pictogramas");
                              }
                              console.log(file);
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid item>
                        <FormControl sx={{ marginTop: 2 }}>
                          <InputLabel id="nivel-select-label">Nivel</InputLabel>
                          <Select
                            labelId="nivel-select-label"
                            id="nivel-select"
                            value={nivel}
                            label="Nivel"
                            onChange={handleChange}
                            fullWidth >
                            <MenuItem value={0}>{niveles[0]}</MenuItem>
                            <MenuItem value={1}>{niveles[1]}</MenuItem>
                            <MenuItem value={2}>{niveles[2]}</MenuItem>
                            <MenuItem value={3}>{niveles[3]}</MenuItem>
                          </Select>
                        </FormControl>
                        <Tooltip title="El nivel Personalizado permite elegir las categorías a mostrar." >
                          <IconButton 
                            size="large" sx={{color: '#00A7E1'}}>
                              <HelpRounded></HelpRounded>
                          </IconButton>  
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <FormGroup aria-label="center" style={{ paddingRight: 10 }}>
                          <FormControlLabel
                            style={{ alignItems: "left", marginLeft: 2 }}
                            control={
                              <Checkbox
                                checked={violence}
                                onChange={(evt) => setViolence(evt?.target?.checked)}
                              />
                            }
                            label="Permitir contenido violento"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            style={{ alignItems: "left", marginLeft: 2 }}
                            control={
                              <Checkbox
                                checked={sex}
                                onChange={(evt) => setSex(evt?.target?.checked)}
                              />
                            }
                            label="Permitir contenido sexual"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            style={{ alignItems: "left", marginLeft: 2 }}
                            control={
                              <Checkbox
                                checked={schematic}
                                onChange={(evt) => setSchematic(evt?.target?.checked)}
                              />
                            }
                            label="Sólo pictogramas simples"
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>          
              </Paper>
            </FormControl>
            {
              <div>
                <Switch
                  checked={personalizarCategorias}
                  onChange={handleChange}
                  disabled={true}
                />{" "}
                Personalizar Categorias
              </div>
            }
            {personalizarCategorias && (
              <div>
                Seleccione las categorías que desea visualizar
                {categorias.length > 0 && (
                  <FiltroCategoriasPorUsuario
                    // filtros={categorias.sort((a,b) => a.categoriaPadre - b.categoriaPadre)} //TODO ver si este ordenamiento se puede usar como corte
                    filtros={
                      agruparElementos(
                        categorias,
                        (c) => c.esCategoriaFinal === true
                      )[0]
                    }
                    setFiltros={setCategoriasFiltradas}
                    categoriasDeUsuario={categoriasDeUsuario}
                    filtro={"Categorias"}
                  />
                )}
              </div>
            )}

            <Stack spacing={2} direction="row">
              <Button  onClick={async () => {
                  if (isNaN(Number(nivel))) {
                    alert(
                      "Debes seleccionar un nivel para actualizar el usuario."
                    );
                  } else {
                    await actualizarUsuario();
                    if (Number(nivel) === 3) {
                      //TODO revisar  las desmarcadas
                      console.log(
                        "Categorias originales: ",
                        categoriasPorUsuarioOriginal
                      );
                      console.log(
                        "Categorias filtradas: ",
                        categoriasFiltradas
                      );
                      let categoriasAEliminar =
                        categoriasPorUsuarioOriginal.filter(
                          (cat: ICategoriaPorUsuario) =>
                            !categoriasFiltradas.some(
                              (c: ICategoria) => c.id === cat.idCategoria
                            )
                        );
                      console.log(
                        "Categorias a eliminar: ",
                        categoriasAEliminar
                      );
                      let categoriasAGuardar = categoriasFiltradas.filter(
                        (cat: ICategoria) =>
                          !categoriasPorUsuarioOriginal.some(
                            (c: ICategoriaPorUsuario) =>
                              c.idCategoria === cat.id
                          )
                      );
                      console.log("Categorias a guardar: ", categoriasAGuardar);
                      await insertarCategoriasDeUsuario(categoriasAGuardar);
                      await eliminarCategoriasDeUsuario(categoriasAEliminar);
                    }
                    // window.location.reload();
                    navigate("../pictogramas");
                  }
                }}
                variant="contained" 
                startIcon={<SaveRounded />} sx={{fontFamily:'Arial', fontWeight:'bold', background: '#00A7E1'}}>Guardar</Button>
            </Stack>
          </Container>
        </div>
      )}
    </div>
  );
}
