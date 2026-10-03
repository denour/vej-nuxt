<script setup lang="ts">
import PageHero from '~/components/common/PageHero.vue'
import LegalDocument from '~/components/legal/LegalDocument.vue'
import LegalSection from '~/components/legal/LegalSection.vue'
import { legal, formatLegalDate } from '~/utils/legal'

useSeoMeta({
  title: 'Aviso de privacidad — Vida en el Jardín',
  description: 'Aviso de Privacidad Integral de Vida en el Jardín: qué datos recabamos, para qué los usamos, con quién los compartimos y cómo ejercer tus derechos ARCO.',
})

const updated = formatLegalDate(legal.lastUpdated)

const sections = [
  { id: 'responsable', title: 'Identidad y domicilio del responsable' },
  { id: 'datos', title: 'Datos personales que recabamos' },
  { id: 'no-recabamos', title: 'Datos que no recabamos' },
  { id: 'finalidades', title: 'Para qué usamos tus datos' },
  { id: 'encargados', title: 'Encargados y transferencias' },
  { id: 'arco', title: 'Derechos ARCO' },
  { id: 'revocacion', title: 'Revocación del consentimiento y baja del newsletter' },
  { id: 'cookies', title: 'Cookies y tecnologías similares' },
  { id: 'menores', title: 'Menores de edad' },
  { id: 'cambios', title: 'Cambios a este aviso' },
]

