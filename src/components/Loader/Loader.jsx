import { useLoader } from '../../context/LoaderContext';

export default function Loader() {
  const { isLoading } = useLoader();
  if (!isLoading) return null;
  return (
    <div className="global-loader-overlay" role="status" aria-label="Loading…">
      <div className="global-loader-spinner" />
    </div>
  );
}
