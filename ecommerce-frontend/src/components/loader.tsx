const Loader = () => {
  return <div>Loading....</div>;
};

export default Loader;

interface skeltonProps {
  width?: string;
  length?: number;
}
export const Skelton = ({ width = "unset", length = 3 }: skeltonProps) => {
  const skeletions = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skelton-shape"></div>
  ));
  return (
    <div className="skelton-loader" style={{ width }}>
      {skeletions}
    </div>
  );
};
