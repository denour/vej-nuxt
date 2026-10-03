<script setup lang="ts">
import PageHero from '~/components/common/PageHero.vue'
import LegalDocument from '~/components/legal/LegalDocument.vue'
import LegalSection from '~/components/legal/LegalSection.vue'
import { legal, formatLegalDate } from '~/utils/legal'

useSeoMeta({
  title: 'Términos de uso — Vida en el Jardín',
  description: 'Términos de uso del sitio Vida en el Jardín: uso del contenido, alcance de los consejos de jardinería, enlaces, responsabilidad y ley aplicable.',
})

const updated = formatLegalDate(legal.lastUpdated)

const sections = [
  { id: 'aceptacion', title: 'Aceptación' },
  { id: 'contenido', title: 'Uso del contenido' },
  { id: 'informativo', title: 'Contenido informativo' },
  { id: 'toxicidad', title: 'Plantas tóxicas y mascotas' },
  { id: 'usuarios', title: 'Mensajes y comentarios de usuarios' },
  { id: 'terceros', title: 'Enlaces a sitios de terceros' },
  { id: 'tienda', title: 'Tienda' },
  { id: 'responsabilidad', title: 'Limitación de responsabilidad' },
  { id: 'ley', title: 'Ley aplicable y jurisdicción' },
  { id: 'cambios', title: 'Cambios a estos términos' },
  { id: 'contacto', title: 'Contacto' },
]

