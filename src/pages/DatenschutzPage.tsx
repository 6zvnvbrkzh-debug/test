import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const DatenschutzPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 py-16 md:py-24">
        <div className="container max-w-5xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link to="/">
              <Button variant="outline" className="mb-8 border-primary-foreground/30 text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </Link>
          </motion.div>
          <motion.div className="flex items-center justify-center gap-3 mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Shield className="h-10 w-10 text-primary-foreground" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">Datenschutzerklärung</h1>
          </motion.div>
          <motion.p className="text-lg text-primary-foreground/80" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            Informationen zum Schutz Ihrer personenbezogenen Daten
          </motion.p>
        </div>
      </div>

      <div className="container max-w-5xl py-12 md:py-16 space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-8 prose prose-sm max-w-none dark:prose-invert">

            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
              Barbato Electronics<br />
              Petros Barbato Manousos<br />
              Ulrichstraße 29<br />
              73033 Göppingen<br />
              Deutschland<br />
              E-Mail: info@b-electronics.shop<br />
              Telefon: +49 176 22551230
            </p>

            <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
            <h3>2.1 Beim Besuch der Website</h3>
            <p>
              Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch
              Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten
              Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten
              Löschung gespeichert:
            </p>
            <ul>
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name und URL der abgerufenen Datei</li>
              <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
              <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</li>
            </ul>
            <p>
              Die genannten Daten werden zu folgenden Zwecken verarbeitet:
            </p>
            <ul>
              <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
              <li>Gewährleistung einer komfortablen Nutzung unserer Website</li>
              <li>Auswertung der Systemsicherheit und -stabilität</li>
              <li>Zu weiteren administrativen Zwecken</li>
            </ul>
            <p>
              Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes
              Interesse folgt aus den oben aufgelisteten Zwecken zur Datenerhebung.
            </p>

            <h3>2.2 Bei Registrierung und Nutzung eines Kundenkontos</h3>
            <p>
              Sie haben die Möglichkeit, ein Kundenkonto bei uns anzulegen. Hierfür benötigen wir folgende Daten:
            </p>
            <ul>
              <li>E-Mail-Adresse</li>
              <li>Selbstgewähltes Passwort</li>
            </ul>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 S. 1 lit. b DSGVO zur Durchführung
              vorvertraglicher Maßnahmen und zur Vertragserfüllung.
            </p>

            <h3>2.3 Bei Bestellungen</h3>
            <p>
              Wenn Sie eine Bestellung in unserem Online-Shop aufgeben, erheben wir folgende Daten:
            </p>
            <ul>
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Lieferadresse</li>
              <li>Rechnungsadresse</li>
              <li>Zahlungsinformationen (werden von unserem Zahlungsdienstleister Stripe verarbeitet)</li>
            </ul>
            <p>
              Die Verarbeitung erfolgt zur Vertragserfüllung gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO.
            </p>

            <h2>3. Zahlungsabwicklung über Stripe</h2>
            <p>
              Für die Zahlungsabwicklung nutzen wir den Dienst Stripe (Stripe Payments Europe, Ltd., 1 Grand Canal Street
              Lower, Grand Canal Dock, Dublin, Irland). Bei der Bezahlung werden Ihre Zahlungsdaten direkt an Stripe
              übermittelt. Stripe verarbeitet Ihre Daten gemäß seiner eigenen Datenschutzrichtlinie:{" "}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://stripe.com/de/privacy
              </a>.
            </p>
            <p>
              Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO (Vertragserfüllung).
            </p>

            <h2>4. Hosting</h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf
              dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Der Einsatz des Hosters erfolgt
              zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b
              DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch
              einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h2>5. Ihre Rechte als betroffene Person</h2>
            <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
            <ul>
              <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
              <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
              <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
              <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
              <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
              <li><strong>Recht auf Widerspruch gegen die Verarbeitung</strong> (Art. 21 DSGVO)</li>
            </ul>
            <p>
              Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten durch uns zu beschweren.
            </p>

            <h2>6. Cookies</h2>
            <p>
              Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die Ihr Webbrowser auf Ihrem
              Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher und effektiver zu gestalten.
            </p>
            <p>
              Wir verwenden ausschließlich technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind
              (z. B. Session-Cookies für den Warenkorb und die Anmeldung). Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1
              S. 1 lit. f DSGVO.
            </p>

            <h2>7. Datensicherheit</h2>
            <p>
              Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung
              mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. Ob eine einzelne Seite
              unseres Internetauftrittes verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des
              Schüssel- beziehungsweise Schloss-Symbols in der unteren Statusleiste Ihres Browsers.
            </p>

            <h2>8. Aufbewahrungsdauer</h2>
            <p>
              Personenbezogene Daten, die uns über unsere Website mitgeteilt worden sind, werden nur so lange gespeichert,
              bis der Zweck erfüllt ist, zu dem sie uns anvertraut wurden. Soweit handels- und steuerrechtliche
              Aufbewahrungsfristen zu beachten sind, kann die Aufbewahrungsdauer zu bestimmten Daten bis zu 10 Jahre
              betragen.
            </p>

            <h2>9. Änderung dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen
              Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
              Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>

            <p className="text-muted-foreground mt-8">
              Stand: April 2026
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatenschutzPage;
