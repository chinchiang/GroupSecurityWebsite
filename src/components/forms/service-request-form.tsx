"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/domain/validation/schemas";
import { submitServiceRequest } from "@/services/requests/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n/dictionaries";

export function ServiceRequestForm({ locale }: { locale: Locale }) {
  const [resultId, setResultId] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      dataClassification: "internal",
      legalEntity: siteConfig.organization.legalEntities[0],
      site: siteConfig.organization.sites[0],
      requestedDate: "2026-08-01",
      requiredCompletionDate: "2026-08-15",
      approver: "Demo Security Manager",
      contact: "demo.requester@example.invalid",
    },
  });

  const fieldErrors = Object.values(errors)
    .map((e) => e?.message)
    .filter(Boolean) as string[];

  async function onSubmit(values: ServiceRequestInput) {
    setServerErrors([]);
    const res = await submitServiceRequest(values);
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
        <Label htmlFor="serviceType">Service type</Label>
        <Input id="serviceType" {...register("serviceType")} />
      </div>
      <div>
        <Label htmlFor="businessJustification">Business justification</Label>
        <Textarea id="businessJustification" {...register("businessJustification")} />
      </div>
      <div>
        <Label htmlFor="legalEntity">Legal entity</Label>
        <Select id="legalEntity" {...register("legalEntity")}>
          {siteConfig.organization.legalEntities.map((le) => (
            <option key={le} value={le}>
              {le}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="site">Site</Label>
        <Select id="site" {...register("site")}>
          {siteConfig.organization.sites.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="projectSystem">Project / system</Label>
        <Input id="projectSystem" {...register("projectSystem")} />
      </div>
      <div>
        <Label htmlFor="dataClassification">Data classification</Label>
        <Select id="dataClassification" {...register("dataClassification")}>
          <option value="internal">internal</option>
          <option value="confidential">confidential</option>
          <option value="restricted">restricted</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="requestedDate">Requested date</Label>
        <Input id="requestedDate" type="date" {...register("requestedDate")} />
      </div>
      <div>
        <Label htmlFor="requiredCompletionDate">Required completion date</Label>
        <Input
          id="requiredCompletionDate"
          type="date"
          {...register("requiredCompletionDate")}
        />
      </div>
      <div>
        <Label>Attachment placeholder</Label>
        <p className="text-xs text-slate-500">No real uploads in demo mode.</p>
      </div>
      <div>
        <Label htmlFor="approver">Approver</Label>
        <Input id="approver" {...register("approver")} />
      </div>
      <div>
        <Label htmlFor="contact">Contact</Label>
        <Input id="contact" {...register("contact")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {t(locale, "form.submit")}
      </Button>
    </form>
  );
}
