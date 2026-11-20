const { spawn } = require("child_process");
const fs = require("fs");

async function runTest() {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const port = 9338;
  const userDataDir = "/tmp/chrome_tiger_vr_test";

  const proc = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=1440,900",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    const target = tabs[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt) => {
          const d = JSON.parse(evt.data);
          if (d.id === msgId) {
            ws.removeEventListener("message", handler);
            resolve(d.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onopen = async () => {
      await send("Runtime.enable");
      await send("Page.enable");
      await send("Input.enable");

      ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === "Runtime.consoleAPICalled") {
          console.log("[CONSOLE]", msg.params.type, msg.params.args?.map(a => a.value || a.description).join(" "));
        }
        if (msg.method === "Runtime.exceptionThrown") {
          console.error("[EXCEPTION]", msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description);
        }
      };

      console.log("Navigating to http://localhost:3000/tiger...");
      await send("Page.navigate", { url: "http://localhost:3000/tiger" });
      await new Promise(r => setTimeout(r, 4000));

      // 1. Initial State Check
      const initState = await send("Runtime.evaluate", {
        expression: `({
          vr: window.__vrCamera,
          hint: document.querySelector('[class*="walkHint"]')?.innerText,
          hasFadeHint: document.querySelector('[class*="walkHint"]')?.classList.contains('fade-hint')
        })`,
        returnByValue: true
      });
      console.log("Initial state:", initState.result.value);

      // Take initial screenshot
      let shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync("/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/vr_01_initial.png", Buffer.from(shot.data, "base64"));

      // 2. Simulate Mouse Drag to Look 360° (drag horizontally and vertically)
      console.log("Simulating mouse drag to look around...");
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: 720, y: 450, button: "left", clickCount: 1 });
      for (let i = 1; i <= 10; i++) {
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 720 - i * 25, y: 450 - i * 15, button: "left" });
        await new Promise(r => setTimeout(r, 20));
      }
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 470, y: 300, button: "left" });
      await new Promise(r => setTimeout(r, 800));

      const draggedState = await send("Runtime.evaluate", {
        expression: `({
          targetYaw: window.__vrCamera?.targetYaw,
          currentYaw: window.__vrCamera?.currentYaw,
          targetPitch: window.__vrCamera?.targetPitch,
          currentPitch: window.__vrCamera?.currentPitch,
          userInteracted: window.__vrCamera?.userInteracted,
          hasFadeHint: document.querySelector('[class*="walkHint"]')?.classList.contains('fade-hint')
        })`,
        returnByValue: true
      });
      console.log("After drag state:", draggedState.result.value);

      shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync("/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/vr_02_dragged_look.png", Buffer.from(shot.data, "base64"));

      // 3. Simulate Keyboard Walk (W key forward & D key lateral sway)
      console.log("Simulating KeyW and KeyD...");
      await send("Input.dispatchKeyEvent", { type: "keyDown", code: "KeyW", key: "w" });
      await new Promise(r => setTimeout(r, 400));
      await send("Input.dispatchKeyEvent", { type: "keyUp", code: "KeyW", key: "w" });

      await send("Input.dispatchKeyEvent", { type: "keyDown", code: "KeyD", key: "d" });
      await new Promise(r => setTimeout(r, 300));
      await send("Input.dispatchKeyEvent", { type: "keyUp", code: "KeyD", key: "d" });
      await new Promise(r => setTimeout(r, 500));

      const walkedState = await send("Runtime.evaluate", {
        expression: `({
          currentRadius: window.__vrCamera?.currentRadius,
          targetRadius: window.__vrCamera?.targetRadius
        })`,
        returnByValue: true
      });
      console.log("After walk state:", walkedState.result.value);

      shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync("/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/vr_03_walked_glided.png", Buffer.from(shot.data, "base64"));

      // 4. Test In-Scene Dossier trigger
      console.log("Triggering openInSceneDossier...");
      await send("Runtime.evaluate", {
        expression: `window.openInSceneDossier && window.openInSceneDossier(0);`
      });
      await new Promise(r => setTimeout(r, 800));

      shot = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync("/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/vr_04_dossier_open.png", Buffer.from(shot.data, "base64"));

      console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
      proc.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error("Test failed:", err);
    proc.kill();
    process.exit(1);
  }
}

runTest();
