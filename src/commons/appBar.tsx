import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useLocation, useNavigate } from 'react-router-dom';
import FormDialogValidarAcceso from '../configuracion/components/validarCambioConfiguracion';
import { getUsuarioLogueado } from '../services/usuarios-services';
import { IUsuario } from '../login/model/usuario';
import imagenUsuario from '../commons/imagen-usuario.png';
import imagenMenu from '../commons/imagen-menu.png';
import Logo from '../commons/Logo-PictogAR.png';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CircularProgress } from '@mui/material';
import { Check, MenuRounded, SyncRounded } from '@mui/icons-material';
import Icon from '@mui/icons-material';
import { UpdateService } from '../services/update-service';


const pages = ['Principal', 'Pizarras', 'Actividades', 'Estadísticas'];
const settings = ['Configuración', 'Cambiar Cuenta'];

const ResponsiveAppBar = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [configuracionOpen, setConfiguracionOpen] = React.useState(false);
  const [userLogueado, setUserLogueado] = React.useState(
    null as IUsuario | null
  );
  const porcentaje = useSelector((state: RootState) => state.porcentaje.value);
  const [renderListo, setRenderListo] = React.useState(false);
  const [userCargado, setUserCargado] = React.useState(false);

  React.useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
        setUserCargado(true)
      } else {
        navigate('/cuenta/seleccionar' + location.search);
      }
    });
  }, []);

  React.useEffect(() => {
    if (porcentaje === 100) renderSincronizadoListo();
  }, [porcentaje]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const cerrarValidarConfiguracion = () => {
    setConfiguracionOpen(false);
  };

  const handleChange = (page: string) => {
    if (page === 'Configuración') {
      setConfiguracionOpen(true);
    } else {
      navigate(
        `/${page.toLocaleLowerCase().replace(/ /g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}` + location.search
      );
    }
  };

  const renderSincronizadoListo = () => {
    setRenderListo(true);
    setTimeout(function () {
      setRenderListo(false);
    }, 5000);
  };

  return (
    <AppBar position="static" style={{ marginBottom: 0, background: '#003882' }}>
      <Container maxWidth="xl" style={{ background: '#003882' }}>
        <Toolbar disableGutters>
          {configuracionOpen && (
            <FormDialogValidarAcceso
              cerrarValidarConfiguracion={cerrarValidarConfiguracion}
            />
          )}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 0,
            alignItems: 'center'
          }}>
            <a href="/pictogramas">
              <img alt="PictogAr" src={Logo} height="40" />
            </a>
            {porcentaje > 0 && porcentaje < 100 && (
              <Box style={{ marginLeft: 25 }}>
                <Box
                  sx={{
                    position: 'relative',
                    alignContent: 'center',
                    display: 'inline-flex',
                    align: 'center',
                    marginLeft: 3
                  }}
                >
                  <CircularProgress color="inherit" />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="button"
                      component="div"
                      color="#fff"
                      display="block"
                    >{`${porcentaje.toString()}%`}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {porcentaje === 100 && renderListo && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  align: 'center',
                  marginLeft: 3
                }}
              >
                <Check></Check>
              </Box>
            )}            
            <Box>
              {!(porcentaje === 100 && renderListo) &&
                <IconButton aria-label="sincronizar" key={'Sincronizar'}
                onClick={() => { dispatchEvent(new CustomEvent('BotonSincronizar')); }}
                size="large" sx={{color: 'white'}}>
                  <SyncRounded></SyncRounded>
                </IconButton>
              }
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="Menú"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuRounded />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }} >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleChange(page);
                  }}
                  sx={{
                    color: 'black',
                    display: 'block',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    fontSize: 'large',
                    textTransform: 'capitalize'
                  }} >
                  <Typography textAlign="left">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
            <a href="/pictogramas">
              <img alt="PictogAr" src={Logo} height="40" />
            </a>
            {porcentaje > 0 && porcentaje < 100 && (
              <Box style={{ marginLeft: 10 }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    align: 'center'
                  }}
                >
                  <CircularProgress color="inherit" />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      variant="button"
                      component="div"
                      color="#fff"
                      display="block"
                    >{`${porcentaje.toString()}%`}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {porcentaje === 100 && renderListo && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  align: 'center'
                }}
              >
                <Check></Check>
              </Box>
            )}
            <Box>
            {!(porcentaje === 100 && renderListo) &&
                <IconButton aria-label="sincronizar" key={'Sincronizar'}
                onClick={() => { dispatchEvent(new CustomEvent('BotonSincronizar')); }}
                size="large" sx={{color: 'white'}}>
                  <SyncRounded></SyncRounded>
                </IconButton>
              }
            </Box>
          </Box>
          <Box sx={{
            flexGrow: 1,
            justifyContent: 'space-evenly',
            display: { xs: 'none', md: 'flex' }
          }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleChange(page)}
                sx={{
                  color: 'white',
                  display: 'block',
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  fontSize: 'large',
                  textTransform: 'capitalize'
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* TODO: Podriamos agregar aca un mensaje y porcentaje de sincronizacion */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Configuración">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {userCargado && (
                  <Avatar
                    alt="Remy Sharp"
                    src={
                      userLogueado &&
                        userLogueado.imagen &&
                        userLogueado.imagen !== ''
                        ? userLogueado.imagen
                        : imagenUsuario
                    }
                  />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleChange(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;