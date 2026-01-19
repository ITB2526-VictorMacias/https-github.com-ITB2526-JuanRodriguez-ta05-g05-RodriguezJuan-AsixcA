# Neonfolio — Portafolio Personal (HTML + CSS + JS)

Sitio web tipo **Portafolio Personal** con estética futurista (neón + glassmorphism), responsive y sin frameworks.  
Incluye páginas de detalle de proyectos, listado con buscador y formulario de contacto con validación.

## Estructura del proyecto

- `index.html` → Página principal (hero + 2 proyectos destacados)
- `projects.html` → Listado de proyectos (mínimo 6) + buscador en tiempo real
- `project1.html` → Detalle del Proyecto 1
- `project2.html` → Detalle del Proyecto 2
- `contact.html` → Formulario de contacto con validación (HTML + JS)
- `css/styles.css` → Estilos globales (neón / glassmorphism / responsive)
- `js/app.js` → Funcionalidades JavaScript
- `images/` → Imágenes de proyectos (placeholders)

## Páginas

### Inicio (`index.html`)
- Hero con nombre, rol y descripción
- Sección de **Proyectos destacados** (2 cards)
- Navegación común: Inicio / Proyectos / Contacto

### Proyectos (`projects.html`)
- Grid con mínimo 6 proyectos
- Los 2 primeros enlazan a sus detalles: `project1.html` y `project2.html`
- Buscador para filtrar proyectos en tiempo real

### Detalle (`project1.html` y `project2.html`)
- Título, descripción, tecnologías, galería de imágenes
- Botón “Volver a proyectos”

### Contacto (`contact.html`)
- Validación HTML: `required`, `pattern`, `minlength`
- Mensajes de error y ayuda visual en pantalla

## Funcionalidades JavaScript (mínimo 3)

1. **Validación extra del formulario**  
   Mensajes dinámicos por campo y estado final (sin alerts).
2. **Toggle Neón ON/OFF**  
   Cambia variables CSS y guarda preferencia en `localStorage`.
3. **Buscador en projects.html**  
   Filtra cards en tiempo real según texto.

Extras:
- Contadores animados al hacer scroll (`IntersectionObserver`)
- Contador de visitas usando `localStorage`

## Cómo ejecutar en local

Opción recomendada:
- Abrir el proyecto en VSCode
- Instalar/usar extensión **Live Server**
- Click derecho en `index.html` → **Open with Live Server**

## Publicación (GitHub Pages)

1. Subir el proyecto a un repositorio en GitHub.
2. En el repo: **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / Folder: **/(root)**
5. Guardar y usar la URL publicada.

## Autor
- Nombre: Juan carlos Rodrigiuez 
- Curso/Grupo: AsixcA