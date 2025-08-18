import "./Loader.css"; // make sure to create this CSS file

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="colorful-spinner"></div>
    </div>
  );
};
export default Loader;

interface skeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length = 3 }: skeletonProps) => {
  const skeletons = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ));
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletons}
    </div>
  );
};