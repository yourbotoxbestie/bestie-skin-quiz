import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: "name",
    type: "text",
    label: "Let's start with your name",
    subtitle: "We keep things personal at Bestie Beauty Bar.",
    placeholder: "Your first name",
    section: "intro",
  },
  {
    id: "age",
    type: "single",
    label: "What's your age range?",
    subtitle: "Skin changes at every stage — knowing yours helps us recommend the right plan.",
    section: "intro",
    options: [
      { value: "18-25", label: "18–25", emoji: "🌱", desc: "Prevention & foundation" },
      { value: "26-35", label: "26–35", emoji: "🌸", desc: "Early intervention" },
      { value: "36-45", label: "36–45", emoji: "✨", desc: "Correction & maintenance" },
      { value: "46-55", label: "46–55", emoji: "💎", desc: "Restoration & rejuvenation" },
      { value: "56+", label: "56+", emoji: "👑", desc: "Advanced renewal" },
    ],
  },
  {
    id: "fitzpatrick",
    type: "single",
    label: "How does your skin respond to sun exposure?",
    subtitle: "This helps us determine your skin's sensitivity and guides treatment selection.",
    section: "skin_profile",
    options: [
      { value: "1", label: "Always burns, never tans", desc: "Very fair, freckles easily" },
      { value: "2", label: "Burns easily, tans minimally", desc: "Fair skin" },
      { value: "3", label: "Burns moderately, tans gradually", desc: "Medium skin" },
      { value: "4", label: "Burns minimally, tans easily", desc: "Olive / light brown skin" },
      { value: "5", label: "Rarely burns, tans deeply", desc: "Brown skin" },
      { value: "6", label: "Never burns", desc: "Deep brown / dark skin" },
    ],
  },
  {
    id: "skin_type",
    type: "single",
    label: "What's your skin type?",
    subtitle: "Think about how your skin typically feels by midday.",
    section: "skin_profile",
    options: [
      { value: "dry", label: "Dry", desc: "Tight, rough, may flake or feel uncomfortable" },
      { value: "oily", label: "Oily", desc: "Shiny by midday, visible pores, prone to congestion" },
      { value: "combo", label: "Combination", desc: "Oily through the T-zone, dry or normal on cheeks" },
      { value: "sensitive", label: "Sensitive / Reactive", desc: "Easily irritated, redness-prone, stings with products" },
      { value: "normal", label: "Normal / Balanced", desc: "Comfortable, minimal issues, even texture" },
      { value: "unsure", label: "Not sure — help me figure it out", desc: "We'll assess this together at your visit" },
    ],
  },
  {
    id: "skin_quality",
    type: "multi",
    label: "How would you rate your overall skin quality right now?",
    subtitle: "Select everything that resonates. Be honest — this is a judgment-free zone.",
    section: "skin_profile",
    options: [
      { value: "dull", label: "Dull — lacking radiance or glow", funnel: ["facial", "peel", "peptide_serum"] },
      { value: "rough", label: "Rough texture — uneven, bumpy, or grainy", funnel: ["facial", "microneedling", "peel", "peptide_serum"] },
      { value: "dehydrated", label: "Dehydrated — tight even when moisturized", funnel: ["facial", "peptide_serum", "moisturizer"] },
      { value: "congested", label: "Congested — clogged pores, blackheads, milia", funnel: ["facial", "peel"] },
      { value: "uneven_tone", label: "Uneven tone — dark spots, sun damage, discoloration", funnel: ["facial", "peel", "peptide_serum", "microneedling"] },
      { value: "thin", label: "Thin or fragile — bruises easily, veins visible", funnel: ["peptide_serum", "biostimulator"] },
      { value: "lax", label: "Lax / loose — skin doesn't bounce back like it used to", funnel: ["biostimulator", "microneedling", "peptide_serum"] },
      { value: "generally_good", label: "Generally good — just want to maintain and optimize", funnel: ["facial", "peptide_serum", "retail"] },
    ],
  },
  {
    id: "upper_face",
    type: "multi",
    label: "Upper Face: What do you notice?",
    subtitle: "Forehead, brow area, and around the eyes — the area that shows expression and fatigue first.",
    section: "aging_zones",
    sectionLabel: "Facial Aging Assessment",
    options: [
      { value: "forehead_lines", label: "Horizontal forehead lines", desc: "Lines across your forehead, visible at rest or with expression", funnel: ["neurotoxin"] },
      { value: "11_lines", label: "Frown lines (the \"11s\")", desc: "Vertical lines between your brows", funnel: ["neurotoxin"] },
      { value: "brow_droop", label: "Brow heaviness or drooping", desc: "Brows sitting lower than they used to, hooded appearance", funnel: ["neurotoxin", "filler"] },
      { value: "crows_feet", label: "Crow's feet", desc: "Lines fanning from the outer corners of your eyes", funnel: ["neurotoxin", "peptide_eye"] },
      { value: "under_eye_hollow", label: "Under-eye hollows or dark circles", desc: "Sunken, shadowed, or tired-looking under-eye area", funnel: ["filler", "peptide_eye"] },
      { value: "under_eye_texture", label: "Crepey or textured under-eye skin", desc: "Fine lines, crepe-paper texture under the eyes", funnel: ["peptide_eye", "peptide_serum", "microneedling"] },
      { value: "upper_none", label: "No concerns here", funnel: [] },
    ],
  },
  {
    id: "mid_face",
    type: "multi",
    label: "Mid Face: What do you notice?",
    subtitle: "Cheeks, nose, and the area around your mouth — where volume and structure tell the story.",
    section: "aging_zones",
    options: [
      { value: "flat_cheeks", label: "Flat or deflated cheeks", desc: "Lost fullness or roundness in the cheek area", funnel: ["filler", "biostimulator"] },
      { value: "nasolabial", label: "Nasolabial folds (smile lines)", desc: "Deep lines running from nose to mouth corners", funnel: ["filler", "biostimulator"] },
      { value: "nose_pores", label: "Enlarged pores across nose and cheeks", desc: "Visible, enlarged pores in the central face", funnel: ["facial", "peel", "microneedling"] },
      { value: "redness_rosacea", label: "Redness or rosacea", desc: "Persistent flushing, visible capillaries, or rosacea", funnel: ["facial", "peptide_serum"] },
      { value: "melasma", label: "Melasma or sun spots", desc: "Patchy brown discoloration, especially on cheeks", funnel: ["peel", "peptide_serum"] },
      { value: "acne_scarring", label: "Acne scarring", desc: "Pitted, raised, or discolored scars from past breakouts", funnel: ["microneedling", "peel"] },
      { value: "mid_none", label: "No concerns here", funnel: [] },
    ],
  },
  {
    id: "lower_face",
    type: "multi",
    label: "Lower Face & Neck: What do you notice?",
    subtitle: "Lips, jawline, chin, and neck — where gravity and volume loss show up over time.",
    section: "aging_zones",
    options: [
      { value: "lip_lines", label: "Lip lines (smoker's lines)", desc: "Vertical lines above and around the lips", funnel: ["neurotoxin", "filler"] },
      { value: "thin_lips", label: "Thin or deflated lips", desc: "Lips have lost volume, shape, or definition", funnel: ["filler"] },
      { value: "marionette", label: "Marionette lines", desc: "Lines running from mouth corners down toward the chin", funnel: ["filler", "biostimulator"] },
      { value: "jowls", label: "Jowling or sagging jawline", desc: "Loss of definition along the jaw, skin drooping", funnel: ["filler", "biostimulator"] },
      { value: "double_chin", label: "Submental fullness (double chin)", desc: "Fullness or heaviness under the chin", funnel: ["biostimulator"] },
      { value: "neck_lines", label: "Neck lines or bands", desc: "Horizontal lines, vertical bands, or crepey neck skin", funnel: ["neurotoxin", "peptide_serum", "microneedling"] },
      { value: "chin_texture", label: "Chin dimpling (\"pebble chin\")", desc: "Textured, dimpled appearance on the chin", funnel: ["neurotoxin"] },
      { value: "lower_none", label: "No concerns here", funnel: [] },
    ],
  },
  {
    id: "hair_scalp",
    type: "single",
    label: "Are you experiencing any hair or scalp concerns?",
    subtitle: "Peptide therapy can support hair health too — it's not just for skin.",
    section: "additional",
    sectionLabel: "Beyond the Face",
    options: [
      { value: "thinning", label: "Yes — hair thinning or shedding", funnel: ["peptide_hair"] },
      { value: "scalp", label: "Yes — dry or irritated scalp", funnel: ["peptide_hair"] },
      { value: "both", label: "Yes — both thinning and scalp issues", funnel: ["peptide_hair"] },
      { value: "no", label: "No hair or scalp concerns" },
    ],
  },
  {
    id: "lifestyle",
    type: "multi",
    label: "Which lifestyle factors apply to you?",
    subtitle: "These directly impact how your skin ages. No judgment — just data for better recommendations.",
    section: "lifestyle",
    sectionLabel: "Lifestyle Factors",
    options: [
      { value: "sun", label: "☀️ Significant past or current sun exposure" },
      { value: "smoking", label: "🚬 Current or former smoker" },
      { value: "sleep", label: "😴 Poor or inconsistent sleep" },
      { value: "stress", label: "😰 High stress levels" },
      { value: "water", label: "💧 Low water intake" },
      { value: "diet", label: "🍕 Diet high in sugar or processed food" },
      { value: "screen", label: "📱 High screen time (blue light exposure)" },
      { value: "none", label: "✅ None of the above" },
    ],
  },
  {
    id: "skincare_routine",
    type: "single",
    label: "What does your current skincare routine look like?",
    subtitle: "We'll build on what you have — or start fresh if you need it.",
    section: "routine",
    sectionLabel: "Your Current Routine",
    options: [
      { value: "none", label: "Basically nothing", desc: "Water and maybe moisturizer on a good day" },
      { value: "minimal", label: "Cleanser + moisturizer", desc: "The basics but nothing targeted" },
      { value: "basic", label: "Cleanser, moisturizer, SPF", desc: "The essentials are covered" },
      { value: "moderate", label: "Multi-step with serums", desc: "Active ingredients, multiple products, semi-consistent" },
      { value: "advanced", label: "Full protocol with actives", desc: "Retinol, peptides, acids — I'm into it" },
      { value: "overwhelmed", label: "Too many products, no idea what works", desc: "Help me simplify" },
    ],
  },
  {
    id: "spf",
    type: "single",
    label: "How consistent are you with SPF?",
    subtitle: "Honest answers only. SPF is the single most important anti-aging product.",
    section: "routine",
    options: [
      { value: "daily", label: "Daily — rain or shine ☀️" },
      { value: "mostly", label: "Most days, but I forget sometimes" },
      { value: "sometimes", label: "Only when I'll be outside" },
      { value: "rarely", label: "Rarely or never" },
    ],
  },
  {
    id: "experience",
    type: "multi",
    label: "Which treatments have you had before?",
    subtitle: "This helps us know your comfort level and where to build from.",
    section: "history",
    sectionLabel: "Treatment History",
    options: [
      { value: "botox", label: "Neurotoxins (Botox, Dysport, Xeomin)" },
      { value: "filler", label: "Dermal fillers" },
      { value: "facial", label: "Professional facials" },
      { value: "peel", label: "Chemical peels" },
      { value: "microneedling", label: "Microneedling" },
      { value: "laser", label: "Laser treatments" },
      { value: "peptides", label: "Peptide skincare or therapy" },
      { value: "none", label: "This would be my first professional treatment" },
    ],
  },
  {
    id: "weight_goal",
    type: "single",
    label: "Are you interested in medical weight management?",
    subtitle: "We offer supervised semaglutide programs for clients who qualify.",
    section: "wellness",
    sectionLabel: "Wellness",
    options: [
      { value: "yes", label: "Yes — I'd like to learn more", funnel: ["semaglutide"] },
      { value: "maybe", label: "Maybe — tell me about it at my visit", funnel: ["semaglutide"] },
      { value: "no", label: "No — not at this time" },
    ],
  },
  {
    id: "priorities",
    type: "rank",
    label: "What matters most to you right now?",
    subtitle: "Pick your top priority — this shapes what we recommend first.",
    section: "goals",
    sectionLabel: "Your Goals",
    options: [
      { value: "prevent", label: "🛡️ Prevent aging before it starts" },
      { value: "correct", label: "🔧 Correct what I'm already seeing" },
      { value: "maintain", label: "🔄 Maintain results I already have" },
      { value: "glow", label: "✨ Just want to glow and feel amazing" },
      { value: "event", label: "📅 Prepping for a specific event" },
      { value: "routine", label: "🧴 Build a better skincare routine" },
    ],
  },
  {
    id: "budget",
    type: "single",
    label: "What's your comfort level for monthly investment in yourself?",
    subtitle: "We have options at every level. This just helps us personalize the plan.",
    section: "goals",
    options: [
      { value: "low", label: "Under $150/month", desc: "Skincare + occasional treatments" },
      { value: "mid", label: "$150–$350/month", desc: "Regular treatments + home care" },
      { value: "high", label: "$350–$600/month", desc: "Comprehensive aesthetic plan" },
      { value: "premium", label: "$600+/month", desc: "Full concierge experience" },
    ],
  },
  {
    id: "contact",
    type: "single",
    label: "How should we send your skin analysis results?",
    subtitle: "We'll follow up with your personalized treatment plan — no spam, ever.",
    section: "contact",
    sectionLabel: "Stay Connected",
    options: [
      { value: "text", label: "Text me 📱" },
      { value: "email", label: "Email me 📧" },
      { value: "call", label: "Call me 📞" },
      { value: "in_person", label: "I'll discuss in person at my appointment" },
    ],
  },
  {
    id: "email",
    type: "text",
    label: "What's your email address?",
    subtitle: "We'll send your full skin report here.",
    placeholder: "your@email.com",
    section: "contact",
  },
  {
    id: "phone",
    type: "text",
    label: "What's your phone number?",
    subtitle: "For appointment confirmations and your personalized plan.",
    placeholder: "(555) 555-5555",
    section: "contact",
  },
];

