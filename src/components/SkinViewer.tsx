"use client";

import { useEffect, useRef } from "react";

export default function SkinViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let viewer: any = null;

    const initViewer = async () => {
      const canvas = canvasRef.current;
      const status = statusRef.current;
      if (!canvas || !status) return;

      const skinview3d = await import("skinview3d");
      const skinPath = "/skin.png";

      const skinImage = new Image();
      skinImage.onload = () => {
        viewer = new skinview3d.SkinViewer({
          canvas,
          width: 320,
          height: 380,
          skin: skinPath,
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
          headX: 0.02,
        };

        const target = { ...basePose };
        const current = { ...basePose };

        const clamp = (value: number, min: number, max: number) =>
          Math.min(Math.max(value, min), max);

        const shell = canvas.parentElement!;

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

        function updateTargetFromPointer(clientX: number, clientY: number) {
          const rect = canvas!.getBoundingClientRect();
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

          animationFrameRef.current = requestAnimationFrame(animateModel);
        }

        shell.addEventListener("mousemove", (event: MouseEvent) => {
          updateTargetFromPointer(event.clientX, event.clientY);
        });
        shell.addEventListener("mouseleave", resetTarget);
        shell.addEventListener(
          "touchmove",
          (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touch) return;
            updateTargetFromPointer(touch.clientX, touch.clientY);
          },
          { passive: true }
        );
        shell.addEventListener("touchend", resetTarget);

        resizeViewer();
        window.addEventListener("resize", resizeViewer);

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animateModel();
        status.hidden = true;
      };

      skinImage.onerror = () => {
        if (status) {
          status.textContent =
            "Add skin.png to the public folder to show your 3D Minecraft player model.";
          status.hidden = false;
        }
      };

      skinImage.src = skinPath;
    };

    initViewer();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div id="viewer" className="card viewer-card">
      <div className="viewer-shell">
        <canvas
          ref={canvasRef}
          id="skin-viewer"
          aria-label="3D Minecraft skin viewer"
        ></canvas>
        <p ref={statusRef} id="viewer-status" className="viewer-status">
          Loading 3D player model...
        </p>
      </div>
    </div>
  );
}
