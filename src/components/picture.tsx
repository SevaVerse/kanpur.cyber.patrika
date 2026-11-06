import { PictureView, type PictureViewProps } from "@/components/picture-view";
import { getImageEntry } from "@/lib/image-manifest";

/**
 * Server-side convenience: looks the image up in the manifest. Client
 * components should use PictureView with an entry passed down as a prop, so
 * the manifest stays out of the client bundle.
 */
export function Picture(props: PictureViewProps) {
  return <PictureView {...props} entry={getImageEntry(props.src)} />;
}
