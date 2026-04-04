import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const AGBPage = () => {
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
            <FileText className="h-10 w-10 text-primary-foreground" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">Allgemeine Geschäftsbedingungen</h1>
          </motion.div>
          <motion.p className="text-lg text-primary-foreground/80" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            AGB der Barbato Electronics
          </motion.p>
        </div>
      </div>

      <div className="container max-w-5xl py-12 md:py-16 space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-8 prose prose-sm max-w-none dark:prose-invert">

            <h2>§ 1 Geltungsbereich</h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge, die zwischen
              Barbato Electronics, Petros Barbato Manousos, Ulrichstraße 29, 73033 Göppingen (nachfolgend „Verkäufer")
              und dem Kunden (nachfolgend „Käufer") über den Online-Shop unter b-electronics.shop geschlossen werden.
            </p>
            <p>
              (2) Maßgeblich ist die zum Zeitpunkt des Vertragsschlusses gültige Fassung der AGB.
            </p>
            <p>
              (3) Abweichende Bedingungen des Käufers werden nicht anerkannt, es sei denn, der Verkäufer stimmt ihrer
              Geltung ausdrücklich schriftlich zu.
            </p>

            <h2>§ 2 Vertragsschluss</h2>
            <p>
              (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine
              Aufforderung zur Bestellung dar (invitatio ad offerendum).
            </p>
            <p>
              (2) Durch das Absenden der Bestellung über den Button „Zahlungspflichtig bestellen" gibt der Käufer ein
              verbindliches Kaufangebot ab.
            </p>
            <p>
              (3) Der Vertrag kommt zustande, wenn der Verkäufer das Angebot durch eine Auftragsbestätigung per E-Mail
              oder durch Lieferung der Ware annimmt.
            </p>

            <h2>§ 3 Preise und Versandkosten</h2>
            <p>
              (1) Alle angegebenen Preise sind Endpreise. Aufgrund der Kleinunternehmerregelung gemäß § 19 UStG wird
              keine Umsatzsteuer erhoben und daher auch nicht ausgewiesen.
            </p>
            <p>
              (2) Zusätzlich zu den angegebenen Preisen können Versandkosten anfallen, die dem Käufer vor Abschluss
              der Bestellung deutlich mitgeteilt werden.
            </p>

            <h2>§ 4 Zahlung</h2>
            <p>
              (1) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Die angebotenen Zahlungsmethoden werden
              dem Käufer im Bestellvorgang angezeigt.
            </p>
            <p>
              (2) Der Kaufpreis ist sofort mit Vertragsschluss fällig.
            </p>

            <h2>§ 5 Lieferung</h2>
            <p>
              (1) Die Lieferzeit beträgt in der Regel 1–2 Werktage nach Zahlungseingang, sofern nicht anders angegeben.
            </p>
            <p>
              (2) Es wird ausschließlich innerhalb Deutschlands geliefert, sofern nicht anders vereinbart.
            </p>
            <p>
              (3) Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht bei
              Verbrauchern mit der Übergabe der Ware an den Käufer über.
            </p>

            <h2>§ 6 Eigentumsvorbehalt</h2>
            <p>
              Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.
            </p>

            <h2>§ 7 Gewährleistung / Mängelhaftung</h2>
            <p>
              (1) Es gelten die gesetzlichen Gewährleistungsrechte. Bei neuen Waren beträgt die Gewährleistungsfrist
              zwei Jahre ab Lieferung.
            </p>
            <p>
              (2) Ist der Käufer Verbraucher, kann er innerhalb der ersten 12 Monate nach Erhalt der Ware die
              Vermutung geltend machen, dass der Mangel bereits bei Übergabe vorhanden war (Beweislastumkehr).
            </p>

            <h2>§ 8 Haftung</h2>
            <p>
              (1) Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
            </p>
            <p>
              (2) Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung wesentlicher Vertragspflichten
              (Kardinalpflichten) und nur in Höhe des vorhersehbaren, vertragstypischen Schadens.
            </p>
            <p>
              (3) Die vorstehenden Haftungsbeschränkungen gelten nicht bei Verletzung von Leben, Körper oder
              Gesundheit sowie für Ansprüche nach dem Produkthaftungsgesetz.
            </p>

            <h2>§ 9 Widerrufsrecht</h2>
            <p>
              Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die Einzelheiten ergeben sich aus der{" "}
              <Link to="/widerrufsrecht" className="text-primary hover:underline">Widerrufsbelehrung</Link>.
            </p>

            <h2>§ 10 Datenschutz</h2>
            <p>
              Informationen zur Erhebung und Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <Link to="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
            </p>

            <h2>§ 11 Streitbeilegung</h2>
            <p>
              (1) Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>
            <p>
              (2) Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h2>§ 12 Schlussbestimmungen</h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p>
              (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird die Wirksamkeit der
              übrigen Bestimmungen dadurch nicht berührt.
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

export default AGBPage;
