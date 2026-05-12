import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ASSISTANT_TOOLS, executeTool } from "@/lib/assistant";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  // Authenticate
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 400 });
  }

  const body = await req.json();
  const messages: MessageParam[] = body.messages ?? [];

  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const systemPrompt = `You are an intelligent scheduling secretary for ${business.name}. Today is ${dateStr}.

You help the owner manage their appointments, clients, and services through natural conversation.
Be concise and friendly. When scheduling an appointment, always confirm the details (client, service, date/time) before calling create_appointment.
If a client or service isn't found, ask for clarification or offer to create a new client.
Format dates and times in a human-friendly way when reporting back to the user.
When listing appointments, organize them clearly.`;

  // Agentic loop
  const loopMessages: MessageParam[] = [...messages];
  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          // @ts-expect-error - cache_control is valid but not in all type defs
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: ASSISTANT_TOOLS.map((t, i) =>
        i === ASSISTANT_TOOLS.length - 1
          ? // @ts-expect-error - cache_control on last tool caches the stable prefix
            { ...t, cache_control: { type: "ephemeral" } }
          : t,
      ),
      messages: loopMessages,
    });

    // Append assistant response
    loopMessages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      const text = textBlock?.type === "text" ? textBlock.text : "";
      return NextResponse.json({ message: text });
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        const result = await executeTool(
          block.name,
          block.input as Record<string, unknown>,
          business.id,
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: typeof result === "string" ? result : JSON.stringify(result),
        });
      }

      loopMessages.push({ role: "user", content: toolResults });
      continue;
    }

    // Unexpected stop reason
    break;
  }

  return NextResponse.json({ message: "I'm sorry, I couldn't complete that request. Please try again." });
}