const n = (id: string) => sections.findIndex(s => s.id === id) + 1
const title = (id: string) => sections.find(s => s.id === id)?.title ?? ''
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Legal"
      title="Términos"
      italic="de uso."
      :description="`Las reglas del jardín: cómo puedes usar este sitio y su contenido. Última actualización: ${updated}.`"
    />

    <LegalDocument :sections="sections" :updated="updated">
      <LegalSection id="aceptacion" :n="n('aceptacion')" :title="title('aceptacion')">
        <p>
          Estos términos regulan el acceso y uso del sitio <strong>{{ legal.site }}</strong> (“{{ legal.brand }}”,
          “VEJ” o el “sitio”), operado por <strong>{{ legal.owner }}</strong>, con domicilio en
          <strong>{{ legal.address }}</strong>.
        </p>
        <p>
          Al navegar por el sitio o usar sus funciones aceptas estos términos. Si no estás de acuerdo con
          ellos, te pedimos no usar el sitio. El tratamiento de tus datos personales se rige por nuestro
          <NuxtLink to="/privacidad">Aviso de privacidad</NuxtLink>.
        </p>
      </LegalSection>

      <LegalSection id="contenido" :n="n('contenido')" :title="title('contenido')">
        <p>
          Los textos, fotografías, ilustraciones, fichas de especies, diseño, logotipos y demás contenido del
          sitio son propiedad de VEJ o se usan con autorización de sus titulares, y están protegidos por la
          legislación de propiedad intelectual e industrial.
        </p>
        <p>Nos encanta que compartas lo que te sirve. Puedes, sin pedirnos permiso:</p>
        <ul>
          <li>Compartir enlaces a cualquier página del sitio.</li>
          <li>Citar fragmentos breves, siempre que menciones a {{ legal.brand }} como fuente e incluyas un enlace a la página original.</li>
        </ul>
        <p>
          Cualquier otro uso —como reproducir artículos completos, copiar fotografías o usar el contenido con
          fines comerciales— requiere nuestra autorización previa por escrito.
        </p>
      </LegalSection>

      <LegalSection id="informativo" :n="n('informativo')" :title="title('informativo')">
        <p>
          Los consejos, guías y fichas de cuidado publicados en el sitio tienen un fin <strong>informativo y
          orientativo</strong>. Las plantas responden de forma distinta según el clima, la luz, el sustrato, el
          agua y muchos otros factores, por lo que <strong>no garantizamos resultados</strong> específicos.
        </p>
        <p>
          Procuramos que la información sea correcta y esté al día, pero puede contener errores u omisiones. Si
          encuentras alguno, te agradeceremos que nos lo cuentes.
        </p>
      </LegalSection>

      <LegalSection id="toxicidad" :n="n('toxicidad')" :title="title('toxicidad')">
        <p>
          Algunas plantas son tóxicas para personas o animales si se ingieren o manipulan. Aunque indicamos la
          toxicidad en nuestras fichas cuando la conocemos, esa información es orientativa y puede no ser
          exhaustiva.
        </p>
        <p>
          Si tienes niñas, niños o mascotas en casa, verifica cada especie con fuentes especializadas antes de
          tenerla a su alcance. Ante una posible intoxicación, <strong>acude de inmediato a un servicio médico o
          veterinario</strong>; el contenido del sitio no sustituye la atención profesional.
        </p>
      </LegalSection>

      <LegalSection id="usuarios" :n="n('usuarios')" :title="title('usuarios')">
        <p>
          Cuando nos envías un mensaje o, en su caso, publicas un comentario, te comprometes a que su contenido
          sea lícito, respetuoso y propio, y a no incluir spam, publicidad no solicitada, datos personales de
          terceros ni material que infrinja derechos de otras personas.
        </p>
        <p>
          Podemos no publicar, editar o eliminar contenido de usuarios que no cumpla con estos términos. Eres
          responsable del contenido que nos envías.
        </p>
      </LegalSection>

      <LegalSection id="terceros" :n="n('terceros')" :title="title('terceros')">
        <p>
          El sitio puede incluir enlaces a sitios de terceros como referencia o complemento. No controlamos esos
          sitios ni somos responsables de su contenido, disponibilidad o prácticas de privacidad. Te recomendamos
          revisar sus propios términos y avisos antes de usarlos.
        </p>
      </LegalSection>

      <LegalSection id="tienda" :n="n('tienda')" :title="title('tienda')">
        <p>
          <strong>Por ahora el sitio no vende productos</strong>: no aceptamos pedidos ni pagos, y no hacemos
          envíos ni devoluciones. La sección de tienda es una vista previa.
        </p>
        <p>
          Cuando abramos, publicaremos los términos de venta —incluyendo precios, formas de pago, envíos,
          devoluciones y garantías— antes de aceptar el primer pedido.
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" :n="n('responsabilidad')" :title="title('responsabilidad')">
        <p>
          El sitio se ofrece “tal cual” y según su disponibilidad. En la medida en que lo permita la ley
          aplicable, VEJ no será responsable de daños o perjuicios derivados de:
        </p>
        <ul>
          <li>La aplicación de los consejos o la información publicada en el sitio.</li>
          <li>Interrupciones, fallas técnicas, errores o virus que afecten el acceso al sitio.</li>
          <li>El contenido o funcionamiento de sitios de terceros enlazados.</li>
          <li>El uso del sitio contrario a estos términos o a la ley.</li>
        </ul>
        <p>Nada de lo anterior limita los derechos que la ley te reconoce y que no pueden renunciarse.</p>
      </LegalSection>

      <LegalSection id="ley" :n="n('ley')" :title="title('ley')">
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para su interpretación y
          cumplimiento, las partes se someten a la jurisdicción de los tribunales competentes de la Ciudad de
          México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio
          presente o futuro, salvo que la ley aplicable disponga otra cosa.
        </p>
      </LegalSection>

      <LegalSection id="cambios" :n="n('cambios')" :title="title('cambios')">
        <p>
          Podemos actualizar estos términos en cualquier momento. Publicaremos la versión vigente en esta página,
          <NuxtLink to="/terminos">{{ legal.site }}/terminos</NuxtLink>, con su fecha de última actualización. El
          uso del sitio después de un cambio implica que aceptas la nueva versión.
        </p>
        <p><strong>Última actualización: {{ updated }}.</strong></p>
      </LegalSection>

      <LegalSection id="contacto" :n="n('contacto')" :title="title('contacto')">
        <p>
          Si tienes dudas sobre estos términos, escríbenos a
          <a :href="`mailto:${legal.contactEmail}`">{{ legal.contactEmail }}</a>
          o desde nuestra <NuxtLink to="/contact">página de contacto</NuxtLink>. Para temas de datos personales,
          usa <a :href="`mailto:${legal.privacyEmail}`">{{ legal.privacyEmail }}</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  </main>
</template>
