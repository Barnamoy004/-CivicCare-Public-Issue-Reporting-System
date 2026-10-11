"use client";

import { useEffect } from "react";
import { isInitialized, markInitialized, saveReport } from "@/lib/storage";
import { SAMPLE_REPORTS, getIdForSample } from "@/lib/sampleData";
import { Report } from "@/lib/types";

export default function DataInitializer() {
  useEffect(() => {
    if (!isInitialized()) {
      SAMPLE_REPORTS.forEach((sample, i) => {
        const report: Report = {
          ...sample,
          id: getIdForSample(i),
        };
        saveReport(report);
      });
      markInitialized();
    }
  }, []);

  return null;
}
