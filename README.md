## Sección 1 - Preguntas Teóricas

#### React y React Native

- useEffect

Un de los hooks principales en React ya que representa el ciclo de vida de un componente funcional. Permite ejecutar efectos secundarios como llamadas a APIs, subscripciones a eventos e incluso manipular el DOM después del renderizado del componente.

- useMemo

Hook utilizado para memorizar valores costosamente computados (memoization). Recibe un array de dependencias para indicar en que momentos debe recalcular el valor memorizado.

- useCallback ->

Hook usado para cachear funciones, evitando su recreación en cada renderizado del componente. Teniendo en cuenta que no cambien sus dependencias.

#### Casos de uso

- useEffect

* Usamos este hook para hacer tracking de eventos de usuario en nuestra app, como clicks o navegación entre pantallas. útil para análisis y mejora de UX

- useMemo

* Usamos este hook para optimizar el rendimiento en un app con buscador, filtros, ordenamientos.

- useCallback

* Usamos este hook para evitar re-render innecesarios en componentes hijos que reciben funciones como props, mejorando el rendimiento de la app.

#### Explica cómo manejarias

1 Para el manejo de cache en react query, tendremos en cuenta:

- las props `staleTime` & `gcTime` para definir el tiempo que los datos se consideran frescos y el tiempo que permanecen en cache antes de ser eliminados. (React query maneja esto internamiente con un tiempo estimado de 5 minutos por default)

- invalidateQuery que es una utilidad para refrescar la data en caso de que se apliquen actualizaciones optimistas o cualquier update a algun servicio

2 Para sincronizar las operaciones offline -> online, optaria por local-first con algun servicio externos que me permita mantener la sincrona de la data y evitar conflictos entre actualizaciones. Seguido de eso, solo es generar una utilidad para hacer POST al backend

3 Para prevenir doble request en pantallas navegables usando react query, contamos con varias props que nos ayudan a controlar el request (refetchOnWindowFocus, refetchOnMount, staleTime). Incluso react-query nos ayuda a prevenir eso ya que en lo posible siempre va primero a la caché.

#### Diferencia entre Expo y RN CLI

1 La principal diferencia a grandes rasgos es la agilidad de desarrollo. Expo al ser un framework (capa encima de React Native) ya incluye muchas tools que son útiles en cualquier app.
En RN CLI tenemos que configurar todo manualmente, lo que nos da más flexibilidad pero requiere más tiempo, conocimiento y esfuerzo.

2 Para ese tipo de App optaría por Expo ya que nos prevee APIs listas para integrar de una manera sencilla, teniendo en cuenta los depp link con expo son mucho más faciles de configurar y manejar (podemos hacer uso de links universales lo que permite una mejor experiencia de usuario). Y para automatizar los deploys expo cuenta con Expo EAS que facilita mucho el proceso.

### Ejercios Punto 2

Su realiación los encontrará en el folder `Exercises`

#### Describe rendiemiento de una App RN

- Optar por librerias externas que están optimizadas para el renderizado de listas largas como lo son LegendList o FlashList.
- Para navegación usaría React Navigation
- Para imagenes hay una lib llamada react-native-fast-image que optimiza la carga y el cacheo de imagenes.
- Para el bundle usaría Hermes, cacheo de imagenes, module federation (como Re.Pack), fonts optimizadas.

#### Manejo de estado global

Para esta prueba usé Zustand, ya que es una lib de estado global muy facil de usar, de implementar. Tambien incluye middlewares para peristencia en local

#### Arquitectura y Backend

- Para la app mobile optaria por seguir TDD + HEX, lo que nos facilita la escalabilidad de desarrollo y logica de negocio separada de la UI
- Para backend optaria por DDD ya que asi nos aseguramos de separar completamente la logica de negocio con implementacion (aderirse al framwork, a bd, entre otros)
- Para el manejo offline optaria por un servicio externos que me permita sincronizar/evitar conflictos con acciones offline, lo que facilitaria la integracion con backend
- Varia mucho segun la necesidad, optaria por implementar JWT como media de autenticacion e integracion con backend (se puede agregar una capa extra de seguridad llamada 'Signature')

folder estructure:

```
src/
   app
   modules/
      auth/
         screens/
         components/
         hooks/
         services/
         models/
      shopping/
         screens/
         components/
         hooks/
         services/
         models/
   utils/
   shared/
      ui/
      utils/
      hooks/
      api/
      services/
```

- Para CI/CD usando EAS, lo primero es hacer la configuracion de EAS en la nube y en el proyecto.
  Luego configurar los workflows de build y submit en el archivo eas.json, definiendo los perfiles de build (development, production) y las credenciales necesarias para cada plataforma (iOS y Android).
  Tambien configurar los workflows en github action para automatizar el proceso de build y deploy en cada push o pull request a la rama main o production.

#### Uso de una funcionalidad nativa

Elegi `Notificaciones locales` ya que es una manera sencilla de brindar retro-alimentacion al usuario de cualquier accion la cual genera una buena UX

## **Requisitos del Sistema**

Tengase en cuenta que este proyecto esta realizado con Expo, por lo que debe tener instalado en su maquina los siguientes programas

- **Node.js**: v22 o superior.
- **Expo CLI**: Instalado globalmente.
- **Android Studio**: Para emulación y compilación en Android.
- **Xcode**: Para emulación y compilación en iOS.

## **Decisiones Arquitectónicas**

