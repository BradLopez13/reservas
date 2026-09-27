import { REPO_URL } from '../../../shared/components/Layout.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';

// Página estática: no tiene view-model.
export function PrivacidadScreen() {
  return (
    <Pagina titulo="Privacidad" entradilla="Qué datos guarda esta aplicación, para qué y durante cuánto tiempo.">
      <div className="texto">
        <h2>Qué se guarda</h2>
        <ul>
          <li><strong>Tu nombre y tu email</strong>, para identificar tu cuenta y mostrarte tus reservas.</li>
          <li><strong>Un hash de tu contraseña</strong> (Argon2id). La contraseña en sí no se guarda ni se puede recuperar.</li>
          <li><strong>Tus sesiones</strong>: un identificador aleatorio, guardado también como hash, con la fecha de creación y de último uso.</li>
          <li><strong>Tus reservas</strong>, incluidas las canceladas.</li>
          <li><strong>Los intentos de inicio de sesión fallidos</strong> por email y dirección IP, durante quince minutos, para limitar los ataques de fuerza bruta.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Solo hay una cookie, la de sesión. Es <code>httpOnly</code>, así que el JavaScript de la página no puede leerla, y caduca a los siete días sin uso o a los treinta desde que entraste.
          No hay cookies de análisis, de publicidad ni de terceros.
        </p>

        <h2>Terceros</h2>
        <p>
          La aplicación se sirve desde Vercel y la base de datos está en Supabase. Las fotografías se cargan desde Unsplash, que recibe la petición de imagen como cualquier otro servidor de imágenes.
          Ningún dato de tu cuenta se envía a ninguno de ellos más allá de lo necesario para servir la aplicación.
        </p>

        <h2>Durante cuánto tiempo</h2>
        <p>
          Es un proyecto de demostración. Los datos pueden borrarse en cualquier momento, sin aviso, al reiniciar la base de datos.
          Si quieres que se elimine tu cuenta antes, abre una incidencia en <a href={REPO_URL} target="_blank" rel="noreferrer">el repositorio de GitHub</a>.
        </p>
      </div>
    </Pagina>
  );
}
