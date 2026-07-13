import { useEffect, useState } from 'react';
import Icon from './Icon';
import { isImagePath, mediaUrl } from '../utils/messageThread';
import '../styles/media-viewer.css';

function isVideoPath(path) {
  return /\.(mp4|webm|mov|m4v)$/i.test(path || '');
}

function isPdfPath(path) {
  return /\.pdf$/i.test(path || '');
}

export function MediaViewer({ open, url, label, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !url) return null;

  const src = mediaUrl(url);
  const isImage = isImagePath(src);
  const isVideo = isVideoPath(src);
  const isPdf = isPdfPath(src);

  return (
    <div className="media-viewer-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={label || 'Media viewer'}>
      <div className="media-viewer-shell" onClick={(e) => e.stopPropagation()}>
        <div className="media-viewer-toolbar">
          <span className="media-viewer-label">{label || 'Media preview'}</span>
          <div className="media-viewer-actions">
            <a href={src} target="_blank" rel="noreferrer" className="media-viewer-open-link">
              <Icon name="open_in_new" size={16} />
              Open
            </a>
            <button type="button" className="media-viewer-close-btn" onClick={onClose}>
              <Icon name="close" size={18} />
              Cancel
            </button>
          </div>
        </div>
        <div className="media-viewer-body">
          {isImage && <img src={src} alt={label || 'Media'} className="media-viewer-image" />}
          {isVideo && <video src={src} controls className="media-viewer-video" />}
          {isPdf && <iframe src={src} title={label || 'PDF'} className="media-viewer-iframe" />}
          {!isImage && !isVideo && !isPdf && (
            <div className="media-viewer-fallback">
              <Icon name="insert_drive_file" size={40} style={{ opacity: 0.5 }} />
              <p>{label || 'Preview not available in-app'}</p>
              <a href={src} target="_blank" rel="noreferrer" className="btn-primary dashboard-pill-btn">
                Open in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaTrigger({
  url,
  label,
  children,
  className = '',
  linkClassName = 'msg-media-link',
  style,
}) {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  const src = mediaUrl(url);
  const isImage = isImagePath(src);

  if (!children && !isImage) {
    return (
      <>
        <button type="button" className={linkClassName} onClick={() => setOpen(true)}>
          <Icon name="attach_file" size={16} />
          {label || 'View media'}
        </button>
        <MediaViewer open={open} url={url} label={label} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`media-trigger ${className}`.trim()}
        style={style}
        onClick={() => setOpen(true)}
        aria-label={`View ${label || 'media'}`}
      >
        {children || (
          <>
            <Icon name="image" size={16} />
            {label || 'View media'}
          </>
        )}
      </button>
      <MediaViewer open={open} url={url} label={label} onClose={() => setOpen(false)} />
    </>
  );
}
