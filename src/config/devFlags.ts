// ⚠️ BANDERAS DE PRUEBA — revisar antes de publicar en tiendas.

// true  → en cada inicio de sesión el registro inicial empieza desde cero
//         (se borran las respuestas anteriores y se va al consentimiento).
// false → comportamiento de producción: si ya aceptó, entra directo al inicio.
// PRODUCCIÓN: cambiar a false.
export const RESTART_ONBOARDING_ON_LOGIN = true;