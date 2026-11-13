# Sistema de Registro de Incidencias

Aplicación web sencilla para registrar y consultar incidencias reportadas
por usuarios. Proyecto de la asignatura Gestión de la Configuración del
Software (Unidad 3, Despliegue continuo).

## Tecnologías
- HTML, CSS y JavaScript (sin base de datos ni servidor)
- Git y GitHub (control de versiones)
- GitHub Actions (validación y despliegue)
- GitHub Pages (publicación)

## Integrantes
| Integrante | Rol |
|---|---|
| Bermeo   | Gestión del repositorio y SCM   |
| Gonzalez | Desarrollo de la app (v1.0.0)   |
| Alvarado | Nuevas funcionalidades (v1.1.0) |
| Cajamarca| Automatización del despliegue   |
| Calle    | Corrección de errores (v1.1.1)  |

## Cómo ejecutarlo
1. Clonar el repositorio:
   `git clone https://github.com/DeboraBermeo/Registro-de-incidencias.git`
2. Abrir la carpeta del proyecto.
3. Abrir `index.html` en el navegador (o usar la extensión Live Server de VS Code).

## Aplicación publicada
https://deborabermeo.github.io/Registro-de-incidencias/

## Despliegue automático
El flujo `.github/workflows/deploy.yml` valida que los archivos y elementos
principales de la aplicación existan y comprueba la sintaxis de JavaScript.
Al actualizar `main`, publica el sitio en GitHub Pages únicamente si la
validación finaliza correctamente. Para habilitarlo, configurar **Settings >
Pages > Build and deployment > Source** como **GitHub Actions**.

## Flujo de trabajo (ramas)
- `main`: versión estable, se despliega automáticamente.
- `feature/*`: nuevas funcionalidades.
- `fix/*`: corrección de errores.
- `docs/*`: documentación.
- Todo cambio entra a `main` mediante Pull Request.

## Versionamiento
Se usa versionamiento semántico (MAJOR.MINOR.PATCH):
- v1.0.0: registro y listado de incidencias.
- v1.1.0: filtrado de incidencias por estado.
- v1.1.1: corrección de error de la versión anterior.