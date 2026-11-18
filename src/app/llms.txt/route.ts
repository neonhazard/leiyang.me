import {
  SITE_URL,
  PERSON_NAME,
  PERSON_SUMMARY,
  PERSON_EMAIL,
  PERSON_LOCALITY,
  CURRENT_ROLE,
  SHIPPED_TITLES,
  UNCREDITED_TITLES,
  SAME_AS,
} from "@/constants/site";

// Plain-text profile for AI assistants and agents (https://llmstxt.org).

export const dynamic = "force-static";

export function GET() {
  const current = [CURRENT_ROLE.studio, CURRENT_ROLE.org].filter(Boolean).join(", ");

  const body = `# ${PERSON_NAME}

> ${PERSON_SUMMARY}

## Quick facts

- Name: ${PERSON_NAME}
- Role: ${CURRENT_ROLE.title}
- Employer: ${current} (since ${CURRENT_ROLE.since})
- Previously: Lead AI Animator at Infinity Ward (Activision), 2021–2025, on Call of Duty: Modern Warfare II, Modern Warfare III, and Modern Warfare 4 — owned animation systems for all soldier and civilian NPCs, redesigned the AI combat and reaction loop, directed mocap shoots, led a team of 5 animators across Los Angeles and Poland
- Earlier: Senior Animator at Infinity Ward, 2004–2015 — AI, cinematic, and vehicle animation; led the animation of Riley the dog (Call of Duty: Ghosts); snowmobile animation (Modern Warfare 2); the level "The Coup" (Call of Duty 4: Modern Warfare); the Pointe du Hoc beach assault for the Call of Duty 2 E3 showcase
- Also: Contract Lead Animator at Rogue Initiative Studio (2019–2021), co-founder of Superfine Games (2017–2019), VFX supervisor on the film "Guns and Kidneys" (2016–2017)
- Specialties: gameplay animation, NPC animation systems, motion capture direction, rigging, animation pipelines, AI-assisted animation tools
- Tools: Maya, MEL scripting, MotionBuilder, game engines
- Based in: ${PERSON_LOCALITY}, California
- Contact: ${PERSON_EMAIL}

## Shipped Call of Duty titles

${SHIPPED_TITLES.map((t) => `- ${t.name} (${t.year})`).join("\n")}

Also worked on (uncredited):
${UNCREDITED_TITLES.map((t) => `- ${t.name} (${t.year})`).join("\n")}

## Pages

- [Home](${SITE_URL}): overview, selected work, contact
- [Resume](${SITE_URL}/resume): full work history
- [Game animation reel](${SITE_URL}/portfolio/game-animation): Call of Duty animation work (video is password-protected)
- [2D drawings](${SITE_URL}/portfolio/drawings): life drawing and studies
- [Resume PDF](${SITE_URL}/documents/Lei_Yang_resume.pdf)

## Profiles

${SAME_AS.map((u) => `- ${u}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
