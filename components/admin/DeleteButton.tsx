"use client";

import { useEffect, useId, useState } from "react";
import Button from "@/components/ui/Button";

type DeleteButtonProps = {
  label: string;
  action: (formData: FormData) => void | Promise<void>;
};

export default function DeleteButton({ label, action }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="!border-rose-300 !text-rose-700"
        onClick={() => setOpen(true)}
      >
        {label}を削除する
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/50" aria-hidden="true" />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface-elevated p-3 shadow-pop-hover"
            onClick={event => event.stopPropagation()}
          >
            <h2 id={titleId} className="text-lg font-bold text-foreground">
              削除の確認
            </h2>
            <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-muted">
              「{label}」を削除しますか？
              <br />
              この操作は取り消せません。
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" autoFocus onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <form action={action}>
                <Button type="submit" className="w-full !bg-rose-600 hover:!bg-rose-700 sm:w-auto">
                  削除する
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
