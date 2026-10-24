import type { LegalDocument } from './types';

const ENTITY = 'Astra Insurance Agency LLC';
const EMAIL = 'astra@astrainsurance.cloud';
const PHONE = '+1 (682) 415-2301';

export const privacyNotice: LegalDocument = {
  title: 'Aviso de Privacidad',
  effectiveDate: '',
  sections: [
    {
      title: '1. Quién es responsable de tus datos',
      blocks: [
        {
          type: 'p',
          text: `${ENTITY} es responsable de los datos personales que recopila Yo te cuido. Correo de privacidad: ${EMAIL}. Teléfono: ${PHONE}.`,
        },
      ],
    },
    {
      title: '2. Qué datos recopilamos',
      blocks: [
        {
          type: 'rows',
          rows: [
            {
              title: 'Identificación y contacto',
              fields: [
                { label: 'Ejemplos', value: 'Nombre, apellido, correo, teléfono' },
                { label: 'Origen', value: 'Tú, al registrarte, o tu cuenta de Google si la usas' },
              ],
            },
            {
              title: 'Salud',
              fields: [
                {
                  label: 'Ejemplos',
                  value:
                    'Diagnóstico, medicamentos, antecedentes, mediciones de glucosa, consumo de agua, resultados de laboratorio',
                },
                { label: 'Origen', value: 'Tú, al usar el app' },
              ],
            },
            {
              title: 'Contacto de seguridad',
              fields: [
                { label: 'Ejemplos', value: 'Nombre y teléfono de la persona que tú indiques' },
                { label: 'Origen', value: 'Tú' },
              ],
            },
            {
              title: 'Seguro',
              fields: [
                { label: 'Ejemplos', value: 'Datos de tu póliza de salud' },
                { label: 'Origen', value: 'Tú o tu agente de seguros' },
              ],
            },
            {
              title: 'Uso y dispositivo',
              fields: [
                {
                  label: 'Ejemplos',
                  value: 'Fecha de acceso, modelo del celular, versión del app, zona horaria',
                },
                { label: 'Origen', value: 'El app, de forma automática' },
              ],
            },
          ],
        },
        {
          type: 'p',
          text: 'No vendemos tus datos. No usamos tus datos de salud para publicidad.',
        },
      ],
    },
    {
      title: '3. Para qué los usamos',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Crear y proteger tu cuenta.',
            'Mostrarte tu información, recordatorios y tu plan de cuidado.',
            'Darte seguimiento y acompañamiento, solo si autorizas el permiso de compartir tus datos de salud.',
            'Atender tus solicitudes y comunicarnos contigo sobre el servicio.',
            'Mejorar el app con datos agregados que no te identifican.',
            'Cumplir obligaciones legales.',
          ],
        },
      ],
    },
    {
      title: '4. Quién puede ver tus datos de salud',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Si autorizas el permiso: el personal asignado y autorizado por la compañía, solo para acompañarte.',
            'Si no lo autorizas: tus datos de salud quedan en tu cuenta y solo tú los ves en el app. Puedes usar el app igual.',
            'Proveedores de tecnología: empresas que alojan o procesan datos por encargo nuestro, con contratos que les impiden usarlos para otro fin.',
            'Autoridades: solo cuando la ley lo exija.',
          ],
        },
        {
          type: 'p',
          text: 'Puedes retirar el permiso cuando quieras. Retirarlo no borra lo que se haya hecho antes con tu autorización.',
        },
        {
          type: 'rows',
          rows: [
            {
              title: 'Amazon Web Services',
              fields: [
                { label: 'Para qué', value: 'Servidores, base de datos, inicio de sesión y envío de correos' },
                { label: 'Datos', value: 'Todos los datos del app' },
                { label: 'Dónde', value: 'EE. UU. (Ohio)' },
              ],
            },
            {
              title: 'OpenAI',
              fields: [
                { label: 'Para qué', value: 'Ayudar a nuestro equipo a crear y organizar tareas de seguimiento' },
                {
                  label: 'Datos',
                  value: 'Solo los necesarios para crear cada tarea. No se usan para entrenar sus modelos',
                },
                { label: 'Dónde', value: 'EE. UU.' },
              ],
            },
            {
              title: 'Google',
              fields: [
                { label: 'Para qué', value: 'Inicio de sesión con Google, si lo eliges' },
                { label: 'Datos', value: 'Nombre y correo' },
                { label: 'Dónde', value: 'EE. UU.' },
              ],
            },
            {
              title: 'Apple, Google y Expo',
              fields: [
                { label: 'Para qué', value: 'Notificaciones y recordatorios en tu celular' },
                { label: 'Datos', value: 'Identificador del dispositivo y texto de la notificación' },
                { label: 'Dónde', value: 'EE. UU.' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: '5. Transferencia a otros países',
      blocks: [
        {
          type: 'p',
          text: 'Tus datos se guardan en servidores en Estados Unidos. Parte del personal que te acompaña trabaja desde Colombia y puede consultar tus datos desde allá, con las mismas medidas de seguridad. Al autorizar el permiso aceptas esa consulta desde Colombia.',
        },
      ],
    },
    {
      title: '6. Cuánto tiempo los guardamos',
      blocks: [
        {
          type: 'p',
          text: 'Guardamos tus datos mientras tu cuenta esté activa. Si la cierras, los conservamos hasta 6 años con acceso restringido, para cumplir obligaciones legales y de seguros, y después los borramos o anonimizamos.',
        },
      ],
    },
    {
      title: '7. Cómo los protegemos',
      blocks: [
        {
          type: 'p',
          text: 'Cifrado en tránsito y en reposo, acceso solo para personal autorizado, registro de quién consulta los datos y revisión periódica de permisos. Si ocurre una violación de seguridad que afecte tus datos, te avisaremos como exige la ley.',
        },
      ],
    },
    {
      title: '8. Tus derechos',
      blocks: [
        { type: 'p', text: 'Puedes pedir en cualquier momento:' },
        {
          type: 'bullets',
          items: [
            'Ver qué datos tenemos de ti.',
            'Corregirlos.',
            'Borrarlos o cerrar tu cuenta.',
            'Recibir una copia.',
            'Retirar el permiso de compartir tus datos de salud.',
          ],
        },
        {
          type: 'p',
          text: `Escríbenos a ${EMAIL}. Respondemos en un máximo de 45 días. Según el estado donde vivas, puedes tener derechos adicionales; no te trataremos distinto por ejercerlos.`,
        },
      ],
    },
    {
      title: '9. Menores de edad',
      blocks: [
        {
          type: 'p',
          text: 'El app es solo para mayores de 18 años. No recopilamos a sabiendas datos de menores.',
        },
      ],
    },
    {
      title: '10. Cambios a este aviso',
      blocks: [
        {
          type: 'p',
          text: 'Si hacemos cambios importantes, te avisaremos en el app y te pediremos aceptarlos de nuevo antes de seguir.',
        },
      ],
    },
    {
      title: '11. Contacto',
      blocks: [{ type: 'p', text: `${ENTITY} · ${EMAIL} · ${PHONE}` }],
    },
  ],
};