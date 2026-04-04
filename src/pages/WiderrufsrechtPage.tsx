import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const WiderrufsrechtPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Widerrufsrecht" description="Widerrufsbelehrung für Verbraucher – 14 Tage Widerrufsrecht bei Barbato Electronics inkl. Muster-Widerrufsformular." canonical="/widerrufsrecht" />
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
            <RotateCcw className="h-10 w-10 text-primary-foreground" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">Widerrufsrecht</h1>
          </motion.div>
          <motion.p className="text-lg text-primary-foreground/80" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            Widerrufsbelehrung für Verbraucher
          </motion.p>
        </div>
      </div>

      <div className="container max-w-5xl py-12 md:py-16 space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-8 prose prose-sm max-w-none dark:prose-invert">

            <h2>Widerrufsbelehrung</h2>

            <h3>Widerrufsrecht</h3>
            <p>
              Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gründen diesen Vertrag
              zu widerrufen.
            </p>
            <p>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
              der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
            </p>
            <p className="pl-4 border-l-4 border-primary">
              Barbato Electronics<br />
              Petros Barbato Manousos<br />
              Ulrichstraße 29<br />
              73033 Göppingen<br />
              Deutschland<br />
              E-Mail: info@b-electronics.shop<br />
              Telefon: +49 176 22551230
            </p>
            <p>
              mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren
              Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte
              Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
              Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>

            <h3>Folgen des Widerrufs</h3>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
              einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass
              Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
              haben), unverzüglich und spätestens binnen <strong>vierzehn Tagen</strong> ab dem Tag zurückzuzahlen,
              an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
              werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p>
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den
              Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere
              Zeitpunkt ist.
            </p>
            <p>
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen <strong>vierzehn Tagen</strong> ab
              dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu
              übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p>
              <strong>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</strong>
            </p>
            <p>
              Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen
              zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang
              mit ihnen zurückzuführen ist.
            </p>

            <h2>Muster-Widerrufsformular</h2>
            <p className="text-muted-foreground italic">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
            </p>
            <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
              <p>
                An:<br />
                Barbato Electronics<br />
                Petros Barbato Manousos<br />
                Ulrichstraße 29<br />
                73033 Göppingen<br />
                E-Mail: info@b-electronics.shop
              </p>
              <p>
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
                Waren (*) / die Erbringung der folgenden Dienstleistung (*)
              </p>
              <ul>
                <li>Bestellt am (*) / erhalten am (*)</li>
                <li>Name des/der Verbraucher(s)</li>
                <li>Anschrift des/der Verbraucher(s)</li>
                <li>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</li>
                <li>Datum</li>
              </ul>
              <p className="text-xs text-muted-foreground">(*) Unzutreffendes streichen.</p>
            </div>

            <h2>Ausschluss des Widerrufsrechts</h2>
            <p>
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus Gründen des
              Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind und deren Versiegelung nach der
              Lieferung entfernt wurde.
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

export default WiderrufsrechtPage;