const SERVICE_MAP = {
  neurotoxin: { name: "Neurotoxin Treatment", desc: "Botox, Dysport, or Xeomin to relax dynamic lines and prevent new ones from forming", entity: "medical", icon: "💉", zone: "treatment" },
  filler: { name: "Dermal Fillers", desc: "Hyaluronic acid fillers to restore volume, contour, and smooth deep folds", entity: "medical", icon: "✨", zone: "treatment" },
  biostimulator: { name: "Biostimulators", desc: "Sculptra or Radiesse to rebuild your skin's own collagen framework over time", entity: "medical", icon: "🔬", zone: "treatment" },
  microneedling: { name: "Medical Microneedling", desc: "Controlled micro-injuries to trigger collagen remodeling for texture, scars, and firmness", entity: "medical", icon: "🪡", zone: "treatment" },
  semaglutide: { name: "Medical Weight Management", desc: "Semaglutide program with clinical monitoring and ongoing support", entity: "medical", icon: "⚖️", zone: "wellness" },
  facial: { name: "Bestie Signature Facial", desc: "Customized facial with peptide serum application — our most popular service", entity: "bbb", icon: "🧖‍♀️", zone: "treatment" },
  peel: { name: "Chemical Peel", desc: "Professional-grade exfoliation for texture, tone, congestion, and clarity", entity: "bbb", icon: "🌟", zone: "treatment" },
  peptide_serum: { name: "GHK-Cu Peptide Serum", desc: "Copper peptide serum that supports collagen production, firmness, and radiance", entity: "bbb", icon: "💧", zone: "product" },
  peptide_eye: { name: "Peptide Eye Complex", desc: "Targeted formula for dark circles, puffiness, crepiness, and fine lines around the eyes", entity: "bbb", icon: "👁️", zone: "product" },
  peptide_hair: { name: "Peptide Hair & Scalp Serum", desc: "GHK-Cu copper peptides to support fuller, healthier-looking hair", entity: "bbb", icon: "💇‍♀️", zone: "product" },
  moisturizer: { name: "Barrier Repair Moisturizer", desc: "Peptide-infused hydration that strengthens and locks in your treatment results", entity: "bbb", icon: "🧴", zone: "product" },
  membership_glow: { name: "Glow Getter Membership", desc: "Monthly facial + 10% off skincare retail + birthday perks", entity: "bbb", icon: "🌸", zone: "membership", price: "$99–$129/mo" },
  membership_vip: { name: "Bestie VIP Membership", desc: "Signature facial + peptide samples + 15% off retail + priority injectable booking", entity: "bbb", icon: "💎", zone: "membership", price: "$179–$229/mo" },
  membership_ultimate: { name: "Ultimate Bestie", desc: "Full injectable program + peptide protocol + concierge scheduling", entity: "both", icon: "👑", zone: "membership", price: "$799–$1,200/mo" },
  retail: { name: "Personalized Skincare Protocol", desc: "A curated peptide skincare routine built specifically for your skin's needs", entity: "bbb", icon: "🛍️", zone: "product" },
  full_protocol: { name: "Bestie Peptide Protocol", desc: "Complete 5-product system: cleanser, serum, eye complex, moisturizer, SPF", entity: "bbb", icon: "📋", zone: "product" },
};

