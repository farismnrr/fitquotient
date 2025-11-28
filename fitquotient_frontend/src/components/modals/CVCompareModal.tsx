"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getApiKeys, { LLMKey } from "@/lib/api/dashboard/llm/getApiKeys";
import getLlmModels from "@/lib/api/dashboard/llm/getLlmModels";
import { Select } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { getAllJobs } from "@/lib/api/dashboard/jobs/getAllJobs";
import { getUserCvs } from "@/lib/api/dashboard/cv/getUserCvs";
import { handleApiCall } from "@/lib/api-handler";
import evaluateJob from "@/lib/api/dashboard/jobs/evaluateJob";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { RawJob } from "@/lib/api/dashboard/jobs/getAllJobs";
import type { RawCV } from "@/lib/api/dashboard/cv/getUserCvs";

export default function CVCompareModal({ compact }: { compact?: boolean }) {
  const accessToken = useAuthStore((s) => s.getAccessToken());
  const [jobs, setJobs] = useState<RawJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<LLMKey[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [apiKeysError, setApiKeysError] = useState<string | null>(null);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);

  const [llmModels, setLlmModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [cvs, setCvs] = useState<RawCV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [cvsLoading, setCvsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [cvsError, setCvsError] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadJobs() {
      setJobsLoading(true);
      setJobsError(null);
      const res = await handleApiCall(() => getAllJobs(), {
        onSuccess: (data) => {
          if (!mounted) return;
          setJobs(data?.jobs || []);
          // Select the first job if none selected
          if (!selectedJobId && (data?.jobs?.length || 0)) {
            setSelectedJobId(data!.jobs[0].id);
          }
        },
        onError: (msg) => {
          setJobs([]);
          setJobsError(msg);
        },
        showSuccessToast: false,
      });
      if (!mounted) return;
      if (!res.success) setJobsError(res.message || "Failed to load jobs");
      setJobsLoading(false);
    }

    async function loadCvs() {
      setCvsLoading(true);
      setCvsError(null);
      const res = await handleApiCall(() => getUserCvs(), {
        onSuccess: (data) => {
          if (!mounted) return;
          setCvs(data?.cvs || []);
          if (!selectedCvId && (data?.cvs?.length || 0)) {
            setSelectedCvId(data!.cvs[0].id);
          }
        },
        onError: (msg) => {
          setCvs([]);
          setCvsError(msg);
        },
        showSuccessToast: false,
      });
      if (!mounted) return;
      if (!res.success) setCvsError(res.message || "Failed to load cvs");
      setCvsLoading(false);
    }

    async function loadApiKeys() {
      setApiKeysLoading(true);
      setApiKeysError(null);
      const res = await handleApiCall(() => getApiKeys(), {
        onSuccess: (data) => {
          if (!mounted) return;
          const keys = data?.api_keys || [];
          setApiKeys(keys);
          if (!selectedApiKeyId && keys.length) {
            setSelectedApiKeyId(keys[0].id);
          }
        },
        onError: (msg) => {
          setApiKeys([]);
          setApiKeysError(msg);
        },
        showSuccessToast: false,
      });
      if (!mounted) return;
      if (!res.success)
        setApiKeysError(res.message || "Failed to load API keys");
      setApiKeysLoading(false);
    }

    async function init() {
      if (accessToken) {
        await Promise.all([loadJobs(), loadCvs(), loadApiKeys()]);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [accessToken, selectedJobId, selectedCvId, selectedApiKeyId]);

  // When selected API key changes, fetch models for it (separate effect)
  useEffect(() => {
    let mounted = true;
    async function loadModelsForKey(keyId: string) {
      setModelsLoading(true);
      setModelsError(null);
      const res = await handleApiCall(() => getLlmModels(keyId), {
        onSuccess: (data) => {
          if (!mounted) return;
          const models = data?.models || [];
          setLlmModels(models);
          // Automatically select the first model if none is selected or if the previously selected model is no longer available
          if (models.length && (!selectedModel || !models.includes(selectedModel))) {
            setSelectedModel(models[0]);
          } else if (!models.length) {
            setSelectedModel(null);
          }
        },
        onError: (msg) => {
          setLlmModels([]);
          setModelsError(msg);
          setSelectedModel(null); // Clear selected model on error
        },
        showSuccessToast: false,
      });
      if (!mounted) return;
      if (!res.success) setModelsError(res.message || "Failed to load models");
      setModelsLoading(false);
    }

    async function init() {
      if (selectedApiKeyId) {
        await loadModelsForKey(selectedApiKeyId);
      } else {
        setLlmModels([]);
        setSelectedModel(null);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [selectedApiKeyId, selectedModel]);
  const router = useRouter();

  const providerForSelectedKey = selectedApiKeyId
    ? apiKeys.find((k) => k.id === selectedApiKeyId)?.provider
    : undefined;

  async function handleEvaluateClick() {
    if (
      !selectedJobId ||
      !selectedApiKeyId ||
      !selectedCvId ||
      !selectedModel
    ) {
      toast.error(
        "Please select Job, API key, Candidate CV and Model before evaluating"
      );
      return;
    }
    const provider = String(providerForSelectedKey || "GOOGLE").toUpperCase();
    setEvaluating(true);
    const res = await handleApiCall(
      () =>
        evaluateJob({
          job_id: selectedJobId,
          api_key_id: selectedApiKeyId,
          user_cv_id: selectedCvId,
          model: selectedModel,
          provider,
        }),
      {
        onSuccess: (data) => {
          if (typeof window !== "undefined") {
            const jobTitle = jobs.find((j) => j.id === selectedJobId)?.title;
            const cvName =
              cvs.find((c) => c.id === selectedCvId)?.name ||
              cvs.find((c) => c.id === selectedCvId)?.filename ||
              selectedCvId;
            const newComparison = {
              comparison_id: data?.id,
              status: data?.status,
              job_title: jobTitle,
              cv_name: cvName,
            };
            window.dispatchEvent(
              new CustomEvent("job:comparison:created", {
                detail: { comparison: newComparison },
              })
            );
          }
          // redirect back to Job details page (overview)
          if (selectedJobId) router.push(`/dashboard`);
        },
      }
    );
    setEvaluating(false);
    return res;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="sm">
            Compare candidates
          </Button>
        ) : (
          <Button variant="ghost">Compare candidates</Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-border">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Compare candidates</DialogTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Select a job, API key, candidate CV, and model to run a
                comprehensive, data-driven comparison and evaluation.
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="h-[min(80vh,720px)] w-full">
          <div className="h-full flex flex-col">
            <div className="dialog-scroll px-6 py-4 space-y-4 overflow-y-auto text-sm text-muted-foreground">
              <div className="flex flex-col gap-4">
                <section>
                  <h4 className="font-semibold mb-2">All Jobs</h4>
                  <Select
                    options={jobs.map((job) => ({
                      value: job.id,
                      label: job.title,
                    }))}
                    value={selectedJobId}
                    onChange={(v) => setSelectedJobId(v)}
                    placeholder={jobsLoading ? "Loading…" : "Select job"}
                    disabled={jobsLoading}
                  />
                  {jobsError && (
                    <div className="text-sm text-destructive mt-1">
                      {jobsError}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="font-semibold mb-2">API Keys</h4>
                  <Select
                    options={apiKeys.map((k) => ({
                      value: k.id,
                      label: k.name || k.id,
                    }))}
                    value={selectedApiKeyId || null}
                    onChange={(v) => setSelectedApiKeyId(v)}
                    placeholder={apiKeysLoading ? "Loading…" : "Select API key"}
                    disabled={apiKeysLoading || !accessToken}
                  />
                  {apiKeysError && (
                    <div className="text-sm text-destructive mt-1">
                      {apiKeysError}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="font-semibold mb-2">Candidate CV</h4>
                  <Select
                    options={cvs.map((cv) => ({
                      value: cv.id,
                      label: cv.name || cv.filename || cv.id,
                    }))}
                    value={selectedCvId}
                    onChange={(v) => setSelectedCvId(v)}
                    placeholder={
                      cvsLoading ? "Loading…" : "Select candidate CV"
                    }
                    disabled={cvsLoading}
                  />
                  {cvsError && (
                    <div className="text-sm text-destructive mt-1">
                      {cvsError}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="font-semibold mb-2">Model</h4>
                  <Select
                    options={llmModels.map((m) => ({ value: m, label: m }))}
                    value={selectedModel || null}
                    onChange={(v) => setSelectedModel(v)}
                    placeholder={modelsLoading ? "Loading…" : "Select model"}
                    disabled={!selectedApiKeyId || modelsLoading}
                  />
                  {modelsError && (
                    <div className="text-sm text-destructive mt-1">
                      {modelsError}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="font-semibold mb-2">Provider</h4>
                  {/* Render provider as plain disabled text rather than a list */}
                  <div
                    role="text"
                    aria-disabled="true"
                    className="rounded border px-2 py-1 w-full bg-muted/50 text-muted-foreground"
                  >
                    {(() => {
                      const provider = apiKeys.find(
                        (k) => k.id === selectedApiKeyId
                      )?.provider;
                      if (!provider) return "N/A";
                      const lower = String(provider).toLowerCase();
                      return lower.charAt(0).toUpperCase() + lower.slice(1);
                    })()}
                  </div>
                </section>
                {/* Add an inline compare button inside the modal content so users don't need to scroll to the footer */}
                <div className="flex justify-end pt-2">
                  <DialogClose asChild>
                    <Button
                      onClick={handleEvaluateClick}
                      disabled={
                        evaluating ||
                        !accessToken ||
                        !selectedJobId ||
                        !selectedApiKeyId ||
                        !selectedCvId ||
                        !selectedModel
                      }
                    >
                      {evaluating ? "Comparing…" : "Compare"}
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Selections will be used to generate a detailed candidate
              comparison.
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={handleEvaluateClick}
                  disabled={
                    evaluating ||
                    !accessToken ||
                    !selectedJobId ||
                    !selectedApiKeyId ||
                    !selectedCvId ||
                    !selectedModel
                  }
                >
                  {evaluating ? "Comparing…" : "Compare"}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
