import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '../services/api';
import { isMessagingActive, isMessagingWorkspace } from '../utils/messageThread';
import Icon from './Icon';

export default function CollaborationMessagesLink({
  collaborationId,
  basePath,
  status,
  prominent = false,
}) {
  const { data, isError } = useQuery({
    queryKey: ['thread-by-collab', collaborationId],
    queryFn: () => messagesApi.byCollaboration(collaborationId).then((r) => r.data.thread),
    enabled: !!collaborationId && isMessagingActive(status),
    retry: false,
  });

  if (!collaborationId || !isMessagingActive(status)) {
    return (
      <p className="msg-context-hint" style={{ marginTop: 12 }}>
        Messages open once the collaboration is accepted by both sides and content is shared.
      </p>
    );
  }

  if (isError || !data?.id) {
    if (status === 'ACCEPTED') {
      return (
        <p className="msg-context-hint" style={{ marginTop: 12 }}>
          Provide campaign content to open the collaboration messages workspace.
        </p>
      );
    }
    return null;
  }

  const workspaceOpen = isMessagingWorkspace(status);
  const className = prominent || workspaceOpen ? 'btn-primary dashboard-pill-btn' : 'btn-ghost';
  const label = workspaceOpen ? 'Open collaboration messages' : 'View contract thread';

  return (
    <Link
      to={`${basePath}/${data.id}`}
      className={className}
      style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <Icon name="forum" size={18} />
      {label}
    </Link>
  );
}