const SECTION_LABELS = { intro: "About You", skin_profile: "Skin Profile", aging_zones: "Facial Aging Assessment", additional: "Beyond the Face", lifestyle: "Lifestyle Factors", routine: "Your Current Routine", history: "Treatment History", wellness: "Wellness", goals: "Your Goals", contact: "Stay Connected" };

function getRecommendations(answers) {
  const scores = {};
  const addScore = (key, pts) => { scores[key] = (scores[key] || 0) + pts; };
  ["skin_quality","upper_face","mid_face","lower_face","lifestyle","experience"].forEach(qId => {
    (answers[qId] || []).forEach(v => {
      const q = QUESTIONS.find(q => q.id === qId);
      const opt = q?.options.find(o => o.value === v);
      if (opt?.funnel) opt.funnel.forEach(s => addScore(s, 3));
    });
  });
  const hair = answers.hair_scalp;
  if (hair === "thinning" || hair === "scalp" || hair === "both") addScore("peptide_hair", 4);
  const wt = answers.weight_goal;
  if (wt === "yes") addScore("semaglutide", 5);
  if (wt === "maybe") addScore("semaglutide", 3);
  const age = answers.age;
  if (age === "18-25") { addScore("facial", 3); addScore("peel", 2); addScore("peptide_serum", 1); addScore("retail", 2); }
  if (age === "26-35") { addScore("neurotoxin", 2); addScore("facial", 2); addScore("peptide_serum", 2); }
  if (age === "36-45") { addScore("neurotoxin", 3); addScore("filler", 2); addScore("peptide_serum", 3); addScore("microneedling", 2); }
  if (age === "46-55") { addScore("filler", 3); addScore("biostimulator", 3); addScore("peptide_serum", 3); }
  if (age === "56+") { addScore("filler", 3); addScore("biostimulator", 4); addScore("peptide_serum", 3); addScore("full_protocol", 2); }
  const budget = answers.budget;
  if (budget === "low") { addScore("facial", 3); addScore("retail", 3); addScore("peptide_serum", 2); }
  if (budget === "mid") { addScore("membership_glow", 5); addScore("facial", 2); addScore("retail", 2); }
  if (budget === "high") { addScore("membership_vip", 5); addScore("neurotoxin", 2); addScore("peptide_serum", 3); }
  if (budget === "premium") { addScore("membership_ultimate", 6); addScore("filler", 3); addScore("full_protocol", 4); }
  const routine = answers.skincare_routine;
  if (routine === "none" || routine === "minimal") { addScore("retail", 4); addScore("peptide_serum", 3); }
  if (routine === "basic") { addScore("retail", 3); addScore("peptide_serum", 2); }
  if (routine === "overwhelmed") { addScore("facial", 3); addScore("retail", 3); }
  if (routine === "advanced") addScore("full_protocol", 3);
  const spf = answers.spf;
  if (spf === "rarely" || spf === "sometimes") addScore("retail", 2);
  const priority = answers.priorities;
  if (priority === "prevent") { addScore("neurotoxin", 2); addScore("peptide_serum", 3); addScore("facial", 2); }
  if (priority === "correct") { addScore("filler", 2); addScore("microneedling", 2); addScore("biostimulator", 2); }
  if (priority === "maintain") { addScore("membership_vip", 3); addScore("facial", 2); }
  if (priority === "glow") { addScore("facial", 4); addScore("peptide_serum", 3); addScore("peel", 2); }
  if (priority === "event") { addScore("neurotoxin", 3); addScore("facial", 3); addScore("filler", 2); }
  if (priority === "routine") { addScore("retail", 4); addScore("full_protocol", 3); addScore("peptide_serum", 2); }
  const lifestyle = answers.lifestyle || [];
  if (lifestyle.includes("sun")) { addScore("peptide_serum", 2); addScore("retail", 1); }
  if (lifestyle.includes("stress") || lifestyle.includes("sleep")) addScore("facial", 1);
  if (lifestyle.includes("smoking")) { addScore("peptide_serum", 2); addScore("microneedling", 1); }
  const exp = answers.experience || [];
  if (!exp.includes("botox") && !exp.includes("none")) addScore("neurotoxin", 1);
  if (!exp.includes("facial")) addScore("facial", 2);
  if (!exp.includes("peptides")) addScore("peptide_serum", 2);
  if (exp.includes("none")) { addScore("facial", 4); addScore("peptide_serum", 3); addScore("retail", 3); }
  addScore("facial", 1); addScore("peptide_serum", 1);
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([key]) => SERVICE_MAP[key]).slice(0, 10).map(([key, score]) => ({ key, score, ...SERVICE_MAP[key] }));
}