const n = (id: string) => sections.findIndex(s => s.id === id) + 1
const title = (id: string) => sections.find(s => s.id === id)?.title ?? ''
const mailto = (subject: string) => `mailto:${legal.privacyEmail}?subject=${encodeURIComponent(subject)}`
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Legal"
      title="Aviso de"
      italic="privacidad."
      :description="`Qué datos tuyos tratamos, para qué y cómo puedes controlarlos. Aviso de Privacidad Integral conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Última actualización: ${updated}.`"
    />

    <LegalDocument :sections="sections" :updated="updated">
      <LegalSection id="responsable" :n="n('responsable')" :title="title('responsable')">
        <p>
          <strong>{{ legal.owner }}</strong>, quien opera el sitio <strong>{{ legal.site }}</strong>
          bajo el nombre “{{ legal.brand }}” (en adelante, “nosotros” o el “responsable”), con domicilio en
          <strong>{{ legal.address }}</strong>, es responsable del tratamiento de los datos personales que
          nos proporcionas, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares (LFPDPPP), publicada en el Diario Oficial de la Federación el 20 de marzo de 2025, y
          demás normativa aplicable.
        </p>
        <p>
          Para cualquier asunto relacionado con tus datos personales puedes escribirnos a
          <a :href="`mailto:${legal.privacyEmail}`">{{ legal.privacyEmail }}</a>.
        </p>
      </LegalSection>

      <LegalSection id="datos" :n="n('datos')" :title="title('datos')">
        <p>Solo recabamos los datos que tú nos das y los mínimos necesarios para que el sitio funcione:</p>
        <h3>Formulario de contacto</h3>
        <ul>
          <li>Nombre.</li>
          <li>Correo electrónico.</li>
          <li>Asunto y contenido del mensaje (lo que decidas contarnos).</li>
        </ul>
        <h3>Newsletter</h3>
        <ul>
          <li>Correo electrónico.</li>
        </ul>
        <h3>Datos técnicos de navegación</h3>
        <ul>
          <li>
            Dirección IP, tipo de navegador y dispositivo, páginas visitadas, fecha y hora de la visita.
            Estos datos se generan automáticamente en los registros (logs) de nuestros servidores y de
            nuestro proveedor de hosting.
          </li>
        </ul>
        <p>
          Te pedimos no incluir en tus mensajes información que no sea necesaria para atender tu consulta,
          en especial datos sensibles.
        </p>
      </LegalSection>

      <LegalSection id="no-recabamos" :n="n('no-recabamos')" :title="title('no-recabamos')">
        <p>
          <strong>No recabamos datos personales sensibles</strong> (como origen étnico, estado de salud,
          creencias religiosas, opiniones políticas, preferencia sexual o datos biométricos).
        </p>
        <p>
          <strong>Tampoco recabamos datos financieros ni patrimoniales</strong>: el sitio no vende productos
          ni procesa pagos. Si en el futuro abrimos la tienda, actualizaremos este aviso antes de pedirte
          cualquier dato de ese tipo.
        </p>
      </LegalSection>

      <LegalSection id="finalidades" :n="n('finalidades')" :title="title('finalidades')">
        <h3>Finalidades primarias (necesarias)</h3>
        <p>Son las que dan origen a nuestra relación contigo y sin las cuales no podríamos atenderte:</p>
        <ul>
          <li>Responder los mensajes que nos envías por el formulario de contacto o por correo.</li>
          <li>Enviarte el newsletter que solicitaste, cuando te suscribes.</li>
          <li>Operar el sitio, mantener su seguridad y prevenir abusos (por ejemplo, envíos automatizados o spam).</li>
        </ul>
        <h3>Finalidades secundarias (opcionales)</h3>
        <p>No son necesarias para atenderte, pero nos ayudan a mejorar:</p>
        <ul>
          <li>Elaborar estadísticas agregadas sobre el uso del sitio y del newsletter, que no te identifican individualmente.</li>
        </ul>
        <p>
          <strong>Si no quieres que usemos tus datos para finalidades secundarias</strong>, escríbenos a
          <a :href="mailto('Negativa a finalidades secundarias')">{{ legal.privacyEmail }}</a>
          con el asunto “Negativa a finalidades secundarias”, en cualquier momento. Tu negativa no afectará
          los servicios que nos pediste.
        </p>
      </LegalSection>

      <LegalSection id="encargados" :n="n('encargados')" :title="title('encargados')">
        <p>
          Para operar el sitio nos apoyamos en proveedores que tratan datos por cuenta nuestra y solo
          conforme a nuestras instrucciones (encargados). Comunicarles datos es una <strong>remisión</strong>,
          que conforme a la LFPDPPP no requiere tu consentimiento:
        </p>
        <ul>
          <li v-for="p in legal.processors" :key="p.name">
            <strong>{{ p.name }}</strong> — {{ p.purpose }} Ubicación: {{ p.location }}.
          </li>
        </ul>
        <p>
          <strong>No vendemos, rentamos ni transferimos tus datos personales a terceros</strong> para sus
          propios fines. Solo los comunicaríamos a una autoridad cuando una ley o una orden judicial nos lo
          exija, supuesto en el que tampoco se requiere tu consentimiento.
        </p>
      </LegalSection>

      <LegalSection id="arco" :n="n('arco')" :title="title('arco')">
        <p>
          Tienes derecho a <strong>Acceder</strong> a tus datos personales, <strong>Rectificarlos</strong> si
          son inexactos o están incompletos, <strong>Cancelarlos</strong> cuando consideres que no se requieren
          para las finalidades señaladas, y <strong>Oponerte</strong> a su tratamiento para fines específicos
          (derechos ARCO).
        </p>
        <h3>Cómo ejercerlos</h3>
        <p>
          Envía tu solicitud a
          <a :href="mailto('Solicitud de derechos ARCO')">{{ legal.privacyEmail }}</a>. Tu solicitud debe incluir:
        </p>
        <ul>
          <li>Tu nombre y un correo electrónico (u otro medio) para comunicarte la respuesta.</li>
          <li>
            Un documento que acredite tu identidad (o, en su caso, la identidad y representación legal de
            quien actúe en tu nombre).
          </li>
          <li>La descripción clara del derecho que quieres ejercer y de los datos a los que se refiere.</li>
          <li>Cualquier elemento que nos ayude a localizar tus datos (por ejemplo, el correo con el que te suscribiste).</li>
          <li>En caso de rectificación, las correcciones a realizar y, si aplica, documentación que las sustente.</li>
        </ul>
        <h3>Plazos</h3>
        <p>
          Te responderemos en un plazo máximo de <strong>20 días hábiles</strong> contados desde que recibamos
          tu solicitud. Si resulta procedente, la haremos efectiva dentro de los <strong>15 días hábiles</strong>
          siguientes a la fecha de nuestra respuesta. Estos plazos podrán ampliarse una sola vez por un
          periodo igual cuando lo justifiquen las circunstancias del caso, lo que te informaremos.
        </p>
        <p>
          El ejercicio de los derechos ARCO es gratuito. Si consideras que tu derecho no fue atendido,
          puedes acudir ante la autoridad competente en materia de protección de datos personales.
        </p>
      </LegalSection>

      <LegalSection id="revocacion" :n="n('revocacion')" :title="title('revocacion')">
        <p>
          Puedes <strong>revocar el consentimiento</strong> que nos diste para el tratamiento de tus datos en
          cualquier momento, escribiendo a
          <a :href="mailto('Revocación del consentimiento')">{{ legal.privacyEmail }}</a>
          con la misma información indicada para las solicitudes ARCO. Seguimos los mismos plazos de respuesta.
          Ten en cuenta que, en algunos casos, no podremos atender tu solicitud de inmediato si una obligación
          legal nos exige conservar ciertos datos.
        </p>
        <h3>Baja del newsletter</h3>
        <p>
          Darte de baja es sencillo: usa el enlace para cancelar la suscripción que aparece al final de cada
          correo, o escríbenos a
          <a :href="mailto('Baja del newsletter')">{{ legal.privacyEmail }}</a>.
          Dejarás de recibir el newsletter sin necesidad de dar explicaciones.
        </p>
      </LegalSection>

      <LegalSection id="cookies" :n="n('cookies')" :title="title('cookies')">
        <p>
          Las cookies son pequeños archivos que un sitio guarda en tu navegador. En {{ legal.site }}
          <strong>solo usamos cookies y tecnologías técnicas o estrictamente necesarias</strong> para que el
          sitio funcione y sea seguro (por ejemplo, para recordar el estado de la navegación o proteger los
          formularios contra abusos).
        </p>
        <ul>
          <li>No usamos cookies publicitarias.</li>
          <li>No usamos cookies ni píxeles de terceros para rastrearte o crear perfiles.</li>
        </ul>
        <p>
          Puedes bloquear o eliminar las cookies desde la configuración de tu navegador (normalmente en
          “Privacidad” o “Seguridad”). Si las desactivas, algunas funciones del sitio podrían no funcionar
          correctamente. Si en el futuro incorporamos otro tipo de cookies, actualizaremos este aviso y, cuando
          corresponda, te pediremos tu consentimiento.
        </p>
      </LegalSection>

      <LegalSection id="menores" :n="n('menores')" :title="title('menores')">
        <p>
          Este sitio no está dirigido a menores de edad y no recabamos intencionalmente sus datos personales.
          Si eres madre, padre o tutor y crees que un menor nos proporcionó datos, escríbenos a
          <a :href="`mailto:${legal.privacyEmail}`">{{ legal.privacyEmail }}</a> y los eliminaremos.
        </p>
      </LegalSection>

      <LegalSection id="cambios" :n="n('cambios')" :title="title('cambios')">
        <p>
          Podemos modificar este aviso de privacidad por cambios en la ley, en nuestros servicios (por ejemplo,
          la apertura de la tienda) o en nuestras prácticas. Cualquier cambio se publicará en esta misma página,
          <NuxtLink to="/privacidad">{{ legal.site }}/privacidad</NuxtLink>, indicando la fecha de la última
          actualización.
        </p>
        <p>
          <strong>Última actualización: {{ updated }}.</strong>
        </p>
      </LegalSection>
    </LegalDocument>
  </main>
</template>
