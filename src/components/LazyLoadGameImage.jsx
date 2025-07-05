import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LazyLoadGameImage({ image }) {
    return (
        <LazyLoadImage
            alt="image"
            effect="blur"
            wrapperProps={{
                style: { transitionDelay: "0.5s" },
            }}
            className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity duration-300"
            src={image}
        />
    );
}