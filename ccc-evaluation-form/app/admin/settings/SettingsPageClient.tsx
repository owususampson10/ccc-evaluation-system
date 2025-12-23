"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  ShieldAlert,
  Info,
} from "lucide-react";

import Toast from "@/components/ui/Toast";

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  activeUsers: number;
}

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

type BackupFormat = "json" | "csv" | "sql";

type ImportMode = "add" | "replace";

interface ImportPreview {
  filename: string;
  records: number;
  backupDate?: string;
}

export default function SettingsPageClient() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [toast, setToast] = useState<ToastState>(null);

  // Purge state
  const [purgeModalOpen, setPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [purgePassword, setPurgePassword] = useState("");
  const [purgeError, setPurgeError] = useState<string | null>(null);
  const [purging, setPurging] = useState(false);

  // Backup state
  const [backupFormat, setBackupFormat] = useState<BackupFormat>("json");
  const [backingUp, setBackingUp] = useState(false);

  // Import state
  const [importMode, setImportMode] = useState<ImportMode>("add");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(
    null
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Fetch global stats for counts (used across cards)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/responses/stats", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Stats;
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats for settings page", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalResponses = stats?.total ?? 0;

  // -------- PURGE HANDLERS --------

  const openPurgeModal = () => {
    setPurgeConfirmText("");
    setPurgePassword("");
    setPurgeError(null);
    setPurgeModalOpen(true);
  };

  const closePurgeModal = () => {
    if (purging) return;
    setPurgeModalOpen(false);
  };

  const handleConfirmPurge = async () => {
    if (purgeConfirmText !== "DELETE ALL") {
      setPurgeError("You must type DELETE ALL to confirm.");
      return;
    }
    if (!purgePassword) {
      setPurgeError("Please re-enter your admin password.");
      return;
    }

    setPurging(true);
    setPurgeError(null);

    try {
      const res = await fetch("/api/admin/purge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmText: purgeConfirmText,
          password: purgePassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || "Failed to purge database.";
        setPurgeError(msg);
        setToast({ message: msg, type: "error" });
        return;
      }

      const result = await res.json();

      setToast({
        message:
          result?.deletedCount != null
            ? `Database purged successfully. ${result.deletedCount} responses deleted.`
            : "Database purged successfully. All responses have been deleted.",
        type: "success",
      });

      setPurgeModalOpen(false);
      setPurgeConfirmText("");
      setPurgePassword("");

      // Refresh stats and redirect to admin dashboard
      setStats((prev) =>
        prev ? { ...prev, total: 0, today: 0, thisWeek: 0 } : prev
      );
      router.push("/admin");
    } catch (err) {
      console.error("Purge error", err);
      const msg = "An unexpected error occurred while purging.";
      setPurgeError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setPurging(false);
    }
  };

  // -------- BACKUP HANDLERS --------

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const res = await fetch(`/api/admin/backup?format=${backupFormat}`, {
        method: "GET",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || "Failed to create backup.";
        setToast({ message: msg, type: "error" });
        return;
      }

      const disposition = res.headers.get("Content-Disposition");
      let filename = "ccc-backup";
      if (disposition) {
        const match = /filename="?([^";]+)"?/i.exec(disposition);
        if (match?.[1]) filename = match[1];
      } else {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        filename = `ccc-backup-${ts}.${backupFormat}`;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      const totalHeader = res.headers.get("X-Total-Responses");
      const count = totalHeader ? parseInt(totalHeader, 10) : totalResponses;

      setToast({
        message: `Backup created successfully. ${count} responses backed up.`,
        type: "success",
      });
    } catch (err) {
      console.error("Backup error", err);
      setToast({
        message: "An unexpected error occurred while creating backup.",
        type: "error",
      });
    } finally {
      setBackingUp(false);
    }
  };

  // -------- IMPORT HANDLERS --------

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImportError(null);
    setImportFile(file || null);
    setImportPreview(null);

    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["json", "csv", "sql"].includes(ext)) {
      setImportError(
        "Invalid file type. Please select a .json, .csv, or .sql backup file."
      );
      return;
    }

    // Quick client-side preview: only for JSON (others handled server-side)
    if (ext === "json") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result || "");
          const parsed = JSON.parse(text);
          let records: any[] = [];
          let backupDate: string | undefined;
          if (Array.isArray(parsed)) {
            records = parsed;
          } else if (parsed && Array.isArray(parsed.responses)) {
            records = parsed.responses;
            if (parsed.metadata?.backupDate)
              backupDate = parsed.metadata.backupDate;
          }
          setImportPreview({
            filename: file.name,
            records: records.length,
            backupDate,
          });
        } catch (e) {
          console.error("Preview parse error", e);
          setImportError(
            "Could not read JSON backup for preview. You can still try importing."
          );
        }
      };
      reader.readAsText(file);
    } else {
      // For CSV / SQL we only show filename; server validates content
      setImportPreview({ filename: file.name, records: 0 });
    }
  };

  const openImportModal = () => {
    setImportError(null);
    setImportModalOpen(true);
  };

  const closeImportModal = () => {
    if (importing) return;
    setImportModalOpen(false);
  };

  const handleImportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      setImportError("Please select a backup file first.");
      return;
    }

    setImportError(null);
    setImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("mode", importMode);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || "Import failed.";
        setImportError(msg);
        setToast({ message: msg, type: "error" });
        return;
      }

      const result = await res.json();
      const imported = result?.importedCount ?? 0;
      const skipped = result?.skippedCount ?? 0;
      const errors = result?.errorCount ?? 0;

      setToast({
        message: `Import completed successfully. ${imported} responses imported, ${skipped} duplicates skipped, ${errors} errors.`,
        type: "success",
      });

      setImportModalOpen(false);
      setImportFile(null);
      setImportPreview(null);

      // Refresh dashboard stats
      router.refresh();
    } catch (err) {
      console.error("Import error", err);
      setImportError("An unexpected error occurred during import.");
      setToast({
        message: "An unexpected error occurred during import.",
        type: "error",
      });
    } finally {
      setImporting(false);
    }
  };

  const estimatedBackupSizeMb = (() => {
    if (!stats) return "-";
    const approxBytes = stats.total * 2000; // rough estimate: 2KB per response
    const mb = approxBytes / (1024 * 1024);
    if (mb < 0.01) return "< 0.01 MB";
    return `${mb.toFixed(2)} MB`;
  })();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage database and system configuration.
        </p>
      </div>

      {/* Warning about permissions */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl flex items-start gap-3">
        <ShieldAlert className="mt-0.5" size={18} />
        <div>
          <p className="font-semibold">Admin-only area</p>
          <p className="text-sm">
            These tools perform powerful operations on the database. Use with
            caution and ensure backups are stored securely.
          </p>
        </div>
      </div>

      {/* 3-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* PURGE CARD */}
        <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Purge Database
              </h2>
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle size={14} /> Danger Zone
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Delete all evaluation responses from the database. This action
            cannot be undone. User accounts will not be affected.
          </p>

          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800 flex gap-2">
            <AlertTriangle size={18} className="mt-0.5" />
            <p>
              <span className="font-semibold">DANGER:</span> This will
              permanently delete <strong>ALL</strong> responses. This action is
              irreversible.
            </p>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            {statsLoading ? (
              <span>Loading statistics...</span>
            ) : (
              <span>
                Current responses:{" "}
                <span className="font-semibold text-gray-800">
                  {totalResponses}
                </span>
              </span>
            )}
          </div>

          <div className="mt-auto">
            <button
              type="button"
              onClick={openPurgeModal}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} />
              Purge All Responses
            </button>
          </div>
        </section>

        {/* BACKUP CARD */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Backup Database
              </h2>
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">
                Safe Operation
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Create a backup of all evaluation responses. Download a file
            containing all data that can be restored later.
          </p>

          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex gap-2">
            <Info size={18} className="mt-0.5" />
            <p>
              Backups include all response data but not user accounts. Store
              backups securely and treat them as sensitive data.
            </p>
          </div>

          <div className="space-y-1 text-xs text-gray-600 mb-4">
            <p>
              Total responses:{" "}
              <span className="font-semibold text-gray-900">
                {totalResponses}
              </span>
            </p>
            <p>
              Estimated backup size:{" "}
              <span className="font-semibold text-gray-900">
                {estimatedBackupSizeMb}
              </span>
            </p>
            <p className="text-[11px] text-gray-400">
              (Estimate based on ~2KB per response. Actual file size may vary.)
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Backup format
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="backup-format"
                  value="json"
                  checked={backupFormat === "json"}
                  onChange={() => setBackupFormat("json")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">JSON (.json)</span>
                <span className="text-gray-400">Full detailed backup</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="backup-format"
                  value="csv"
                  checked={backupFormat === "csv"}
                  onChange={() => setBackupFormat("csv")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">CSV (.csv)</span>
                <span className="text-gray-400">Spreadsheet compatible</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="backup-format"
                  value="sql"
                  checked={backupFormat === "sql"}
                  onChange={() => setBackupFormat("sql")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">SQL (.sql)</span>
                <span className="text-gray-400">
                  Not fully supported on SQLite in this app
                </span>
              </label>
            </div>
          </div>

          <div className="mt-auto">
            <button
              type="button"
              onClick={handleBackup}
              disabled={backingUp || statsLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {backingUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating & Downloading Backup...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Create & Download Backup
                </>
              )}
            </button>
          </div>
        </section>

        {/* IMPORT CARD */}
        <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Import/Restore Data
              </h2>
              <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
                Advanced
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Restore responses from a backup file or import data from an external
            source.
          </p>

          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex gap-2">
            <AlertTriangle size={18} className="mt-0.5" />
            <p>
              <span className="font-semibold">Caution:</span> Importing will{" "}
              <strong>add data</strong> to your existing responses. To replace
              all data, purge the database first or use Replace mode.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Import mode
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="import-mode"
                  value="add"
                  checked={importMode === "add"}
                  onChange={() => setImportMode("add")}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">
                  Add to existing data (recommended)
                </span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="import-mode"
                  value="replace"
                  checked={importMode === "replace"}
                  onChange={() => setImportMode("replace")}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">
                  Replace all data (dangerous)
                </span>
                <span className="text-amber-500">Purges then imports</span>
              </label>
            </div>
          </div>

          {/* File upload */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Backup file (.json, .csv, .sql)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-500 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
              <input
                type="file"
                accept=".json,.csv,.sql"
                onChange={handleFileChange}
                className="hidden"
                id="import-file-input"
              />
              <label
                htmlFor="import-file-input"
                className="cursor-pointer flex flex-col items-center gap-1"
              >
                <Upload size={18} className="text-emerald-500" />
                <span className="font-medium text-gray-700">
                  Drag backup file here or click to browse
                </span>
                <span className="text-[11px] text-gray-400">
                  Max size 50MB. JSON backups provide the best compatibility for
                  this app.
                </span>
              </label>
            </div>

            {importPreview && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">File:</span>{" "}
                  {importPreview.filename}
                </p>
                {importPreview.records > 0 && (
                  <p>
                    <span className="font-semibold">Records to import:</span>{" "}
                    {importPreview.records}
                  </p>
                )}
                {importPreview.backupDate && (
                  <p>
                    <span className="font-semibold">Backup date:</span>{" "}
                    {new Date(importPreview.backupDate).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {importError && (
              <p className="mt-2 text-xs text-red-600">{importError}</p>
            )}
          </div>

          <div className="mt-auto">
            <button
              type="button"
              onClick={openImportModal}
              disabled={!importFile}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Upload size={18} />
              Import Data
            </button>
          </div>
        </section>
      </div>

      {/* PURGE MODAL */}
      {purgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closePurgeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 z-10 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirm Database Purge
                </h3>
                <p className="text-xs text-gray-500">
                  You are about to permanently delete{" "}
                  <strong>{totalResponses}</strong> responses.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800 flex gap-2 mb-4">
              <AlertTriangle size={18} className="mt-0.5" />
              <p>
                <span className="font-semibold">Are you absolutely sure?</span>{" "}
                This will permanently remove all evaluation responses and cannot
                be undone.
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type <span className="font-mono">DELETE ALL</span> to confirm
                </label>
                <input
                  type="text"
                  value={purgeConfirmText}
                  onChange={(e) => setPurgeConfirmText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="DELETE ALL"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Re-enter your admin password
                </label>
                <input
                  type="password"
                  value={purgePassword}
                  onChange={(e) => setPurgePassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="Admin password"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  This is required as an extra safety step before purging data.
                </p>
              </div>

              {purgeError && (
                <p className="text-xs text-red-600">{purgeError}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closePurgeModal}
                disabled={purging}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                disabled={
                  purging || purgeConfirmText !== "DELETE ALL" || !purgePassword
                }
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {purging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete Everything
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={closeImportModal}
          />
          <form
            onSubmit={handleImportSubmit}
            className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 z-10 animate-slideUp"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Upload size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirm Data Import
                </h3>
                <p className="text-xs text-gray-500">
                  You are about to import data in{" "}
                  <strong>{importMode === "add" ? "Add" : "Replace"}</strong>{" "}
                  mode.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1 mb-4">
              <p>
                <span className="font-semibold">File:</span>{" "}
                {importPreview?.filename || importFile?.name}
              </p>
              {importPreview?.records != null && importPreview.records > 0 && (
                <p>
                  <span className="font-semibold">Records to import:</span>{" "}
                  {importPreview.records}
                </p>
              )}
              {importMode === "replace" && (
                <p className="text-amber-700 flex items-center gap-1">
                  <AlertTriangle size={14} /> This will purge existing responses
                  before importing.
                </p>
              )}
            </div>

            {importError && (
              <p className="mb-3 text-xs text-red-600">{importError}</p>
            )}

            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={closeImportModal}
                disabled={importing}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={importing || !importFile}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
