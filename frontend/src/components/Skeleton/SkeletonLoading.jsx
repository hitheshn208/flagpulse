import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoading(prop) {
    const skeletons = [];

    for (let i = 0; i < prop.count; i++) {
        skeletons.push(<Skeleton key={i} height={prop.height} width={prop.width} borderRadius={prop.radius || prop.radius === 0 ? prop.radius : "10px"}/>);
    }
    return (
        <>
            <SkeletonTheme
            baseColor="#2a2a2a"
            highlightColor="#3a3a3a"
            >
                {skeletons}
            </SkeletonTheme>
        </>
    );
}

export default SkeletonLoading;