function getAgingSummary(answers) {
  const zones = [];
  const upper = answers.upper_face || [];
  const mid = answers.mid_face || [];
  const lower = answers.lower_face || [];
  const uLabels = { forehead_lines: "forehead lines", "11_lines": "frown lines", brow_droop: "brow heaviness", crows_feet: "crow's feet", under_eye_hollow: "under-eye hollows", under_eye_texture: "under-eye texture" };
  const mLabels = { flat_cheeks: "volume loss", nasolabial: "nasolabial folds", nose_pores: "enlarged pores", redness_rosacea: "redness", melasma: "discoloration", acne_scarring: "acne scarring" };
  const lLabels = { lip_lines: "lip lines", thin_lips: "thin lips", marionette: "marionette lines", jowls: "jowling", double_chin: "submental fullness", neck_lines: "neck lines/bands", chin_texture: "chin dimpling" };
  if (upper.length && !upper.includes("upper_none")) zones.push({ zone: "Upper Face", concerns: upper.map(v => uLabels[v]).filter(Boolean) });
  if (mid.length && !mid.includes("mid_none")) zones.push({ zone: "Mid Face", concerns: mid.map(v => mLabels[v]).filter(Boolean) });
  if (lower.length && !lower.includes("lower_none")) zones.push({ zone: "Lower Face & Neck", concerns: lower.map(v => lLabels[v]).filter(Boolean) });
  return zones;
}

