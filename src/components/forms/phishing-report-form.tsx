"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  phishingReportSchema,
  type PhishingReportInput,
} from "@/domain/validation/schemas";
import { submitPhishingReport } from "@/services/requests/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import type { Locale } from "@/config/site";
import { t } from "@/lib/i18n/dictionaries";
import { localDateTimeInputValue, toIsoTimestamp } from "@/lib/formatting";

export function PhishingReportForm({ locale }: { locale: Locale }) {
  const [resultId, setResultId] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhishingReportInput>({
    resolver: zodResolver(phishingReportSchema),
    defaultValues: {
      hasAttachment: "unknown",
      hasLink: "unknown",
      receivedTime: localDateTimeInputValue(),
      senderAddress: "suspicious@example.invalid",
    },
  });

  const fieldErrors = Object.values(errors)
    .map((e) => e?.message)
    .filter(Boolean) as string[];

  async function onSubmit(values: PhishingReportInput) {
    setServerErrors([]);
    // datetime-local values carry no zone; stamp the browser's zone before
    // the server stores it.
    const res = await submitPhishingReport({
      ...values,
      receivedTime: toIsoTimestamp(values.receivedTime),
    });
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
        <Label htmlFor="emailSubject">Email subject</Label>
        <Input id="emailSubject" {...register("emailSubject")} />
      </div>
      <div>
        <Label htmlFor="senderDisplayName">Sender display name</Label>
        <Input id="senderDisplayName" {...register("senderDisplayName")} />
      </div>
      <div>
        <Label htmlFor="senderAddress">Sender address</Label>
        <Input id="senderAddress" type="email" {...register("senderAddress")} />
      </div>
      <div>
        <Label htmlFor="receivedTime">Received time</Label>
        <Input id="receivedTime" type="datetime-local" {...register("receivedTime")} />
      </div>
      <div>
        <Label htmlFor="suspiciousReason">Suspicious reason</Label>
        <Textarea id="suspiciousReason" {...register("suspiciousReason")} />
      </div>
      <div>
        <Label htmlFor="hasAttachment">Attachment indicator</Label>
        <Select id="hasAttachment" {...register("hasAttachment")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unknown">Unknown</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="hasLink">Link indicator</Label>
        <Select id="hasLink" {...register("hasLink")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unknown">Unknown</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="additionalNotes">Additional notes</Label>
        <Textarea id="additionalNotes" {...register("additionalNotes")} />
      </div>
      <p className="text-xs text-slate-500">
        Real email upload/parsing is disabled. This is a dry-run demo submission.
      </p>
      <Button type="submit" disabled={isSubmitting}>
        {t(locale, "form.submit")}
      </Button>
    </form>
  );
}
