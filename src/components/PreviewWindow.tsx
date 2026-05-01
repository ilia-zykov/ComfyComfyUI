'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, PinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LivePreview } from './LivePreview';
import { isPipSupported, usePiP, PiPPortal } from './PiPHost';
import type { ObjectInfo } from '@/lib/comfy/types';
import { useT } from '@/store/i18n';

const PIN_KEY = 'comfy-panel-pin-preview';

export function PreviewWindow({
  objectInfo,
}: {
  objectInfo: ObjectInfo | undefined;
}) {
  const t = useT();
  const pip = usePiP({ width: 440, height: 600 });
  const [pinned, setPinned] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isPipSupported());
    setPinned(window.localStorage.getItem(PIN_KEY) === '1');
  }, []);

  function togglePin() {
    setPinned((v) => {
      const next = !v;
      window.localStorage.setItem(PIN_KEY, next ? '1' : '0');
      return next;
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (pip.isOpen ? pip.close() : pip.open())}
        disabled={!supported}
        title={pip.isOpen ? t('panel.closePip') : t('panel.openPip')}
      >
        <ExternalLink className="size-4" />
        {pip.isOpen ? t('panel.closePip') : t('panel.openPip')}
      </Button>
      <Button
        variant={pinned ? 'default' : 'outline'}
        size="sm"
        onClick={togglePin}
        title={pinned ? t('panel.unpinPreview') : t('panel.pinPreview')}
      >
        <PinIcon className="size-4" />
        {pinned ? t('panel.unpinPreview') : t('panel.pinPreview')}
      </Button>

      <PiPPortal doc={pip.doc}>
        <div className="fixed inset-0 flex flex-col">
          <LivePreview objectInfo={objectInfo} />
        </div>
      </PiPPortal>

      {pinned && !pip.isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-[480px] rounded-lg shadow-2xl border border-border bg-background overflow-hidden flex flex-col">
          <LivePreview
            objectInfo={objectInfo}
            onClose={togglePin}
            closeLabel={t('panel.unpinPreview')}
          />
        </div>
      )}
    </>
  );
}