function getSkinScore(answers) {
  let score = 85;
  const quality = answers.skin_quality || [];
  score -= quality.filter(v => v !== "generally_good").length * 5;
  const lifestyle = answers.lifestyle || [];
  score -= lifestyle.filter(v => v !== "none").length * 3;
  if (answers.spf === "rarely") score -= 8;
  if (answers.spf === "sometimes") score -= 4;
  if (answers.skincare_routine === "none") score -= 8;
  if (answers.skincare_routine === "minimal") score -= 4;
  if (answers.skincare_routine === "advanced") score += 5;
  return Math.max(20, Math.min(98, score));
}

function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (<div style={{ width: "100%", height: 4, background: "#f0e4ea", borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #d4548a, #c9a96e)", borderRadius: 2, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} /></div>);
}

function TextInput({ question, value, onChange, onNext }) {
  return (<input type="text" placeholder={question.placeholder} value={value || ""} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key === "Enter" && value && onNext()} autoFocus style={{ width: "100%", padding: "16px 20px", fontSize: 18, fontFamily: "'Cormorant Garamond', Georgia, serif", border: "2px solid #e8d5de", borderRadius: 12, outline: "none", background: "#fffbfd", color: "#2d2d2d", boxSizing: "border-box", transition: "border-color 0.3s" }} onFocus={e => e.target.style.borderColor = "#d4548a"} onBlur={e => e.target.style.borderColor = "#e8d5de"} />);
}

function SingleSelect({ question, value, onChange }) {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{question.options.map(opt => {
    const s = value === opt.value;
    return (<button key={opt.value} onClick={() => onChange(opt.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: s ? "2px solid #d4548a" : "2px solid #f0e4ea", borderRadius: 14, background: s ? "linear-gradient(135deg, #fdf0f5, #fce8f0)" : "#fffbfd", cursor: "pointer", textAlign: "left", transition: "all 0.25s ease", boxShadow: s ? "0 2px 12px rgba(212,84,138,0.15)" : "none" }}>
      {opt.emoji && <span style={{ fontSize: 20 }}>{opt.emoji}</span>}
      <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: s ? "#d4548a" : "#2d2d2d", fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</div>{opt.desc && <div style={{ fontSize: 12, color: "#8a7a80", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{opt.desc}</div>}</div>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: s ? "2px solid #d4548a" : "2px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#d4548a" }} />}</div>
    </button>);
  })}</div>);
}

