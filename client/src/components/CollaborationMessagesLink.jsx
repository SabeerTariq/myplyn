import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '../services/api';
import Icon from './Icon';

export default function CollaborationMessagesLink({ collaborationId, basePath }) {
  const { data } = useQuery({
    queryKey: ['thread-by-collab', collaborationId],
    queryFn: () => messagesApi.byCollaboration(collaborationId).then((r) => r.data.thread),
    enabled: !!collaborationId,
  });

  if (!data?.id) return null;

  return (
    <Link to={`${basePath}/${data.id}`} className="btn-ghost" style={{ marginTop: 12 }}>
      <Icon name="forum" size={18} />
      Open messages
    </Link>
  );
}
