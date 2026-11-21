const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  function getJSON(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const list = await getJSON('http://127.0.0.1:9222/json/list');
  const target = list.find(t => t.type === 'page');
  const wsUrl = target.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let id = 1;
  const pending = new Map();
  const consoleLogs = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description).join(' ') });
    }
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  function sendCmd(method, params = {}) {
    return new Promise(resolve => {
      const curId = id++;
      pending.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.onopen = async () => {
    await sendCmd('Runtime.enable');
    await sendCmd('Page.enable');
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/#s4' });
  };

  await new Promise(r => setTimeout(r, 3000));

  // Scroll directly to scene 4
  await sendCmd('Runtime.evaluate', {
    expression: 'document.getElementById("s4").scrollIntoView()'
  });

  await new Promise(r => setTimeout(r, 1500));

  // Check initial scene 4 say text
  const sceneText = await sendCmd('Runtime.evaluate', {
    expression: `(() => {
      const say = document.querySelector("#s4 .say");
      const role = document.getElementById("role");
      const key = document.getElementById("insKey");
      const sub = document.querySelector("#s4 .muted");
      return {
        sub: sub ? sub.textContent : null,
        say: say ? say.textContent.trim() : null,
        role: role ? role.textContent : null,
        keyVisible: key ? !key.hidden : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Scene 4 initial state:', JSON.stringify(sceneText.result.value, null, 2));

  // Click INSERT multiple times and record role text
  const words = [];
  for (let i = 0; i < 11; i++) {
    await sendCmd('Runtime.evaluate', {
      expression: 'document.getElementById("insKey").click()'
    });
    // Wait for flicker animation to settle
    await new Promise(r => setTimeout(r, 800));

    const roleVal = await sendCmd('Runtime.evaluate', {
      expression: 'document.getElementById("role").textContent',
      returnByValue: true
    });
    words.push(roleVal.result.value);
    console.log('Click ' + (i + 1) + ':', roleVal.result.value);
  }

  // Screenshot after cycles
  const shot = await sendCmd('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/onkarbhople/.gemini/antigravity/brain/51818a2e-ef68-4503-911a-ad7b50d1ec04/scene4_insert_live.png', Buffer.from(shot.data, 'base64'));

  // Console error check
  const errors = consoleLogs.filter(l => l.type === 'error');
  console.log('Errors count:', errors.length);
  if (errors.length) console.log('Errors:', errors);

  ws.close();
  chrome.kill();
}

test().catch(console.error);