- **Expo** : Se eligió Expo como framework principal para el desarrollo de la aplicación debido a su facilidad de uso, amplia gama de herramientas integradas y soporte para múltiples plataformas, lo que acelera el proceso de desarrollo y despliegue.
- **Expo Router**: Se utilizó Expo Router para gestionar la navegación en vista de que es la predetermianda para las nuevas versiones y a futuro es la que recibirá más soporte y desarrollo por parte del equipo de Expo.
- **Zustand**: Libreria para el manejo de estado global, se optó por esta librería debido a su simplicidad y facilidad de uso en comparación con Redux, especialmente para aplicaciones pequeñas y medianas.
- **React Query**: Se eligió React Query para la gestión de datos remotos debido a su capacidad para manejar el almacenamiento en caché, la sincronización de datos y las actualizaciones automáticas, lo que simplifica significativamente la lógica de manejo de datos en comparación con otras soluciones como Redux.
- **Navegación con Expo Router**: Se utilizó Expo Router para gestionar la navegación en vista de que es la predetermianda para las nuevas versiones y a futuro es la que recibirá más soporte y desarrollo por parte del equipo de Expo.
- **Notificaciones Locales**: Se implementaron notificaciones locales para mejorar la experiencia del usuario, proporcionando retroalimentación inmediata sobre las acciones realizadas dentro de la aplicación.
- **Persistencia con AsyncStorage**: Se utilizó AsyncStorage para la persistencia de datos local, permitiendo que la aplicación funcione sin conexión y sincronice los datos cuando se restablece la conexión.

## **Instalación**

1. Clona el repositorio:

   ```bash
   git clone git@github.com:ETBGM03/task-sync-app.git || https://github.com/ETBGM03/task-sync-app.git
   ```

   ```bash
   cd task-sync-app
   ```

2. Instala las dependencias:

   ```bash
   yarn install
   ```

3. Configura las variables de entorno:

   - Crea un archivo `.env` en la raíz del proyecto.
   - Agrega las variable:

     ```
      EXPO_PUBLIC_APP_API_URL_DOMAIN="http://localhost:3001/api
     ```

4. Inicia la aplicación:

   ```bash
   npx expo start --clear
   ```

   - Para iOS: presiona `i` sobre la terminal
   - Para Android: presiona `a` sobre la terminal

## **Instalación Backedn**

Este proyecto corre tambien con una API externa corriendo localmente, lo que permite simular el ciclo completo de una app real.
Para ejecutarlo debe seguir estas instrucciones

1. Clona el repositorio:

   ```bash
   git clone git@github.com:ETBGM03/task-sync-app.git || https://github.com/ETBGM03/task-sync-app.git
   ```

   ```bash
   cd task-sync-app
   ```

2. Instala las dependencias:

   ```bash
   yarn install
   ```

3. Ejecuta el servidor

```bash
   yarn start
```

## **Pruebas Unitarias**

El proyecto incluye pruebas unitarias para garantizar la calidad y el correcto funcionamiento de los componentes. Se utiliza **Jest** como framework principal para las pruebas. También se implementó **React Native Testing Library**

Las pruebas unitarias siguen la convención de nombrar los archivos de prueba con la extensión `.test.ts` o `.test.tsx`.

## **Arquitectura del Proyecto**

Se implementa sugerencia oficial por parte de Expo [link doc](https://expo.dev/blog/expo-app-folder-structure-best-practices) seguir con la estrucutura base del boilertplate.

```
task-sync/
├── 📱 app/                          # Expo Router - Navegación y pantallas
│   ├── _layout.tsx                  # Layout principal de la app
│   └── (tabs)/                      # Navegación por tabs
│       │   ├── _layout.tsx          # Layout de Tabs
│       │   ├── index.tsx            # Vista principal de TaskSync
│       ├──layout.tsx                # Layout principal de la app
│
├── 🔧 api/                          # Configuración de API
│   └── api-client.ts                # Cliente HTTP configurado
│
├── 🎨 components/                   # Componentes reutilizables
│   ├── ui/                          # Componentes de interfaz
│   │   ├── card-task.tsx           # Tarjeta de película
│   │   ├── icon-symbol.tsx          # Iconos del sistema
│   │   └── icon-symbol.ios.tsx      # Iconos específicos de iOS
│   └── haptic-tab.tsx               # Tab con feedback háptico
│
├── 🎯 constants/                    # Constantes de la aplicación
│   └── theme.ts                     # Configuración de temas y colores
│
├── 🪝 hooks/                        # Hooks personalizados
│   ├── use-color-scheme.ts          # Hook para tema claro/oscuro
│   └── use-theme-color.ts           # Hook para colores del tema
│
├── 🗄️ store/                        # Estado global (Zustand)
│   └── task-store.ts               # Store para favoritos y películas
│
├── 📝 types/                        # Definiciones de TypeScript
│   ├── task.ts                     # Tipos relacionados con las task
│
├── 🖼️ assets/                       # Recursos estáticos
│   └── images/                      # Imágenes e iconos
│       ├── icon.png                 # Icono de la app
│       ├── splash-icon.png          # Icono de splash screen
│       └── ...                      # Otros recursos gráficos
│
├── 📱 ios/                          # Configuración específica de iOS
│   └── task-sync-app/              # Proyecto Xcode
│
├── 📋 Configuración
│   ├── app.json                     # Configuración de Expo
│   ├── package.json                 # Dependencias y scripts
│   ├── tsconfig.json                # Configuración de TypeScript
│   └── eslint.config.js             # Configuración de ESLint
│
└── 📖 Documentación
    ├── README.md                    # Documentación del proyecto
```

## **Mejoras Futuras**

- Implementar autenticación de usuarios.
- Añadir notificaciones push.
- Implementar un servicio externo que permita la sincronización de datos offline/online. Siguiendo la estrategia local-first.
- Incluir DarkMode para mejora de UX.
- Aplicar liquidGlassm en las pantallas principales para añadir una mejora la estética de la app.
- Implementacion de poder compartir listas entre usuarios. O invitar a otros usuarios a colaborar en una misma lista.
- Aplicar testing E2E con Maestro