function MultiSelect({ question, value = [], onChange }) {
  const toggle = (v) => {
    if (v.includes("none") || v === "upper_none" || v === "mid_none" || v === "lower_none") { onChange([v]); return; }
    const w = value.filter(x => !x.includes("none"));
    onChange(w.includes(v) ? w.filter(x => x !== v) : [...w, v]);
  };
  return (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{question.options.map(opt => {
    const s = value.includes(opt.value);
    return (<button key={opt.value} onClick={() => toggle(opt.value)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 14px", border: s ? "2px solid #d4548a" : "2px solid #f0e4ea", borderRadius: 12, background: s ? "linear-gradient(135deg, #fdf0f5, #fce8f0)" : "#fffbfd", cursor: "pointer", textAlign: "left", transition: "all 0.25s ease" }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, border: s ? "2px solid #d4548a" : "2px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, background: s ? "#d4548a" : "transparent", transition: "all 0.2s" }}>{s && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: s ? "#d4548a" : "#2d2d2d", fontWeight: s ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</div>{opt.desc && <div style={{ fontSize: 12, color: "#8a7a80", marginTop: 2, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{opt.desc}</div>}</div>
    </button>);
  })}</div>);
}

function ScoreRing({ score }) {
  const r = 54, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  const color = score >= 70 ? "#2E8B57" : score >= 50 ? "#D4890A" : "#CC3333";
  return (<div style={{ position: "relative", width: 140, height: 140 }}>
    <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}><circle cx="70" cy="70" r={r} fill="none" stroke="#f0e4ea" strokeWidth="8" /><circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} /></svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 36, fontWeight: 700, color, fontFamily: "'DM Sans', sans-serif" }}>{score}</span><span style={{ fontSize: 11, color: "#8a7a80", fontFamily: "'DM Sans', sans-serif", marginTop: -2 }}>out of 100</span></div>
  </div>);
}

