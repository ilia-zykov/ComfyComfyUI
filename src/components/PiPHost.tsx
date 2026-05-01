'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow: (opts?: {
        width?: number;
        height?: number;
        disallowReturnToOpener?: boolean;
        preferInitialWindowPlacement?: boolean;
      }) => Promise<Window>;
      window: Window | null;
    };
  }
}

export function isPipSupported() {
  return (
    typeof window !== 'undefined' && 'documentPictureInPicture' in window
  );
}

function copyStyles(target: Document) {
  document.head
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((el) => {
      target.head.appendChild(el.cloneNode(true));
    });
  target.documentElement.className = document.documentElement.className;
  target.body.className = document.body.className;
}

export function usePiP(opts: { width?: number; height?: number } = {}) {
  const [doc, setDoc] = useState<Document | null>(null);
  const winRef = useRef<Window | null>(null);

  async function open() {
    if (!isPipSupported()) {
      alert(
        'Picture-in-Picture is not supported in this browser. Use Chrome or Edge 116+. Try "Pin preview" instead.',
      );
      return;
    }
    const pip = await window.documentPictureInPicture!.requestWindow({
      width: opts.width ?? 420,
      height: opts.height ?? 560,
    });
    copyStyles(pip.document);
    pip.document.title = 'Comfy Panel — Live Preview';
    winRef.current = pip;
    pip.addEventListener('pagehide', () => {
      winRef.current = null;
      setDoc(null);
    });
    setDoc(pip.document);
  }

  function close() {
    winRef.current?.close();
    winRef.current = null;
    setDoc(null);
  }

  useEffect(() => () => winRef.current?.close(), []);

  return { open, close, doc, isOpen: !!doc };
}

export function PiPPortal({
  doc,
  children,
}: {
  doc: Document | null;
  children: React.ReactNode;
}) {
  if (!doc) return null;
  return createPortal(children, doc.body);
}
