# Code Insight Web (`code-insight-web`)

Frontend desarrollado en **Angular (v17/18 Standalone & Signals)** con **Arquitectura Feature-Based** y el **Patrón de Diseño Facade**, diseñado para interactuar mediante **API REST** con el backend `code-insight-api`.

---

## 🏛️ Arquitectura del Proyecto Frontend

El proyecto sigue una estructura altamente modular dividida por áreas de responsabilidad y características (`features`):

```
code-insight-web/
src/
├── app/
│   ├── app.component.ts               # Layout principal
│   ├── app.config.ts                  # Configuración Standalone (HttpClient, Router)
│   ├── app.routes.ts                  # Rutas con lazy loading
│   │
│   ├── core/                          # Módulos centrales singleton
│   │   └── models/
│   │       └── api-error.model.ts     # Modelo de error REST
│   │
│   ├── shared/                        # Componentes y elementos reutilizables
│   │   └── components/
│   │       ├── header/                # Header con indicador de conexión
│   │       └── loader/                # Spinner asíncrono
│   │
│   └── features/                      # Arquitectura basada en características (Feature-Based)
│       └── code-analysis/             # Característica principal
│           ├── components/
│           │   ├── code-input/        # Formulario de entrada de código y selección de Strategy
│           │   ├── metrics-summary/   # Tarjetas de resumen de métricas
│           │   └── analysis-results/  # Detalle de recomendaciones
│           ├── facade/                # PATRÓN FACADE
│           │   └── code-analysis.facade.ts # Facade encapsulando Signals (report, loading, error)
│           ├── models/
│           │   ├── analysis-request.model.ts
│           │   └── analysis-response.model.ts
│           ├── services/
│           │   └── code-analysis-api.service.ts # Cliente HTTP REST
│           └── pages/
│               └── code-analysis-page/# Página contenedora principal
│
├── environments/
│   ├── environment.ts                 # Dev: http://localhost:8080/api/v1
│   └── environment.prod.ts
└── styles.css                         # Sistema de diseño global (Dark Mode, Glassmorphism)
```

---

## 💡 Patrón Facade Aplicado

El **Patrón Facade (`CodeAnalysisFacade`)** aísla a los componentes visuales de las llamadas de red y manejo de subscripciones RxJS:

- **Señales Expuestas (Angular Signals)**:
  - `facade.report()`: Contiene el resultado actual del análisis (`CodeAnalysisResponseDto`).
  - `facade.loading()`: Estado booleano de la llamada REST.
  - `facade.error()`: Mensaje de error de la API backend si ocurre alguna falla.
  - `facade.hasReport()`: Señal calculada (`computed`).
- **Acción Simplificada**:
  - `facade.analyzeCode(requestDto)`: Método único para desencadenar el análisis.

---

## 🔌 Comunicación REST con Backend

El cliente REST (`CodeAnalysisApiService`) consume los endpoints expuestos por la Arquitectura Hexagonal de `code-insight-api`:

- **Endpoint:** `POST http://localhost:8080/api/v1/analysis`
- **Request:**
  ```json
  {
    "projectKey": "code-insight-web-app",
    "sourceCode": "public class OrderService { ... }",
    "type": "JAVA"
  }
  ```

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
Abre tu navegador en `http://localhost:4200`

---

## 🧪 Pruebas y Compilación
```bash
npm run build
```
