import { Link } from 'react-router-dom';
import Icon from '../Icon';
import PageHeader from '../PageHeader';
import CreatorPageFormFields, { buildPageFormState, buildPagePayload } from './CreatorPageFormFields';
import '../../styles/creator-home.css';

export { buildPageFormState, buildPagePayload };

export default function CreatorPageFormShell({
  mode,
  pageId,
  pageName,
  form,
  setForm,
  error,
  loading,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === 'edit';

  return (
    <div className="cr-page-form-shell cc-animate-fade">
      <Link
        to={isEdit ? `/creator/pages/${pageId}` : '/creator/pages'}
        className="cr-page-back"
      >
        <Icon name="arrow_back" size={18} />
        {isEdit ? pageName || 'Page' : 'My Pages'}
      </Link>

      <PageHeader
        title={isEdit ? 'Edit page' : 'List a page'}
        lead={
          isEdit
            ? 'Update your page details. Changes are sent back to admin for verification.'
            : 'Submit your social page for verification so brands can discover and book you.'
        }
      />

      <form onSubmit={onSubmit} className="cr-page-form-layout">
        <CreatorPageFormFields form={form} setForm={setForm} error={error} />

        <div className="cr-page-form-footer">
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary dashboard-pill-btn" disabled={loading}>
            {loading
              ? isEdit ? 'Saving…' : 'Submitting…'
              : isEdit ? 'Save & resubmit' : 'Submit for verification'}
          </button>
        </div>
      </form>
    </div>
  );
}
