import Skeleton from "react-loading-skeleton";

function BookCardSkeleton() {
  return (
    <div className="book-card">
      <Skeleton height={220} />
      <Skeleton height={25} style={{ marginTop: "10px" }} />
      <Skeleton width="60%" />
      <Skeleton width="40%" />
    </div>
  );
}

export default BookCardSkeleton;