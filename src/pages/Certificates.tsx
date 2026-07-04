import { AppLayout } from "@/components/AppLayout";
import { useCertificates } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye } from "lucide-react";

const Certificates = () => {
  const { data: certificates = [] } = useCertificates();

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Certificates</h1>
          <p className="mt-1 text-muted-foreground">Your earned credentials</p>
        </div>

        <div className="grid gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{cert.courseTitle}</h3>
                  <p className="text-sm text-muted-foreground">Completed {cert.completionDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> View</Button>
                <Button size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Certificates;
