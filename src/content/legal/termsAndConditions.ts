import type { LegalDocument } from './types';

const ENTITY = 'Astra Insurance Agency LLC';
const EMAIL = 'astra@astrainsurance.cloud';
const PHONE = '+1 (682) 415-2301';

export const termsAndConditions: LegalDocument = {
  title: 'Términos y Condiciones',
  effectiveDate: '',
  sections: [
    {
      title: '1. Qué es Yo te cuido',
      blocks: [
        {
          type: 'p',
          text: `Yo te cuido es un app gratuito de ${ENTITY} para clientes de seguros de salud. Te ayuda a registrar tus datos de salud, crear hábitos y recibir acompañamiento. Al crear tu cuenta aceptas estos términos y el Aviso de Privacidad.`,
        },
      ],
    },
    {
      title: '2. No es un servicio médico ni de emergencias',
      blocks: [
        {
          type: 'bullets',
          items: [
            'El app y el acompañamiento no reemplazan a tu médico. No dan diagnósticos ni recetan medicamentos.',
            'No cambies ni suspendas un tratamiento sin hablar con tu médico.',
            'En una emergencia llama al 911 o ve a la sala de emergencias más cercana. No uses el app ni el chat para emergencias.',
            'El acompañamiento funciona en el horario que se muestra en el app. Fuera de ese horario los mensajes se responden el siguiente día hábil.',
          ],
        },
      ],
    },
    {
      title: '3. Tu cuenta',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Debes tener 18 años o más.',
            'La información que registras debe ser verdadera.',
            'Eres responsable de cuidar tu contraseña. Si crees que alguien entró a tu cuenta, cambia la contraseña y avísanos.',
            'Puedes cerrar tu cuenta cuando quieras desde Perfil o escribiéndonos.',
          ],
        },
      ],
    },
    {
      title: '4. Uso permitido',
      blocks: [
        { type: 'p', text: 'No puedes usar el app para:' },
        {
          type: 'bullets',
          items: [
            'Registrar datos de otra persona sin su autorización.',
            'Intentar acceder a cuentas o sistemas que no son tuyos.',
            'Enviar contenido ofensivo, falso o ilegal.',
            'Copiar, modificar o revender el app.',
          ],
        },
      ],
    },
    {
      title: '5. Relación con tu seguro',
      blocks: [
        {
          type: 'p',
          text: 'Usar o no usar el app no cambia tu póliza, tu cobertura, tu prima ni tu elegibilidad. Lo que registras en el app no se comparte con la aseguradora para decidir sobre tu cobertura.',
        },
      ],
    },
    {
      title: '6. Propiedad intelectual',
      blocks: [
        {
          type: 'p',
          text: `El app, su diseño, textos e imágenes son de ${ENTITY} o de sus licenciantes. Tus datos siguen siendo tuyos.`,
        },
      ],
    },
    {
      title: '7. Disponibilidad y responsabilidad',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Trabajamos para que el app funcione siempre, pero puede tener interrupciones o errores.',
            'El contenido educativo es informativo y general.',
            'En la medida que lo permita la ley, no somos responsables por decisiones de salud tomadas solo con base en el app.',
          ],
        },
      ],
    },
    {
      title: '8. Suspensión o cierre',
      blocks: [
        {
          type: 'p',
          text: 'Podemos suspender una cuenta que incumpla estos términos. Podemos dejar de ofrecer el app avisándote con 30 días de anticipación y dándote la opción de descargar tus datos.',
        },
      ],
    },
    {
      title: '9. Cambios a estos términos',
      blocks: [
        {
          type: 'p',
          text: 'Si hacemos cambios importantes, te avisaremos en el app y te pediremos aceptarlos de nuevo.',
        },
      ],
    },
    {
      title: '10. Ley aplicable',
      blocks: [
        {
          type: 'p',
          text: 'Estos términos se rigen por las leyes del estado de Florida y las leyes federales de EE. UU. aplicables, sin perjuicio de los derechos que te dé la ley de tu estado.',
        },
      ],
    },
    {
      title: '11. Contacto',
      blocks: [{ type: 'p', text: `${ENTITY} · ${EMAIL} · ${PHONE}` }],
    },
  ],
};