function renderSection(title, items, titleColor) {
  return (<div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 8 }}>
      <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #e8d5de)" }} />
      <span style={{ fontSize: 11, letterSpacing: 2, color: titleColor, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #e8d5de, transparent)" }} />
    </div>
    {items.map((rec, i) => (<div key={rec.key} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 8, border: "1px solid #f0e4ea", boxShadow: "0 2px 8px rgba(212,84,138,0.06)", display: "flex", gap: 12, alignItems: "flex-start", animation: `fadeSlide 0.5s ease ${i * 0.08}s both` }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>{rec.icon}</span>
      <div><div style={{ fontSize: 15, fontWeight: 700, color: rec.entity === "bbb" || rec.entity === "both" ? "#d4548a" : "#2d2d2d", fontFamily: "'DM Sans', sans-serif" }}>{rec.name}</div><div style={{ fontSize: 12, color: "#8a7a80", marginTop: 3, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{rec.desc}</div>{rec.price && <div style={{ fontSize: 12, color: "#c9a96e", marginTop: 3, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{rec.price}</div>}</div>
    </div>))}
  </div>);
}

function ResultsView({ answers, onRestart }) {
  const recs = getRecommendations(answers);
  const name = answers.name || "Bestie";
  const score = getSkinScore(answers);
  const agingZones = getAgingSummary(answers);
  const treatments = recs.filter(r => r.zone === "treatment");
  const products = recs.filter(r => r.zone === "product");
  const memberships = recs.filter(r => r.zone === "membership");
  const wellness = recs.filter(r => r.zone === "wellness");
  const scoreLabel = score >= 75 ? "Great foundation" : score >= 55 ? "Room to improve" : "Let's build your plan";

  // Submit lead data to Netlify Forms on load
  useEffect(() => {
    const formData = new URLSearchParams();
    formData.append("form-name", "skin-analysis-leads");
    formData.append("name", answers.name || "");
    formData.append("age", answers.age || "");
    formData.append("fitzpatrick", answers.fitzpatrick || "");
    formData.append("skin_type", answers.skin_type || "");
    formData.append("skin_quality", (answers.skin_quality || []).join(", "));
    formData.append("upper_face", (answers.upper_face || []).join(", "));
    formData.append("mid_face", (answers.mid_face || []).join(", "));
    formData.append("lower_face", (answers.lower_face || []).join(", "));
    formData.append("hair_scalp", answers.hair_scalp || "");
    formData.append("lifestyle", (answers.lifestyle || []).join(", "));
    formData.append("skincare_routine", answers.skincare_routine || "");
    formData.append("spf", answers.spf || "");
    formData.append("experience", (answers.experience || []).join(", "));
    formData.append("weight_goal", answers.weight_goal || "");
    formData.append("priorities", answers.priorities || "");
    formData.append("budget", answers.budget || "");
    formData.append("contact", answers.contact || "");
    formData.append("email", answers.email || "");
    formData.append("phone", answers.phone || "");
    formData.append("skin_score", String(score));
    formData.append("recommended_services", recs.map(r => r.name).join(", "));

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }).catch(() => {});
  }, []);
  return (<div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fffbfd 0%, #fdf0f5 40%, #f8e8ef 100%)" }}>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#c9a96e", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", marginBottom: 8 }}>Skin Analysis Complete</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 300, color: "#2d2d2d", margin: 0, lineHeight: 1.2 }}>{name}'s <span style={{ color: "#d4548a", fontWeight: 600, fontStyle: "italic" }}>Skin Report</span></h1>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #f0e4ea", textAlign: "center", marginBottom: 20, boxShadow: "0 2px 12px rgba(212,84,138,0.06)" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#8a7a80", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", marginBottom: 16 }}>Skin Health Score</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><ScoreRing score={score} /></div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#2d2d2d", fontFamily: "'DM Sans', sans-serif" }}>{scoreLabel}</div>
        <div style={{ fontSize: 13, color: "#8a7a80", fontFamily: "'DM Sans', sans-serif", marginTop: 4, lineHeight: 1.5 }}>Based on your skin quality, lifestyle factors, routine, and sun protection habits.</div>
      </div>
      {agingZones.length > 0 && (<div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", border: "1px solid #f0e4ea", marginBottom: 20, boxShadow: "0 2px 12px rgba(212,84,138,0.06)" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#c9a96e", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", marginBottom: 14 }}>Aging Assessment by Zone</div>
        {agingZones.map((z, i) => (<div key={z.zone} style={{ marginBottom: i < agingZones.length - 1 ? 14 : 0 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#d4548a", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{z.zone}</div><div style={{ fontSize: 13, color: "#2d2d2d", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{z.concerns.join(" · ")}</div></div>))}
      </div>)}
      {treatments.length > 0 && renderSection("Recommended Treatments", treatments, "#2d2d2d")}
      {products.length > 0 && renderSection("Your Peptide Skincare Rx", products, "#d4548a")}
      {wellness.length > 0 && renderSection("Wellness", wellness, "#2d2d2d")}
      {memberships.length > 0 && renderSection("Membership Match", memberships, "#c9a96e")}
      <div style={{ background: "linear-gradient(135deg, #d4548a, #c44a7e)", borderRadius: 20, padding: "28px 24px", textAlign: "center", marginTop: 24, boxShadow: "0 8px 24px rgba(212,84,138,0.3)" }}>
        <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#fff", fontWeight: 600, marginBottom: 8 }}>Ready to start your glow-up?</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif", marginBottom: 20, lineHeight: 1.6 }}>Book your consultation and we'll walk through your skin analysis in person.</div>
        <a href="https://bestiebeautybar.myaestheticrecord.com/online-booking" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#fff", color: "#d4548a", border: "none", borderRadius: 50, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textDecoration: "none" }}>Book My Consultation</a>
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}><button onClick={onRestart} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>Retake Analysis</button></div>
    </div>
    <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
  </div>);
}

export default function BestieSkinAnalysis() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const currentQ = step >= 0 && step < QUESTIONS.length ? QUESTIONS[step] : null;
  const isComplete = step >= QUESTIONS.length;
  const canProceed = () => { if (!currentQ) return true; const val = answers[currentQ.id]; if (currentQ.type === "text") return val && val.trim().length > 0; if (currentQ.type === "single" || currentQ.type === "rank") return !!val; if (currentQ.type === "multi") return val && val.length > 0; return true; };
  const goNext = () => { if (!canProceed() || animating) return; setDir(1); setAnimating(true); setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 280); };
  const goBack = () => { if (step <= -1 || animating) return; setDir(-1); setAnimating(true); setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 280); };
  useEffect(() => { if (currentQ?.type === "single" && answers[currentQ.id]) { const t = setTimeout(goNext, 400); return () => clearTimeout(t); } }, [answers, currentQ?.id]);
  if (isComplete) return <ResultsView answers={answers} onRestart={() => { setStep(-1); setAnswers({}); }} />;
  if (step === -1) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fffbfd 0%, #fdf0f5 30%, #f8e8ef 70%, #f0dce6 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 12, letterSpacing: 4, color: "#c9a96e", textTransform: "uppercase", marginBottom: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Bestie Beauty Bar</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 300, color: "#2d2d2d", lineHeight: 1.1, margin: 0 }}>Comprehensive<br /><span style={{ fontWeight: 700, fontStyle: "italic", color: "#d4548a" }}>Skin Analysis</span></h1>
        <p style={{ fontSize: 15, color: "#8a7a80", marginTop: 20, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>Assess your skin health, identify signs of facial aging zone by zone, and receive a personalized treatment plan with your Skin Health Score.</p>
        <button onClick={goNext} style={{ marginTop: 32, background: "linear-gradient(135deg, #d4548a, #c44a7e)", color: "#fff", border: "none", borderRadius: 50, padding: "16px 48px", fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 8px 24px rgba(212,84,138,0.3)", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 32px rgba(212,84,138,0.4)"; }} onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 24px rgba(212,84,138,0.3)"; }}>Begin My Analysis →</button>
        <p style={{ fontSize: 12, color: "#bbb", marginTop: 20, fontFamily: "'DM Sans', sans-serif" }}>Takes about 3 minutes • No account needed</p>
      </div>
    </div>
  );
  const currentSection = currentQ?.section;
  const sectionLabel = currentQ?.sectionLabel || SECTION_LABELS[currentSection] || "";
  const prevSection = step > 0 ? QUESTIONS[step - 1]?.section : null;
  const showSectionHeader = currentSection !== prevSection;
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fffbfd 0%, #fdf0f5 50%, #f8e8ef 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", fontSize: 14, color: "#c9a96e", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          <span style={{ fontSize: 12, color: "#bbb" }}>{step + 1} of {QUESTIONS.length}</span>
        </div>
        <ProgressBar current={step + 1} total={QUESTIONS.length} />
        <div style={{ opacity: animating ? 0 : 1, transform: animating ? `translateX(${dir * 40}px)` : "translateX(0)", transition: "opacity 0.28s ease, transform 0.28s ease", marginTop: 28 }}>
          {showSectionHeader && (<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #e8d5de)" }} /><span style={{ fontSize: 11, letterSpacing: 2, color: "#c9a96e", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>{sectionLabel}</span><div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #e8d5de, transparent)" }} /></div>)}
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#2d2d2d", lineHeight: 1.2, margin: "0 0 6px 0" }}>{currentQ.label}</h2>
          <p style={{ fontSize: 13, color: "#8a7a80", margin: "0 0 20px 0", lineHeight: 1.6 }}>{currentQ.subtitle}</p>
          {currentQ.type === "text" && <TextInput question={currentQ} value={answers[currentQ.id]} onChange={v => setAnswers(a => ({ ...a, [currentQ.id]: v }))} onNext={goNext} />}
          {currentQ.type === "single" && <SingleSelect question={currentQ} value={answers[currentQ.id]} onChange={v => setAnswers(a => ({ ...a, [currentQ.id]: v }))} />}
          {(currentQ.type === "multi" || currentQ.type === "rank") && <MultiSelect question={currentQ} value={answers[currentQ.id] || []} onChange={v => setAnswers(a => ({ ...a, [currentQ.id]: v }))} />}
        </div>
        {(currentQ.type === "text" || currentQ.type === "multi" || currentQ.type === "rank") && (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <button onClick={goNext} disabled={!canProceed()} style={{ background: canProceed() ? "linear-gradient(135deg, #d4548a, #c44a7e)" : "#e0d0d8", color: "#fff", border: "none", borderRadius: 50, padding: "14px 40px", fontSize: 15, fontWeight: 600, cursor: canProceed() ? "pointer" : "default", letterSpacing: 0.5, transition: "all 0.3s", boxShadow: canProceed() ? "0 6px 20px rgba(212,84,138,0.25)" : "none", fontFamily: "'DM Sans', sans-serif" }}>
              {step === QUESTIONS.length - 1 ? "See My Skin Report ✨" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
