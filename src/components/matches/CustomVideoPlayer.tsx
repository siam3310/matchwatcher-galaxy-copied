
import { useState, useRef, useEffect } from "react";
import { MatchSource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomVideoPlayerProps {
  sources: MatchSource[];
  initialSourceId?: string;
}

const CustomVideoPlayer = ({ sources, initialSourceId }: CustomVideoPlayerProps) => {
  const [activeSourceId, setActiveSourceId] = useState<string>(initialSourceId || sources[0]?.id || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const activeSource = sources.find(source => source.id === activeSourceId) || sources[0];

  // Controls visibility management
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [activeSource]);

  // Cleanup control timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const video = videoRef.current;
    if (!progressBar || !video) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  };

  const handleSourceChange = (sourceId: string) => {
    setActiveSourceId(sourceId);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };
  
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // If no sources are available
  if (sources.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-r from-cricliv-purple to-cricliv-green/80 flex items-center justify-center text-white">
        No video sources available
      </div>
    );
  }

  // Source selector component (moved to top-left)
  const SourceSelector = () => (
    <div className="absolute top-4 left-4 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-black/70 text-white hover:bg-black/90 border-none">
            <Settings className="h-4 w-4 mr-2 text-cricliv-blue" />
            {activeSource.name} {activeSource.quality ? `(${activeSource.quality})` : ''}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-black/90 border-none">
          {sources.map((source) => (
            <DropdownMenuItem
              key={source.id}
              onClick={() => handleSourceChange(source.id)}
              className={`${source.id === activeSourceId ? "bg-cricliv-blue/20 text-cricliv-blue" : "text-white"} hover:bg-white/10`}
            >
              {source.name} {source.quality ? `(${source.quality})` : ''}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // If source is iframe type
  if (activeSource.type === 'iframe') {
    return (
      <div className="aspect-video bg-black relative">
        <iframe
          src={activeSource.url}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        {sources.length > 1 && <SourceSelector />}
      </div>
    );
  }

  // For video type sources - matching the design in the image
  return (
    <div 
      ref={containerRef} 
      className="aspect-video bg-black relative group cursor-pointer overflow-hidden"
      onClick={togglePlay}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={activeSource.url}
        className="w-full h-full"
      />

      {/* Source Selector - Always visible */}
      {sources.length > 1 && <SourceSelector />}

      {/* Live indicator in the top-right corner if the match is live */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-cricket-ball/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
          LIVE
        </div>
      </div>

      {/* Center Play/Pause Button - Visible on hover or pause */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying && showControls ? 'opacity-100' : isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full bg-black/30 border-white/30 text-white hover:bg-black/50 hover:scale-110 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </Button>
      </div>

      {/* Skip Forward/Backward Buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center ml-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            skipBackward();
          }}
          className={`w-12 h-12 rounded-full text-white/70 hover:text-white hover:bg-black/20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center mr-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            skipForward();
          }}
          className={`w-12 h-12 rounded-full text-white/70 hover:text-white hover:bg-black/20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Video Controls - New design matching the image */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div 
          ref={progressBarRef}
          className="relative h-1 bg-white/30 rounded-full cursor-pointer mb-3"
          onClick={handleProgressBarClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-cricliv-blue rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/10 p-1"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/10 p-1"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <div className="w-20 hidden sm:block">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #33C3F0 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%)`,
                }}
              />
            </div>

            <span className="text-white text-xs sm:text-sm">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white text-xs sm:text-sm mr-2">
              {activeSource.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10 p-1"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
