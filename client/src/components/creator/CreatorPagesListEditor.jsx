import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Icon from '../Icon';
import Select from '../Select';
import { taxonomyApi } from '../../services/api';
import '../../styles/creator-home.css';

export function createPageEntry(platformId = '') {
  return {
    id: crypto.randomUUID(),
    platformId,
    name: '',
    url: '',
    followers: '',
  };
}

export default function CreatorPagesListEditor({ pages, onChange }) {
  const { data: platforms = [] } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms),
  });

  const selectedPlatformIds = useMemo(
    () => new Set(pages.map((page) => String(page.platformId)).filter(Boolean)),
    [pages],
  );

  const togglePlatform = (platformId) => {
    const id = String(platformId);
    const existingPages = pages.filter((page) => String(page.platformId) === id);

    if (existingPages.length > 0) {
      const remaining = pages.filter((page) => String(page.platformId) !== id);
      onChange(remaining.length ? remaining : []);
      return;
    }

    onChange([...pages.filter((page) => page.platformId), createPageEntry(id)]);
  };

  const updatePage = (pageId, patch) => {
    onChange(pages.map((page) => (page.id === pageId ? { ...page, ...patch } : page)));
  };

  const removePage = (pageId) => {
    const remaining = pages.filter((page) => page.id !== pageId);
    onChange(remaining);
  };

  const addPage = () => {
    onChange([...pages, createPageEntry()]);
  };

  const platformName = (platformId) => (
    platforms.find((item) => String(item.id) === String(platformId))?.name || 'Platform'
  );

  return (
    <>
      <div className="cr-form-section">
        <h3>Platforms</h3>
        <p className="cr-form-hint">Select every platform you want to list. You can add more pages below.</p>
        <div className="cr-platform-grid" role="group" aria-label="Platforms">
          {platforms.map((platform) => {
            const checked = selectedPlatformIds.has(String(platform.id));
            return (
              <label
                key={platform.id}
                className={`cr-platform-option${checked ? ' cr-platform-option--checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePlatform(platform.id)}
                />
                <span>{platform.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="cr-form-section">
        <div className="cr-form-section-head">
          <h3>Page details</h3>
          <p className="cr-form-hint">Add the page name and profile link for each platform.</p>
        </div>

        {pages.length === 0 ? (
          <p className="cr-form-hint cr-onboarding-empty-hint">
            Select one or more platforms above, or add a page manually.
          </p>
        ) : (
          <div className="cr-onboarding-page-list">
            {pages.map((page, index) => (
              <div key={page.id} className="cr-onboarding-page-card">
                <div className="cr-onboarding-page-card-head">
                  <strong>
                    {page.platformId ? platformName(page.platformId) : `Page ${index + 1}`}
                  </strong>
                  <button
                    type="button"
                    className="cr-onboarding-page-remove"
                    onClick={() => removePage(page.id)}
                    aria-label="Remove page"
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>

                <div className="cr-form-stack">
                  {!page.platformId && (
                    <div className="cr-form-field">
                      <label className="label">Platform</label>
                      <Select
                        value={page.platformId}
                        onChange={(e) => updatePage(page.id, { platformId: e.target.value })}
                      >
                        <option value="">Select platform</option>
                        {platforms.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <div className="cr-form-field">
                    <label className="label">Page name</label>
                    <input
                      className="input"
                      placeholder="@yourhandle or channel name"
                      value={page.name}
                      onChange={(e) => updatePage(page.id, { name: e.target.value })}
                    />
                  </div>

                  <div className="cr-form-field">
                    <label className="label">Profile URL</label>
                    <input
                      className="input"
                      type="url"
                      placeholder="https://instagram.com/yourpage"
                      value={page.url}
                      onChange={(e) => updatePage(page.id, { url: e.target.value })}
                    />
                  </div>

                  <div className="cr-form-field">
                    <label className="label">Followers</label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="e.g. 25000"
                      value={page.followers}
                      onChange={(e) => updatePage(page.id, { followers: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button" className="cr-onboarding-add-page" onClick={addPage}>
          <Icon name="add" size={18} />
          Add another page
        </button>
      </div>
    </>
  );
}

export function validatePagesList(pages) {
  const validPages = pages.filter(
    (page) => page.platformId && page.name.trim() && page.url.trim(),
  );

  if (validPages.length === 0) {
    return 'Add at least one page with platform, name, and profile URL.';
  }

  for (const page of validPages) {
    const followers = Number(page.followers);
    if (!Number.isFinite(followers) || followers < 0) {
      return 'Enter follower count for each page.';
    }
  }

  return null;
}
