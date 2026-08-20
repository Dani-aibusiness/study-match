import { NextRequest, NextResponse } from "next/server";
import { classifySubmission } from "@/lib/classify";
import { suggestTutorType } from "@/lib/suggestTutorType";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, imageBase64, imageMediaType } = body as {
      text?: string;
      imageBase64?: string;
      imageMediaType?: string;
    };

    if (!text?.trim() && !imageBase64) {
      return NextResponse.json(
        { error: "Provide either a text description or an image." },
        { status: 400 }
      );
    }

    const classification = await classifySubmission({
      text,
      imageBase64,
      imageMediaType,
    });

    const tutorSuggestion = suggestTutorType(classification.subject);

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        raw_text: text ?? null,
        subject: classification.subject,
        topic: classification.topic,
        level: classification.level,
        urgency: classification.urgency,
        summary: classification.summary,
        suggested_tutor_label: tutorSuggestion.label,
        suggested_tutor_description: tutorSuggestion.description,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submission: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
