"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// On-screen editor square (px) and the resolution we actually export at.
// The site displays faculty photos in a circular, object-fit:cover avatar,
// so we only need a square "cover" crop — the circular clipping happens on
// the live site via CSS, not here.
const EDIT_SIZE = 200;
const OUTPUT_SIZE = 480;
const MAX_ZOOM = 3;

type ImgMeta = { el: HTMLImageElement; naturalW: number; naturalH: number };

/**
 * Drop-in replacement for <input type="file" name={name} accept="image/*">
 * that lets the admin pick a photo, then pan/zoom a square crop of it before
 * it's actually uploaded. The real, submitted file input stays in the DOM
 * (hidden) with the same `name`, so the surrounding <form action={...}>
 * Server Action needs no changes — it just receives an already-cropped
 * image under the same field name it always has.
 */
export default function AvatarCropper({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string | null;
}) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<ImgMeta | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffX: 0,
    startOffY: 0,
  });

  const [editing, setEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // fraction of viewport size
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // for the "done" thumbnail

  const clampOffset = useCallback((s: number, off: { x: number; y: number }) => {
    const meta = imgRef.current;
    if (!meta) return off;
    const cover = 1 / Math.min(meta.naturalW, meta.naturalH); // per "size px" of a size=1 canvas
    const totalScale = cover * s;
    const drawW = meta.naturalW * totalScale;
    const drawH = meta.naturalH * totalScale;
    const maxX = Math.max(0, (drawW - 1) / 2);
    const maxY = Math.max(0, (drawH - 1) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, off.x)),
      y: Math.min(maxY, Math.max(-maxY, off.y)),
    };
  }, []);

  const drawToCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, s: number, off: { x: number; y: number }) => {
      const meta = imgRef.current;
      if (!canvas || !meta) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const size = canvas.width;
      const cover = size / Math.min(meta.naturalW, meta.naturalH);
      const totalScale = cover * s;
      const drawW = meta.naturalW * totalScale;
      const drawH = meta.naturalH * totalScale;
      const dx = (size - drawW) / 2 + off.x * size;
      const dy = (size - drawH) / 2 + off.y * size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(meta.el, dx, dy, drawW, drawH);
    },
    []
  );

  // Renders the current crop into the hidden, actually-submitted file
  // input. Awaitable so a "close editor now" action can force one last,
  // up-to-date export instead of racing the debounced version below.
  const exportNow = useCallback(
    (s: number, off: { x: number; y: number }) =>
      new Promise<void>((resolve) => {
        if (!imgRef.current) return resolve();
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = OUTPUT_SIZE;
        exportCanvas.height = OUTPUT_SIZE;
        drawToCanvas(exportCanvas, s, off);
        exportCanvas.toBlob(
          (blob) => {
            if (!blob || !hiddenRef.current) return resolve();
            const file = new File([blob], "avatar-cropped.jpg", { type: "image/jpeg" });
            const dt = new DataTransfer();
            dt.items.add(file);
            hiddenRef.current.files = dt.files;
            const url = URL.createObjectURL(blob);
            setPreviewUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
            resolve();
          },
          "image/jpeg",
          0.9
        );
      }),
    [drawToCanvas]
  );

  const scheduleExport = useCallback(
    (s: number, off: { x: number; y: number }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void exportNow(s, off);
      }, 120);
    },
    [exportNow]
  );

  // Redraw the live editor preview on every scale/offset change.
  useEffect(() => {
    if (!editing) return;
    drawToCanvas(canvasRef.current, scale, offset);
    scheduleExport(scale, offset);
  }, [editing, scale, offset, drawToCanvas, scheduleExport]);

  const openPicker = () => pickerRef.current?.click();

  const onFileChosen = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      imgRef.current = { el: img, naturalW: img.naturalWidth, naturalH: img.naturalHeight };
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setEditing(true);
    };
    img.src = url;
  };

  const finishEditing = async () => {
    // Force one last, up-to-date export in case the admin clicks "완료"
    // faster than the debounce above would otherwise fire — never leave the
    // hidden input holding a stale (or empty) crop.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await exportNow(scale, offset);
    setEditing(false);
    imgRef.current = null;
    if (pickerRef.current) pickerRef.current.value = "";
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffX: offset.x,
      startOffY: offset.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = (e.clientX - dragRef.current.startX) / EDIT_SIZE;
    const dy = (e.clientY - dragRef.current.startY) / EDIT_SIZE;
    setOffset(
      clampOffset(scale, { x: dragRef.current.startOffX + dx, y: dragRef.current.startOffY + dy })
    );
  };
  const onPointerUp = () => {
    dragRef.current.dragging = false;
  };

  const onZoomChange = (next: number) => {
    setScale(next);
    setOffset((prev) => clampOffset(next, prev));
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safety net: if the admin submits the surrounding form while a crop
  // adjustment is still mid-debounce (or without ever clicking "완료"),
  // intercept the submit once, flush the freshest crop into the hidden
  // input, then resubmit — so a fast click never uploads a stale crop.
  useEffect(() => {
    const form = hiddenRef.current?.form;
    if (!form) return;
    const handleSubmit = (e: Event) => {
      if (!debounceRef.current) return; // nothing pending — let it submit as-is
      e.preventDefault();
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      void exportNow(scale, offset).then(() => form.requestSubmit());
    };
    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [scale, offset, exportNow]);

  const thumb = previewUrl || initialUrl || null;

  return (
    <div>
      <input
        ref={pickerRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileChosen(e.target.files?.[0])}
      />
      {/* This is the one actually submitted with the surrounding form. */}
      <input ref={hiddenRef} type="file" name={name} className="hidden" />

      {!editing && (
        <div className="flex items-center gap-3">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt="현재 사진"
              className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 shrink-0" />
          )}
          <button
            type="button"
            onClick={openPicker}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            {thumb ? "사진 교체 & 크롭" : "사진 선택 & 크롭"}
          </button>
        </div>
      )}

      {editing && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-2 max-w-xs">
          <div
            ref={wrapRef}
            className="relative mx-auto touch-none select-none"
            style={{ width: EDIT_SIZE, height: EDIT_SIZE }}
          >
            <canvas
              ref={canvasRef}
              width={EDIT_SIZE}
              height={EDIT_SIZE}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="rounded-full cursor-move border border-slate-300"
              style={{ width: EDIT_SIZE, height: EDIT_SIZE }}
            />
          </div>
          <p className="text-center text-[11px] text-slate-500">
            드래그해서 위치 조정, 슬라이더로 확대
          </p>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={scale}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={finishEditing}
              className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              완료
            </button>
            <button
              type="button"
              onClick={openPicker}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              다른 사진 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
