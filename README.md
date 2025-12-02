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

- Para el manejo de cache en react query, tendremos en cuenta:

  - las props `staleTime` & `gcTime` para definir el tiempo que los datos se consideran frescos y el tiempo que permanecen en cache antes de ser eliminados. (React query maneja esto internamiente con un tiempo estimado de 5 minutos por default)

  - Para prevenir doble request en pantallas navegables usando react query, contamos con varias props que nos ayudan a controlar el request (refetchOnWindowFocus, refetchOnMount, staleTime)

#### Diferencia entre Expo y RN CLI

- La principal diferencia a grandes rasgos es la agilidad de desarrollo. Expo al ser un framework (capa encima de React Native) ya incluye muchas tools que son útiles en cualquier app.
  En RN CLI tenemos que configurar todo manualmente, lo que nos da más flexibilidad pero requiere más tiempo, conocimiento y esfuerzo.

- Para ese tipo de App optaría por Expo ya que nos prevee APIs listas para integrar de una manera sencilla, teniendo en cuenta los depp link con expo son mucho más faciles de configurar y manejar (podemos hacer uso de links universales lo que permite una mejor experiencia de usuario). Y para automatizar los deploys expo cuenta con Expo EAS que facilita mucho el proceso.

#### Describe rendiemiento de una App RN

- Optar por librerias externas que están optimizadas para el renderizado de listas largas como lo son LegendList o FlashList.
- Para navegación usaría React Navigation
- Para imagenes hay una lib llamada react-native-fast-image que optimiza la carga y el cacheo de imagenes.
- Para el bundle usaría Hermes, cacheo de imagenes, module federation (como Re.Pack), fonts optimizadas.

#### Arquitectura y Backend

- Para la arquitectura de app optaría por scremming architecture, ya que nos permite tener una buena separación de responsabilidades y facilita el mantenimiento y escalabilidad de la app.

folder estructure:

```
src/
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
   profile/
   notifications/
   shared/
      ui/
      utils/
      hooks/
      api/
```

- Para CI/CD usando EAS, lo primero es hacer la configuracion de EAS en la nube y en el proyecto.
  Luego configurar los workflows de build y submit en el archivo eas.json, definiendo los perfiles de build (development, production) y las credenciales necesarias para cada plataforma (iOS y Android).
  Tambien configurar los workflows en github action para automatizar el proceso de build y deploy en cada push o pull request a la rama main o production.
