import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  // Ensure we use the embed format they requested
  let embedUrl = url;
  if (url.includes("watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  }

  // You wanted minimal controls natively: rel=0 hides related videos from other channels
  const finalUrl = `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}rel=0&modestbranding=1`;

  return (
    <div className="relative bg-black w-full aspect-video flex flex-col justify-center overflow-hidden border-b border-border">
      <iframe
        className="w-full h-full"
        src={finalUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

