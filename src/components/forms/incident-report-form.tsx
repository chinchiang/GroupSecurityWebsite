"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  incidentReportSchema,
  type IncidentReportInput,
} from "@/domain/validation/schemas";
import { submitIncidentReport } from "@/services/requests/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import type { Locale } from "@/config/site";
import { t } from "@/lib/i18n/dictionaries";

export function IncidentReportForm({ locale }: { locale: Locale }) {
  const [resultId, setResultId] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IncidentReportInput>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      safetyImpact: "unknown",
      contactPreference: "email",
      urgency: "medium",
      submitAnonymouslyAcknowledged: true,
      observedAt: new Date().toISOString().slice(0, 16),
    },
  });

  const fieldErrors = Object.values(errors)
    .map((e) => e?.message)
    .filter(Boolean) as string[];

  async function onSubmit(values: IncidentReportInput) {
    setServerErrors([]);
    const res = await submitIncidentReport(values);
    if (!res.ok) {
      setServerErrors(res.errors);
      return;
    }
    setResultId(res.id);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-md border border-slate-200 bg-white p-4"
      noValidate
    >
      {(fieldErrors.length > 0 || serverErrors.length > 0) && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-900" role="alert">
          <p className="font-semibold">{t(locale, "form.errorSummary")}</p>
          <ul className="mt-1 list-disc pl-5">
            {[...fieldErrors, ...serverErrors].map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      {resultId ? (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-900" role="status">
          {t(locale, "form.success")}: {resultId}
        </div>
      ) : null}

      <div>
        <Label htmlFor="incidentType">Incident type</Label>
        <Input id="incidentType" {...register("incidentType")} />
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Input id="summary" {...register("summary")} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="affectedSystem">Affected system</Label>
        <Input id="affectedSystem" {...register("affectedSystem")} />
      </div>
      <div>
        <Label htmlFor="affectedSitePlant">Affected site / plant</Label>
        <Input id="affectedSitePlant" {...register("affectedSitePlant")} />
      </div>
      <div>
        <Label htmlFor="observedAt">Observed date / time</Label>
        <Input id="observedAt" type="datetime-local" {...register("observedAt")} />
      </div>
      <div>
        <Label htmlFor="businessImpact">Business impact</Label>
        <Textarea id="businessImpact" {...register("businessImpact")} />
      </div>
      <div>
        <Label htmlFor="safetyImpact">Safety impact</Label>
        <Select id="safetyImpact" {...register("safetyImpact")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unknown">Unknown</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="dataInvolved">Data involved</Label>
        <Input id="dataInvolved" {...register("dataInvolved")} />
      </div>
      <div>
        <Label>Attachment placeholder</Label>
        <p className="text-xs text-slate-500">
          Real attachments are not uploaded in this demo.
        </p>
      </div>
      <div>
        <Label htmlFor="contactPreference">Contact preference</Label>
        <Select id="contactPreference" {...register("contactPreference")}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="teams">Teams</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="urgency">Urgency</Label>
        <Select id="urgency" {...register("urgency")}>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register("submitAnonymouslyAcknowledged")} />
        <span>
          I understand anonymous submission is explained for UX only; this demo
          does not implement a true anonymous channel.
        </span>
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {t(locale, "form.submit")}
      </Button>
    </form>
  );
}
