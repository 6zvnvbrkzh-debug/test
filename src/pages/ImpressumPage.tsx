import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Phone, User, Clock, FileText, Shield, Link2, Copyright, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const infoCards = [
  {
    icon: Building2,
    title: "Unternehmen",
    content: (
      <p className="text-muted-foreground">
        Barbato Electronics<br />
        Musterstraße 123<br />
        12345 Musterstadt<br />
        Deutschland
      </p>
    ),
  },
  {
    icon: Phone,
    title: "Kontakt",
    content: (
      <div className="text-muted-foreground space-y-1">
        <p>
          Telefon:{" "}
          <a href="tel:+491234567890" className="text-primary hover:underline">
            +49 123 456 7890
          </a>
        </p>
        <p>
          E-Mail:{" "}
          <a href="mailto:info@barbato-electronics.de" className="text-primary hover:underline">
            info@barbato-electronics.de
          </a>
        </p>
      </div>
    ),
  },
  {
    icon: User,
    title: "Vertreten durch",
    content: (
      <p className="text-muted-foreground">
        Max Mustermann<br />
        Geschäftsführer
      </p>
    ),
  },
  {
    icon: Clock,
    title: "Sprechzeiten",
    content: (
      <div className="text-muted-foreground space-y-1">
        <p>Mo – Fr: 09:00 – 18:00 Uhr</p>
        <p>Sa: 10:00 – 14:00 Uhr</p>
        <p>So: Geschlossen</p>
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Umsatzsteuer-ID",
    content: (
      <p className="text-muted-foreground">
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
        DE 123 456 789
      </p>
    ),
  },
  {
    icon: Shield,
    title: "Verantwortlich für den Inhalt",
    content: (
      <p className="text-muted-foreground">
        Max Mustermann<br />
        Musterstraße 123<br />
        12345 Musterstadt
      </p>
    ),
  },
];

const ImpressumPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 py-16 md:py-24">
        <div className="container max-w-5xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link to="/">
              <Button variant="outline" className="mb-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </Link>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Impressum
          </motion.h1>
          <motion.p
            className="text-lg text-primary-foreground/80"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Angaben gemäß § 5 TMG
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl py-12 md:py-16 space-y-8">
        {/* Info Cards – 2×3 Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={fadeUp} custom={i} className="h-full">
                <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-6 h-full flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      {card.content}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Haftungsausschluss */}
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8">Haftungsausschluss</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-bold text-lg">Haftung für Inhalte</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                  und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                  gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                  übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
                  die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Link2 className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-bold text-lg">Haftung für Links</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
                  haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
                  der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                  verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                  Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Copyright className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-bold text-lg">Urheberrecht</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                  deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                  außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                  bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                  Gebrauch gestattet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpressumPage;