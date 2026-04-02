import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad - CotizApp",
};

export default function PrivacidadPage() {
  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: "Política de Privacidad",
        showProfile: false,
        showNotifications: false,
        leftAction: (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">Legal</span>
          </div>
        )
      }}
    >
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
        
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Política de Privacidad</h1>
          <p className="text-muted-foreground">Última actualización: 2 de Abril de 2026</p>
        </div>

        <Card className="p-6 md:p-8 space-y-8 text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold border-b border-border/50 pb-2">1. Información que recopilamos</h2>
            <p>
              CotizApp recopila exclusivamente la información estrictamente necesaria para brindar sus servicios de creación y gestión de presupuestos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Datos de tu cuenta:</strong> Correo electrónico y nombre asociado a tu perfil.</li>
              <li><strong>Datos de tus clientes:</strong> Los nombres, correos electrónicos y teléfonos de los clientes que introduzcas voluntariamente para generar tus cotizaciones. CotizApp actúa como Procesador de esta información y tú como Controlador.</li>
              <li><strong>Datos de uso analítico:</strong> Direcciones IP de forma ofuscada (hasheada) sin asociarlas a identidades individuales con el fin de obtener métricas operativas de la plataforma.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold border-b border-border/50 pb-2">2. Uso de la información</h2>
            <p>
              Los datos recopilados son utilizados con los siguientes fines:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Identificarte de forma segura en la plataforma.</li>
              <li>Preservar tu historial de presupuestos y catálogo de clientes.</li>
              <li>Enviarte notificaciones esenciales de seguridad (ej: validación de cuenta).</li>
            </ul>
            <p className="text-primary font-medium bg-primary/10 p-3 rounded-lg border border-primary/20">
              Nunca venderemos, alquilaremos o compartiremos tus cotizaciones, tarifas o la base de datos de tus clientes con terceros para fines comerciales o de marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold border-b border-border/50 pb-2">3. Terceros e Infraestructura (Terceros Subencargados)</h2>
            <p>
              Para garantizar que CotizApp funcione las 24 horas de forma segura, nos apoyamos en infraestructuras de primer nivel que cumplen con las normativas GDPR, CCPA y SOC2. Tus datos son procesados a través de:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Supabase (AWS):</strong> Alojamiento de la base de datos cifrada y validación de usuarios.</li>
              <li><strong>Vercel Inc:</strong> Alojamiento estático de la web y métricas anónimas.</li>
              <li><strong>Resend:</strong> Plataforma para el envío de correos electrónicos transaccionales (Ej: verificación de cuenta).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold border-b border-border/50 pb-2">4. Almacenamiento y Eliminación (Derecho al Olvido)</h2>
            <p>
              Mantenemos tus datos hasta que tú decidas lo contrario. En cualquier momento puedes solicitar o ejecutar la eliminación total y definitiva de tu cuenta desde la sección correspondiente en tu panel de control (Perfil). Al eliminar tu cuenta, todos tus presupuestos, configuraciones y datos de clientes asociados son <strong>eliminados en cascada e irrevocablemente de nuestra base de datos.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold border-b border-border/50 pb-2">5. Uso de Cookies</h2>
            <p>
              En cumplimento normativo, CotizApp utiliza únicamente:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Cookies Estrictamente Necesarias:</strong> Para la persistencia de sesión segura de tu cuenta. No requieren de consentimiento activo ya que sin ellas la plataforma no funciona.</li>
              <li><strong>Métricas Anónimas:</strong> No utilizamos rastreadores publicitarios (como el píxel de Meta o Google Ads) que recopilen información para perfiles publicitarios.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 text-sm text-muted-foreground">
            <p>
              Si tienes preguntas o inquietudes adicionales sobre cómo manejamos tus datos, ponte en contacto con el desarrollador o propietario del portal.
            </p>
          </section>

        </Card>
      </div>
    </PageWrapper>
  );
}
