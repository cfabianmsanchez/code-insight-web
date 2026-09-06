# Code Insight Web (`code-insight-web`) 🚀

Frontend desarrollado en **Angular 17 (Standalone Components & Signals)** con **Arquitectura basada en Características (Feature-Based)** y el **Patrón Facade**, diseñado para interactuar mediante **API REST** con el backend `code-insight-api`.

---

## 🏛️ Arquitectura del Proyecto Frontend

El proyecto sigue una estructura modular limpia dividida por características (`features`) y responsabilidad de datos (`data-access`):

```text
code-insight-web/
src/
├── app/
│   ├── app.component.ts               # Layout principal
│   ├── app.config.ts                  # Configuración Standalone (provideHttpClient, provideRouter)
│   ├── app.routes.ts                  # Rutas con lazy loading
│   │
│   ├── core/                          # Elementos transversales singleton
│   │   └── models/
│   │       └── api-error.model.ts     # Modelo de error RFC 7807
│   │
│   ├── shared/                        # Componentes reutilizables
│   │   └── components/
│   │       ├── header/                # Header con estado de conexión
│   │       └── loader/                # Spinner asíncrono e indicador de pipeline
│   │
│   └── features/                      # Arquitectura basada en características (Feature-Based)
│       └── code-analysis/             # Característica principal de análisis
│           ├── components/
│           │   ├── analysis-input/    # Pestañas de GitHub URL y Subida de .ZIP
│           │   ├── summary-card/      # Resumen Funcional destacado y Ficha Técnica
│           │   ├── tech-stack-view/   # Stack Tecnológico y extensión de archivos
│           │   ├── architecture-evidence/ # Relaciones Inbound/Outbound e Ingeniería
│           │   ├── components-catalog/# Tabla de componentes filtrable por estereotipos
│           │   ├── ai-synthesis-view/ # Renderizado del informe Markdown de Ollama
│           │   └── prompt-inspector/  # Inspector colapsable del contexto LLM
│           │
│           ├── data-access/           # CAPA DE ACCESO A DATOS REST
│           │   └── code-analysis-api.service.ts # Cliente HTTP REST (POST /api/v1/analyses/*)
│           │
│           ├── facade/                # PATRÓN FACADE CON ANGULAR SIGNALS
│           │   └── code-analysis.facade.ts # Facade encapsulando Signals (status, result, error)
│           │
│           ├── models/
│           │   ├── analysis-request.model.ts
│           │   └── analysis-response.model.ts # Contrato exacto del backend
│           │
│           └── pages/
│               └── code-analysis-page/# Página contenedora orquestada
│
├── environments/
│   ├── environment.ts                 # Dev: http://localhost:8080/api/v1
│   └── environment.prod.ts
└── styles.css                         # Sistema de diseño con fuentes locales del sistema
```

---

## 💡 Patrón Facade con Angular Signals

El **Patrón Facade (`CodeAnalysisFacade`)** aísla a los componentes visuales de las llamadas de red y manejo de estados mediante **Angular Signals**:

- **Señales Expuestas (Readonly Signals)**:
  - `facade.status()`: Estado reactivo (`'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'`).
  - `facade.result()`: Contiene el resultado consolidado del análisis (`RepositoryAnalysisResponseDto`).
  - `facade.error()`: Mensaje de error de la API backend si ocurre alguna falla.
  - `facade.loading()`: Señal calculada (`computed`).
  - `facade.hasReport()`: Señal calculada (`computed`).
- **Operaciones Simplificadas**:
  - `facade.analyzeGithubRepo(repoUrl, projectKey)`: Ejecuta análisis de repositorio GitHub.
  - `facade.analyzeZipFile(file, projectKey)`: Ejecuta análisis multipart de archivo `.zip`.
  - `facade.reset()`: Reinicia el estado para un nuevo análisis.

---

## 🔌 Comunicación REST con Backend (`code-insight-api`)

El cliente REST (`CodeAnalysisApiService`) consume los endpoints expuestos por la Arquitectura Hexagonal del backend:

1. **GitHub Analysis**: `POST http://localhost:8080/api/v1/analyses/github`
   ```json
   {
     "projectKey": "code-insight-api",
     "repoUrl": "https://github.com/cfabianmsanchez/code-insight-api"
   }
   ```
2. **ZIP Analysis**: `POST http://localhost:8080/api/v1/analyses/zip` (`multipart/form-data`)

---

## 🚀 Cómo Ejecutar la Aplicación

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm start
```
Abre el navegador en: `http://localhost:4200`

---

## 🧪 Pruebas y Compilación
```bash
npm run build
```
