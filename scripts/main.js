(() => {
    const siteHeader = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const nav = siteHeader?.querySelector("nav");
    const mobileBreakpoint = 768;

    function closeNav() {
        if (!siteHeader || !navToggle) {
            return;
        }

        siteHeader.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    function toggleNav() {
        if (!siteHeader || !navToggle) {
            return;
        }

        const isOpen = siteHeader.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", toggleNav);

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= mobileBreakpoint) {
                    closeNav();
                }
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > mobileBreakpoint) {
                closeNav();
            }
        });
    }

    const canvas = document.getElementById("skin-viewer");
    const status = document.getElementById("viewer-status");
    const skinPath = "./skin.png";
    let animationFrameId = null;

    if (!canvas || !status || typeof skinview3d === "undefined") {
        return;
    }

    function setStatus(message) {
        status.textContent = message;
        status.hidden = false;
    }

    function hideStatus() {
        status.hidden = true;
    }

    const skinImage = new Image();
    skinImage.onload = () => {
        const viewer = new skinview3d.SkinViewer({
            canvas,
            width: 320,
            height: 380,
            skin: skinPath
        });

        viewer.fov = 45;
        viewer.camera.position.set(2.5, -2, 30);
        viewer.camera.lookAt(0, -0.5, 0);
        viewer.playerObject.position.y = -7.5;
        viewer.animation = null;
        viewer.autoRotate = false;
        viewer.controls.enableZoom = false;
        viewer.controls.enablePan = false;
        viewer.controls.enableRotate = false;

        const basePose = {
            bodyY: -0.16,
            headY: -0.08,
            headX: 0.02
        };

        const target = {
            bodyY: basePose.bodyY,
            headY: basePose.headY,
            headX: basePose.headX
        };

        const current = {
            bodyY: basePose.bodyY,
            headY: basePose.headY,
            headX: basePose.headX
        };

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const shell = canvas.parentElement;

        function resizeViewer() {
            const rect = shell.getBoundingClientRect();
            const width = Math.max(1, Math.round(rect.width));
            const height = Math.max(1, Math.round(rect.height));

            viewer.width = width;
            viewer.height = height;

            if (typeof viewer.setSize === "function") {
                viewer.setSize(width, height);
            }
        }

        function updateTargetFromPointer(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((clientY - rect.top) / rect.height) * 2 - 1;

            target.bodyY = clamp(basePose.bodyY + x * 0.22, -0.35, 0.2);
            target.headY = clamp(basePose.headY + x * 0.55, -0.85, 0.55);
            target.headX = clamp(basePose.headX + y * 0.32, -0.3, 0.35);
        }

        function resetTarget() {
            target.bodyY = basePose.bodyY;
            target.headY = basePose.headY;
            target.headX = basePose.headX;
        }

        function animateModel() {
            current.bodyY += (target.bodyY - current.bodyY) * 0.12;
            current.headY += (target.headY - current.headY) * 0.16;
            current.headX += (target.headX - current.headX) * 0.16;

            viewer.playerObject.rotation.y = current.bodyY;
            viewer.playerObject.skin.head.rotation.y = current.headY;
            viewer.playerObject.skin.head.rotation.x = current.headX;

            animationFrameId = requestAnimationFrame(animateModel);
        }

        shell.addEventListener("mousemove", (event) => {
            updateTargetFromPointer(event.clientX, event.clientY);
        });

        shell.addEventListener("mouseleave", resetTarget);
        shell.addEventListener("touchmove", (event) => {
            const touch = event.touches[0];
            if (!touch) {
                return;
            }

            updateTargetFromPointer(touch.clientX, touch.clientY);
        }, { passive: true });
        shell.addEventListener("touchend", resetTarget);

        resizeViewer();
        window.addEventListener("resize", resizeViewer);

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        animateModel();
        hideStatus();
    };

    skinImage.onerror = () => {
        setStatus("Add skin.png to the site root to show your 3D Minecraft player model.");
    };

    skinImage.src = skinPath;
})();
