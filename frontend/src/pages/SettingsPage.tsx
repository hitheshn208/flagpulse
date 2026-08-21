import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Pencil,
  Shield,
  Trash2,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { deleteProject, editProject } from "@/services/project.service";
import { removeProject, updateProjectName } from "@/features/projectSlice";
import { setPage } from "@/features/uiSlice";

interface SettingsPageProps {
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

function DeleteModal({
  projectName,
  loading,
  onClose,
  onConfirm,
}: {
  projectName: string | undefined;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");

  const canDelete = typed === projectName && !loading;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/70 p-5 backdrop-blur-[3px]">
      <div className="w-full max-w-110 rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-[#3a292b] bg-[#181313] text-[#f87171]">
            <Trash2 size={15} />
          </div>

          <div>
            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-(--color-text)">
              Delete project
            </h3>

            <p className="mt-0.5 text-[11px] text-(--color-text-subtle)">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-sm border border-[#35272a] bg-[#131111] px-3 py-2.5 text-xs leading-6 text-(--color-text-muted)">
          All flags, environments, and audit history associated with this
          project will be permanently deleted.
        </div>

        <p className="mb-2 text-xs text-(--color-text-muted)">
          Type{" "}
          <code className="rounded border border-(--color-code-border) bg-(--color-code-bg) px-1.5 py-0.5 font-mono text-[11px] text-(--color-text-secondary)">
            {projectName}
          </code>{" "}
          to confirm.
        </p>

        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={projectName}
          autoFocus
          className="mb-4 box-border w-full rounded-sm border border-(--color-border) bg-(--color-code-bg) px-3 py-2 text-xs text-(--color-text) outline-none transition-colors placeholder:text-(--color-text-faint) focus:border-(--color-border-active)"
        />

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className="flex-1 rounded-sm border border-transparent px-3 py-2 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:bg-(--color-surface-highlight) disabled:text-(--color-text-faint)"
            style={{
              background: canDelete ? "#ef4444" : undefined,
              color: canDelete ? "#fff" : undefined,
            }}
          >
            {loading ? "Deleting..." : "Delete project"}
          </button>

          <button
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-sm border border-(--color-border) bg-transparent px-3 py-2 text-xs text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage({ onToast }: SettingsPageProps) {
  const project = useSelector(
    (state: RootState) => state.project.currentProject,
  );

  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState(project?.name ?? "");

  const [showDelete, setShowDelete] = useState(false);

  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);

  const [savingProject, setSavingProject] = useState(false);

  /*
   * Keep local values in sync when the user
   * switches to another project.
   */
  useEffect(() => {
    setProjectName(project?.name ?? "");
  }, [project?.id]);

  const originalName = project?.name ?? "";

  const nameChanged = projectName.trim() !== originalName;

  const canSaveProject =
    nameChanged && projectName.trim().length > 0 && !savingProject;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(project?.id ?? "");

      setCopied(true);

      onToast("Project ID copied", "info");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast("Failed to copy project ID", "error");
    }
  };

  const handleSaveProject = async () => {
    if (!project || !canSaveProject) {
      return;
    }
    setSavingProject(true);
    try {
      const payload = {
        name: projectName.trim(),
      };
      await editProject(project.id, payload);
      dispatch(updateProjectName({id: project.id, name: payload.name}));
      onToast("Project settings saved", "success");
    } catch {
      onToast("Failed to update project settings", "error");
    } finally {
      setSavingProject(false);
    }
  };

  const handleDelete = async () => {
    if (!project) {
      return;
    }

    setLoading(true);

    try {
      await deleteProject(project.id);

      dispatch(
        removeProject({
          id: project.id,
        }),
      );

      dispatch(setPage("projects"));
    } catch {
      onToast("Failed to delete project", "error");
    } finally {
      setLoading(false);
      setShowDelete(false);
    }
  };

  return (
    <div className="w-full px-8 py-8 text-(--color-text)">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-(--color-text)">
          Project Settings
        </h1>

        <p className="mt-1.5 text-[13px] leading-5 text-(--color-text-muted)">
          Manage your project configuration and settings.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[
          {
            label: "Total Flags",
            value: project?.flags_count ?? 0,
          },
          {
            label: "Environments",
            value: project?.environments_count ?? 0,
          },
          {
            label: "Created",
            value: project
              ? new Date(project.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-3.5"
          >
            <div className="mb-1.5 text-[10px] font-medium tracking-[0.06em] text-(--color-text-subtle)">
              {stat.label.toUpperCase()}
            </div>

            <div className="text-[18px] font-semibold tracking-[-0.02em] text-(--color-text)">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* General */}
      <section className="mb-3.5 overflow-hidden rounded-md border border-(--color-border) bg-(--color-surface)">
        <div className="border-b border-(--color-border) px-4.5 py-3.5">
          <h2 className="text-xs font-medium text-(--color-text-secondary)">
            General
          </h2>
        </div>

        <div className="space-y-6 p-4.5">
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-(--color-text-secondary)">
              Project name
            </label>

            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-sm border border-(--color-border) bg-(--color-code-bg) px-3 py-2 text-xs text-(--color-text) outline-none transition-colors placeholder:text-(--color-text-faint) focus:border-(--color-border-active)"
            />

            <p className="mt-1.5 text-[11px] text-(--color-text-subtle)">
              The name displayed throughout your FlagPulse project.
            </p>
          </div>

          {/* Save */}
          <div className="flex items-center justify-end border-(--color-border)">
            <button
              onClick={handleSaveProject}
              disabled={!canSaveProject}
              className="flex items-center gap-1.5 rounded-sm bg-(--color-primary) px-3.5 py-2 text-xs font-semibold text-(--color-primary-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-(--color-surface-highlight) disabled:text-(--color-text-faint) disabled:opacity-100"
            >
              <Pencil size={12} />

              {savingProject ? "Saving..." : "Save changes"}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-(--color-border)" />

          {/* Project ID */}
          <div>
            <label className="mb-2 block text-xs font-medium text-(--color-text-secondary)">
              Project ID
            </label>

            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm border border-(--color-code-border) bg-(--color-code-bg) px-2.5 py-2 font-mono text-[11px] text-(--color-code-text)">
                {project?.id ?? "—"}
              </code>

              <button
                onClick={handleCopyId}
                className="flex shrink-0 items-center gap-1.5 rounded-sm border border-(--color-border) bg-(--color-surface) px-2.5 py-1.5 text-[11px] text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text-secondary)"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}

                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="mt-1.5 text-[11px] text-(--color-text-subtle)">
              Read-only identifier used for API calls and SDK initialization.
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-md border border-[#382629] bg-(--color-surface) p-4.5">
        <div className="mb-1.5 flex items-center gap-2">
          <Shield size={13} className="text-[#f87171]" />

          <h2 className="text-[11px] font-medium tracking-wider text-[#f87171]">
            DANGER ZONE
          </h2>
        </div>

        <p className="mb-4 max-w-170 text-xs leading-6 text-(--color-text-muted)">
          Deleting this project will permanently remove all feature flags,
          environments, and audit history. This action cannot be undone.
        </p>

        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 rounded-sm border border-[#4a292d] bg-transparent px-3 py-2 text-xs font-medium text-[#f87171] transition-colors hover:bg-[#181112]"
        >
          <Trash2 size={13} />
          Delete this project
        </button>
      </section>

      {/* Delete Modal */}
      {showDelete && (
        <DeleteModal
          projectName={project?.name}
          loading={loading}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
