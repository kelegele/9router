import { NextResponse } from "next/server";
import { spawn } from "child_process";

function hasDocker() {
  return new Promise((resolve) => {
    const child = spawn("docker", ["--version"], { stdio: "ignore", timeout: 3000 });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

export async function POST() {
  try {
    const dockerAvailable = await hasDocker();

    if (!dockerAvailable) {
      return NextResponse.json({
        success: false,
        message: "Docker is not available inside the container. Mount /var/run/docker.sock and install docker-cli to enable Docker-based updates.",
      });
    }

    // Spawn detached docker pull — the restart cannot run in-process because
    // docker stop would kill this container, so we return the pull result and
    // let the frontend call /api/version/shutdown after the user confirms.
    const pull = spawn("docker", ["pull", "decolua/9router:latest"], {
      detached: true,
      stdio: "pipe",
    });

    let output = "";
    let errorOutput = "";

    pull.stdout.on("data", (buf) => { output += buf.toString(); });
    pull.stderr.on("data", (buf) => { errorOutput += buf.toString(); });

    return new Promise((resolve) => {
      pull.on("close", (code) => {
        if (code === 0) {
          resolve(NextResponse.json({
            success: true,
            message: "Image pulled successfully. Run docker stop 9router && docker rm 9router && docker run -d --name 9router --restart unless-stopped -p 20128:20128 --env-file .env -v 9router-data:/app/data decolua/9router:latest",
            output: output.slice(-1000),
          }));
        } else {
          resolve(NextResponse.json({
            success: false,
            message: "Docker pull failed. Check output for details.",
            output: (errorOutput || output).slice(-1000),
          }));
        }
      });

      pull.on("error", (e) => {
        resolve(NextResponse.json({
          success: false,
          message: `Failed to start docker pull: ${e.message}`,
        }));
      });
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
