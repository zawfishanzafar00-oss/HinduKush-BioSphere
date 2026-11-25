/* Reliable first-load playback for the muted Chitral background video. */
(() => {
  const startVideo = () => {
    const video = document.querySelector(".global-background-video");
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    if (video.readyState === 0) video.load();
    const attempt = () => {
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          // Retry when the browser has enough data or the page becomes active.
        });
      }
    };
    if (video.readyState >= 2) attempt();
    video.addEventListener("loadeddata", attempt, { once: true });
    video.addEventListener("canplay", attempt, { once: true });
    window.addEventListener("pageshow", attempt);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && video.paused) attempt();
    });
    window.addEventListener("pointerdown", () => {
      if (video.paused) attempt();
    }, { once: true, passive: true });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startVideo, { once: true });
  } else {
    startVideo();
  }
})();
