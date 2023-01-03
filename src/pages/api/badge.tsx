import { NextRequest } from "next/server";
import satori from "satori";

export const config = {
  runtime: "edge",
};

const font = fetch(new URL("../../assets/Roboto-Regular-subset.ttf", import.meta.url)).then((res) => res.arrayBuffer());

export default async function badge(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fontData = await font;

  const hasLabel = searchParams.has("label");
  const label = hasLabel ? searchParams.get("label")?.slice(0, 20) : "unknown";
  const hasMessage = searchParams.has("message");
  const message = hasMessage ? searchParams.get("message")?.slice(0, 20) : "unknown";

  if (!hasLabel && !hasLabel) {
    return new Response("Failed to generate the image", {
      status: 400,
    });
  }

  const svg = await satori(
    <div
      style={{
        borderRadius: "4px",
        color: "#fff",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div style={{ backgroundColor: "#000", padding: "4px 8px" }}>{label}</div>
      <div style={{ backgroundColor: "#6fc93f", padding: "4px 8px" }}>{message}</div>
    </div>,
    {
      height: 27,
      fonts: [
        {
          name: "Roboto",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
    status: 200,
  });
}
