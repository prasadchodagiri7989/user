import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  let embedUrl = url;
  let isLivid = false;

  if (url.includes("livid.com/watch/")) {
    embedUrl = url.replace("livid.com/watch/", "livid.com/embed/");
    isLivid = true;
  } else if (url.includes("livid.com/embed/")) {
    isLivid = true;
  } else if (url.includes("watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  }

  const finalUrl = isLivid 
    ? embedUrl 
    : `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}rel=0&modestbranding=1`;

  return (
    <div className="relative bg-black w-full aspect-video flex flex-col justify-center overflow-hidden border-b border-border">
      <iframe
        className="w-full h-full"
        src={finalUrl}
        title={isLivid ? "Livid video player" : "YouTube video player"}
        frameBorder="0"
        allow="autoplay; encrypted-media; clipboard-write; fullscreen; picture-in-picture; web-share"
        allowFullScreen
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};

