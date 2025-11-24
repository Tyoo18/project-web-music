(function () {
  // Side menu (hover trigger)  open on hover, close only on outside click
  const leftTrigger = document.getElementById("hoverTrigger");
  const sideMenu = document.getElementById("myMenu");

  if (leftTrigger && sideMenu) {
    leftTrigger.style.pointerEvents = "none";
    setTimeout(() => {
      leftTrigger.style.pointerEvents = "auto";
    }, 300);

    function openMenu() {
      sideMenu.classList.add("open");
    }
    leftTrigger.addEventListener("mouseenter", openMenu);
    sideMenu.addEventListener("mouseenter", openMenu);

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      const clickedInsideMenu =
        sideMenu.contains(target) || leftTrigger.contains(target);
      if (!clickedInsideMenu && sideMenu.classList.contains("open"))
        sideMenu.classList.remove("open");
    });
  }

  // Control panel (bottom trigger)
  const controlTrigger =
    document.getElementById("control-trigger") ||
    document.getElementById("controlTrigger");
  const control = document.getElementById("control");
  if (controlTrigger && control) {
    let hideTimer2 = null;
    function openControl() {
      if (hideTimer2) {
        clearTimeout(hideTimer2);
        hideTimer2 = null;
      }
      control.classList.add("open");
    }
    function scheduleCloseControl() {
      if (hideTimer2) clearTimeout(hideTimer2);
      hideTimer2 = setTimeout(() => {
        if (!control.matches(":hover") && !controlTrigger.matches(":hover"))
          control.classList.remove("open");
        hideTimer2 = null;
      }, 2000);
    }
    controlTrigger.addEventListener("mouseenter", openControl);
    controlTrigger.addEventListener("mouseleave", scheduleCloseControl);
    control.addEventListener("mouseenter", openControl);
    control.addEventListener("mouseleave", scheduleCloseControl);
  }

  // Play / Pause control for vinyl and arm
  const vinyl = document.getElementById("vinyl");
  const arm = document.getElementById("arm");
  const playBtn =
    document.getElementById("playPause") || document.getElementById("plps");
  if (vinyl && arm && playBtn) {
    try {
      vinyl.style.animationPlayState = "paused";
    } catch (e) {}
    try {
      arm.style.transform = "rotate(0deg)";
    } catch (e) {}
    let playing = false,
      vinylTimer = null,
      armTimer = null;
    const armToVinylDelay = 200;
    function updatePlayIcon() {
      if (playing) {
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
      } else {
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
      }
    }
    function clearTimers() {
      if (vinylTimer) {
        clearTimeout(vinylTimer);
        vinylTimer = null;
      }
      if (armTimer) {
        clearTimeout(armTimer);
        armTimer = null;
      }
    }
    playBtn.addEventListener("click", () => {
      playing = !playing;
      clearTimers();
      if (playing) {
        try {
          arm.style.transform = "rotate(25deg)";
        } catch (e) {}
        vinylTimer = setTimeout(() => {
          try {
            vinyl.style.animationPlayState = "running";
          } catch (e) {}
          vinylTimer = null;
        }, armToVinylDelay);
      } else {
        try {
          vinyl.style.animationPlayState = "paused";
        } catch (e) {}
        armTimer = setTimeout(() => {
          try {
            arm.style.transform = "rotate(0deg)";
          } catch (e) {}
          armTimer = null;
        }, armToVinylDelay);
      }
      updatePlayIcon();
    });
    updatePlayIcon();
  }

  // Fullscreen / expand button
  const expandBtn = document.getElementById("expand");
  if (expandBtn) {
    expandBtn.addEventListener("click", async () => {
      const elem = document.documentElement;
      try {
        if (!document.fullscreenElement) await elem.requestFullscreen();
        else await document.exitFullscreen();
      } catch (e) {
        console.warn("Fullscreen request failed:", e);
      }
    });
    document.addEventListener("fullscreenchange", () => {
      const icon = expandBtn.querySelector("i");
      if (!icon) return;
      if (document.fullscreenElement) {
        icon.classList.remove("fa-expand");
        icon.classList.add("fa-compress");
      } else {
        icon.classList.remove("fa-compress");
        icon.classList.add("fa-expand");
      }
    });
  }
})();
