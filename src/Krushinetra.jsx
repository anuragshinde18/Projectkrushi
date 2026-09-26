import { useState } from "react";
import { useState, useRef, useCallback, useEffect } from "react";

const MARATHI_THOUGHTS = [
  { thought: "शेती हीच आमची संस्कृती, शेतकरी हाच आमचा देव।", translation: "Farming is our culture, the farmer is our God." },
  { thought: "जमीन माझी माय, तिची सेवा हाच माझा धर्म।", translation: "The earth is my mother, serving her is my duty." },
  { thought: "पाऊस पडो अन् पीक येवो, शेतकऱ्याचं मन भरो।", translation: "May rain fall and crops grow, may the farmer's heart be full." },
  { thought: "कष्टाचं फळ गोड असतं, शेतकऱ्याला हे ठाऊक।", translation: "The fruit of hard work is sweet — the farmer knows this well." },
  { thought: "माती सांगते कथा जुन्या, बीज सांगते स्वप्न नव्या।", translation: "The soil tells old stories, the seed tells new dreams." },
];

const WEATHER_TIPS = {
  sunny: { icon: "☀️", label: "Sunny", advice: "Good time for harvesting and field work. Ensure adequate irrigation — hot days increase water needs by 30%.", color: "#f59e0b" },
  cloudy: { icon: "⛅", label: "Partly Cloudy", advice: "Ideal conditions for transplanting seedlings. Reduced heat stress on crops — good day for pesticide application.", color: "#6b7280" },
  rainy: { icon: "🌧️", label: "Rainy", advice: "Avoid spraying fertilizers or pesticides today. Check drainage channels. Watch for fungal disease risk in standing water.", color: "#3b82f6" },
  stormy: { icon: "⛈️", label: "Stormy", advice: "Secure crops and equipment. Avoid field operations. Check for pest surges after storm passes.", color: "#7c3aed" },
  windy: { icon: "💨", label: "Windy", advice: "Avoid pesticide spraying — drift risk is high. Good conditions for natural pollination. Watch for soil erosion.", color: "#0ea5e9" },
};

const CROP_SEASONS = {
  Kharif: { months: "June–October", crops: ["Rice", "Jowar", "Bajra", "Cotton", "Sugarcane", "Soybean"], icon: "🌾" },
  Rabi: { months: "October–March", crops: ["Wheat", "Gram", "Mustard", "Sunflower", "Barley"], icon: "🌿" },
  Zaid: { months: "March–June", crops: ["Watermelon", "Muskmelon", "Cucumber", "Bitter Gourd"], icon: "🍉" },
};

const GOVT_SCHEMES = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    icon: "💰",
    category: "Income Support",
    benefit: "₹6,000/year in 3 installments of ₹2,000 directly to bank account",
    startDate: "December 1, 2018",
    lastDate: "Ongoing (No end date)",
    status: "active",
    eligibility: "Small & marginal farmers with less than 2 hectares land",
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records (7/12 Utara)", "Mobile Number"],
    applyLink: "https://pmkisan.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "155261 / 011-24300606",
    template: `Application for PM-KISAN Registration

To,
The Agriculture Officer,
[District Name] District

Subject: Registration under PM-KISAN Scheme

Respected Sir/Madam,

I, [Your Full Name], son/daughter of [Father's Name], residing at [Village], [Taluka], [District], [State] – PIN [Pincode], hereby apply for registration under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme.

My Details:
• Aadhaar Number: XXXX-XXXX-XXXX
• Mobile Number: +91-XXXXXXXXXX
• Land Holding: [X] Hectares
• Survey/Gat Number: [Land Record Number]
• Bank Account: [Account Number], [Bank Name], [Branch]
• IFSC Code: [IFSC]

I declare that I am a small/marginal farmer and eligible under the scheme guidelines. All documents are attached herewith.

Yours sincerely,
[Your Full Name]
Date: [DD/MM/YYYY]
Signature / Thumb Impression`
  },
  {
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    icon: "🛡️",
    category: "Crop Insurance",
    benefit: "Crop insurance coverage; farmers pay only 2% for Kharif, 1.5% for Rabi, 5% for horticulture",
    startDate: "February 18, 2016",
    lastDate: "Kharif: July 31 | Rabi: December 31 (Annual)",
    status: "active",
    eligibility: "All farmers growing notified crops in notified areas",
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records", "Sowing Certificate", "Mobile Number"],
    applyLink: "https://pmfby.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "14447",
    template: `Application for PMFBY Crop Insurance

To,
The Branch Manager,
[Bank Name], [Branch]

Subject: Enrollment under Pradhan Mantri Fasal Bima Yojana (PMFBY)

Respected Sir/Madam,

I, [Your Full Name], wish to enroll my crop under PMFBY for the [Kharif/Rabi] season [Year].

Farmer Details:
• Name: [Full Name]
• Aadhaar: XXXX-XXXX-XXXX
• Mobile: +91-XXXXXXXXXX
• Village/Gram Panchayat: [Name]
• Taluka & District: [Name]

Crop & Land Details:
• Crop Name: [e.g., Soybean / Wheat]
• Survey/Gat No.: [Number]
• Area Under Crop: [X] Hectares
• Estimated Sum Insured: ₹[Amount]
• Premium Payable (farmer share): ₹[Amount]

Bank Account for Claim: [Account Number]
IFSC: [IFSC Code]

I request you to enroll me under the scheme and deduct the premium from my account.

Yours sincerely,
[Your Full Name]
Date: [DD/MM/YYYY]`
  },
  {
    name: "KCC",
    fullName: "Kisan Credit Card",
    icon: "💳",
    category: "Credit & Finance",
    benefit: "Short-term credit up to ₹3 lakh at 4% interest rate (with interest subvention); higher limits based on land",
    startDate: "August 1998",
    lastDate: "Ongoing",
    status: "active",
    eligibility: "All farmers, sharecroppers, tenant farmers, and SHGs",
    documents: ["Aadhaar Card", "PAN Card", "Land Records", "Passport Photo", "Bank Account"],
    applyLink: "https://www.nabard.org",
    ministry: "Ministry of Finance / NABARD",
    helpline: "1800-180-1111",
    template: `Application for Kisan Credit Card (KCC)

To,
The Branch Manager,
[Bank Name], [Branch Name]

Subject: Application for Kisan Credit Card

Respected Sir/Madam,

I, [Your Full Name], a farmer residing at [Village, Taluka, District], hereby apply for a Kisan Credit Card under the KCC scheme.

Personal Details:
• Name: [Full Name]
• Date of Birth: [DD/MM/YYYY]
• Aadhaar Number: XXXX-XXXX-XXXX
• PAN Number: [PAN]
• Mobile: +91-XXXXXXXXXX

Farm Details:
• Total Land Owned: [X] Hectares
• Survey/Gat Number: [Number]
• Crops Grown: [Crop Names]
• Annual Income from Farming: ₹[Amount]

Credit Requirement:
• Purpose: [Seeds / Fertilizers / Equipment / etc.]
• Credit Limit Required: ₹[Amount]
• Repayment Period: [12 months]

I have no outstanding loans / I have attached NOC from previous lender.

Yours faithfully,
[Your Full Name]
Date: [DD/MM/YYYY]
Signature`
  },
  {
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    icon: "💧",
    category: "Irrigation",
    benefit: "Subsidy on drip/sprinkler irrigation — up to 55% for small farmers, 45% for others",
    startDate: "July 1, 2015",
    lastDate: "Ongoing (Extended to 2026)",
    status: "active",
    eligibility: "All farmers; priority to small/marginal/SC/ST farmers",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Photo", "Quotation from supplier"],
    applyLink: "https://pmksy.gov.in",
    ministry: "Ministry of Jal Shakti",
    helpline: "1800-180-1551",
    template: `Application for PMKSY Drip/Sprinkler Irrigation Subsidy

To,
The Agricultural Development Officer,
[Taluka/District Agriculture Office]

Subject: Application for Subsidy under PMKSY (Per Drop More Crop)

Respected Sir/Madam,

I, [Your Full Name], request subsidy under PM Krishi Sinchayee Yojana for installation of [Drip/Sprinkler] irrigation system on my farm.

Applicant Details:
• Name: [Full Name]
• Aadhaar: XXXX-XXXX-XXXX
• Category: [General / SC / ST / OBC / Small / Marginal Farmer]
• Village & District: [Name]
• Mobile: +91-XXXXXXXXXX

Land & Irrigation Details:
• Survey/Gat No.: [Number]
• Total Farm Area: [X] Hectares
• Area to be Irrigated: [X] Hectares
• Type of System: [Drip / Sprinkler / Micro-irrigation]
• Estimated Cost: ₹[Amount] (Quotation attached)
• Subsidy Claimed: ₹[Amount]

Bank Account for Subsidy:
• Account No.: [Number]
• IFSC: [Code]
• Bank & Branch: [Name]

Enclosures: Land Records, Aadhaar copy, Bank passbook copy, Supplier quotation, Passport photo

Yours sincerely,
[Your Full Name]
Date: [DD/MM/YYYY]`
  },
  {
    name: "eNAM",
    fullName: "National Agriculture Market",
    icon: "🏪",
    category: "Market Access",
    benefit: "Online trading platform — sell crops at best price across India; transparent price discovery",
    startDate: "April 14, 2016",
    lastDate: "Ongoing",
    status: "active",
    eligibility: "All farmers registered with APMC or local mandi",
    documents: ["Aadhaar Card", "Bank Passbook", "Mobile Number", "Mandi/APMC registration"],
    applyLink: "https://enam.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "1800-270-0224",
    template: `Registration Request for eNAM Portal

To,
The Mandi Secretary / APMC Officer,
[Mandi/APMC Name], [District]

Subject: Registration as Farmer Seller on eNAM Platform

Respected Sir/Madam,

I, [Your Full Name], wish to register on the e-National Agriculture Market (eNAM) platform to sell my produce online at competitive prices.

Farmer Details:
• Name: [Full Name]
• Aadhaar: XXXX-XXXX-XXXX
• Mobile (for OTP): +91-XXXXXXXXXX
• Village & District: [Name]
• Existing APMC Registration No.: [If any]

Crops to be Listed for Sale:
1. [Crop Name] – Approx. [X] Quintals
2. [Crop Name] – Approx. [X] Quintals

Bank Details for Payment:
• Account Number: [Number]
• IFSC: [Code]
• Bank Name & Branch: [Name]

I request you to complete my registration and provide login credentials for the eNAM portal.

Yours sincerely,
[Your Full Name]
Date: [DD/MM/YYYY]`
  },
  {
    name: "SMAM",
    fullName: "Sub-Mission on Agricultural Mechanization",
    icon: "🚜",
    category: "Farm Equipment",
    benefit: "40–50% subsidy on farm machinery — tractors, harvesters, tillers, etc.",
    startDate: "2014-15",
    lastDate: "Ongoing (Annual budget allocation)",
    status: "active",
    eligibility: "Individual farmers; priority to small/marginal/SC/ST",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Quotation from dealer", "Photo"],
    applyLink: "https://agrimachinery.nic.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "011-23382477",
    template: `Application for Farm Machinery Subsidy under SMAM

To,
The District Agriculture Officer,
[District Name]

Subject: Application for Subsidy on Agricultural Equipment under SMAM

Respected Sir/Madam,

I, [Your Full Name], apply for subsidy under the Sub-Mission on Agricultural Mechanization (SMAM) for purchase of [Equipment Name].

Applicant Details:
• Name: [Full Name]
• Aadhaar: XXXX-XXXX-XXXX
• Category: [SC / ST / Small / Marginal / General]
• Mobile: +91-XXXXXXXXXX
• Village, Taluka, District: [Name]

Equipment Details:
• Equipment Name: [e.g., Power Tiller / Mini Tractor / Reaper]
• Dealer Name & Address: [Name]
• MRP / Cost: ₹[Amount]
• Subsidy Applied For: ₹[Amount] ([X]%)
• Farmer Contribution: ₹[Amount]

Land Details:
• Total Land: [X] Hectares | Survey No.: [Number]

Bank Account:
• Account No.: [Number] | IFSC: [Code]

Enclosures: Land records, Aadhaar, Bank passbook, Dealer quotation, Passport photo (2 copies)

Yours faithfully,
[Your Full Name]
Date: [DD/MM/YYYY]`
  },
  {
    name: "RKVY",
    fullName: "Rashtriya Krishi Vikas Yojana",
    icon: "📈",
    category: "Agriculture Development",
    benefit: "Grants for agriculture infrastructure, storage, processing units, and innovation projects",
    startDate: "2007",
    lastDate: "Ongoing (RKVY-RAFTAAR extended to 2025-26)",
    status: "active",
    eligibility: "Farmers, FPOs, cooperatives, agri-entrepreneurs",
    documents: ["Project Proposal", "Aadhaar", "Land Records", "Bank Details", "Business Plan (for entrepreneurs)"],
    applyLink: "https://rkvy.nic.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "011-23070190",
    template: `Project Proposal under RKVY-RAFTAAR

To,
The State Nodal Officer – RKVY,
[State Agriculture Department]

Subject: Proposal for Grant under RKVY-RAFTAAR Scheme

Respected Sir/Madam,

I / We [Name / FPO Name] submit this project proposal for funding under the Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR).

Applicant Details:
• Name / Organization: [Name]
• Type: [Individual Farmer / FPO / Cooperative / Agri-Startup]
• Aadhaar / Registration No.: [Number]
• District & State: [Name]
• Mobile & Email: [Details]

Project Details:
• Project Title: [e.g., Cold Storage Unit / Agri Processing Center]
• Location: [Village, District]
• Project Duration: [X] Months
• Total Project Cost: ₹[Amount]
• Grant Requested: ₹[Amount]
• Farmer/Promoter Contribution: ₹[Amount]
• Expected Beneficiaries: [Number] farmers

Expected Outcomes:
• [Outcome 1 — e.g., Reduce post-harvest losses by X%]
• [Outcome 2 — e.g., Increase farmer income by ₹X/year]

Bank Details for Fund Release:
• Account No.: [Number] | IFSC: [Code]

Enclosures: Detailed project report, land documents, Aadhaar, bank passbook, photos of site

Yours sincerely,
[Name / Authorized Signatory]
Date: [DD/MM/YYYY]`
  },
  {
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    icon: "🧪",
    category: "Soil Testing",
    benefit: "Free soil testing & health card with crop-wise fertilizer recommendations",
    startDate: "February 19, 2015",
    lastDate: "Ongoing",
    status: "active",
    eligibility: "All farmers",
    documents: ["Aadhaar Card", "Land Records", "Mobile Number"],
    applyLink: "https://soilhealth.dac.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    helpline: "1800-180-1551",
    template: `Request for Soil Health Card & Testing

To,
The Agriculture Supervisor / KVK Officer,
[Village / Taluka]

Subject: Request for Soil Testing and Soil Health Card

Respected Sir/Madam,

I, [Your Full Name], request soil testing of my agricultural land and issuance of a Soil Health Card under the Government of India's Soil Health Card Scheme.

Farmer Details:
• Name: [Full Name]
• Aadhaar: XXXX-XXXX-XXXX
• Mobile: +91-XXXXXXXXXX
• Village, Taluka, District: [Name]

Land Details:
• Survey / Gat No.: [Number]
• Area: [X] Hectares
• Current Crops Grown: [Crop Names]
• Last Tested (if any): [Year or Never]
• Soil Type (as known): [Black / Red / Sandy / Loamy]

Purpose of Testing:
☐ Regular monitoring
☐ Planning new crop
☐ Fertilizer optimization
☐ Problem soil (saline/acidic)

I request you to collect soil samples at the earliest and provide me the health card with nutrient status and fertilizer recommendations.

Yours sincerely,
[Your Full Name]
Date: [DD/MM/YYYY]`
  },
];

export default function KrushiNetra() {
  const [page, setPage] = useState("home");
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [thoughtIdx, setThoughtIdx] = useState(0);
  const [weather, setWeather] = useState("sunny");
  const [cropQuery, setCropQuery] = useState("");
  const [cropAdvice, setCropAdvice] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeFilter, setSchemeFilter] = useState("All");
  const [showTemplate, setShowTemplate] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => setThoughtIdx(i => (i + 1) % MARATHI_THOUGHTS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const analyzeDisease = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are KrushiNetra.ai — an expert agricultural AI assistant for Indian farmers. Analyze crop disease images and respond ONLY in this exact JSON format (no markdown, no extra text):
{"cropName":"name","diseaseName":"full disease name","pathogen":"type","severity":"mild/moderate/severe","symptoms":["s1","s2","s3"],"causes":["c1","c2"],"treatments":[{"type":"Organic","remedy":"remedy"},{"type":"Chemical","remedy":"medicine name"},{"type":"Preventive","remedy":"measure"}],"affectedStates":["s1","s2"],"profitImpact":"impact","marathiTip":"मराठी टिप्स","urgency":"Act within X days","isHealthy":false}
If healthy, set isHealthy true.`,
          messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: imageFile.type, data: base64 } }, { type: "text", text: "Analyze this crop image for diseases. Respond only in the specified JSON format." }] }]
        })
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setResult({ error: "Analysis failed. Please try a clearer image of the affected crop." });
    }
    setAnalyzing(false);
  };

  const getCropAdvice = async () => {
    if (!cropQuery.trim()) return;
    setCropLoading(true);
    setCropAdvice(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are KrushiNetra.ai crop advisor for Indian farmers. Respond ONLY in JSON:
{"recommendation":"crop","reason":"why","expectedProfit":"INR/acre","waterNeed":"liters/day/acre","growthDays":90,"soilPrep":["step1","step2"],"govtSchemes":["scheme with benefit"],"marathiAdvice":"मराठी सल्ला","alternatives":["crop2","crop3"]}`,
          messages: [{ role: "user", content: `${cropQuery} - give crop recommendation for Indian farmer` }]
        })
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      setCropAdvice(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setCropAdvice({ error: "Could not fetch advice. Please try again." });
    }
    setCropLoading(false);
  };

  const copyTemplate = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const categories = ["All", ...Array.from(new Set(GOVT_SCHEMES.map(s => s.category)))];
  const filteredSchemes = schemeFilter === "All" ? GOVT_SCHEMES : GOVT_SCHEMES.filter(s => s.category === schemeFilter);

  const NavBar = () => (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,30,15,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(34,197,94,0.2)", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setPage("home")}>
        <span style={{ fontSize: "1.6rem" }}>🌾</span>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "#4ade80", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>KrushiNetra.ai</div>
          <div style={{ color: "#6b7280", fontSize: "0.62rem", letterSpacing: "0.1em" }}>कृषी नेत्र • SMART FARMING</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {[["home","🏠"],["disease","🔬 Disease"],["advisor","🌱 Advisor"],["climate","🌦️ Climate"],["schemes","🏛️ Schemes"],["about","ℹ️"]].map(([p, label]) => (
          <button key={p} onClick={() => { setPage(p); setSelectedScheme(null); setShowTemplate(false); }} style={{ background: page === p ? "#16a34a" : "transparent", border: page === p ? "none" : "1px solid rgba(74,222,128,0.3)", color: page === p ? "#fff" : "#4ade80", padding: "0.3rem 0.65rem", borderRadius: "20px", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );

  // ── Scheme Detail Modal ──
  const SchemeModal = ({ scheme }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 1rem 2rem", overflowY: "auto" }} onClick={() => { setSelectedScheme(null); setShowTemplate(false); }}>
      <div style={{ background: "#0f1f12", border: "1px solid rgba(74,222,128,0.35)", borderRadius: "20px", maxWidth: "700px", width: "100%", padding: "2rem", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => { setSelectedScheme(null); setShowTemplate(false); }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontFamily: "inherit" }}>✕ Close</button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem" }}>{scheme.icon}</div>
          <div>
            <div style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700 }}>{scheme.name}</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{scheme.fullName}</div>
            <span style={{ background: "#166534", color: "#86efac", fontSize: "0.7rem", padding: "0.15rem 0.6rem", borderRadius: "10px", marginTop: "0.3rem", display: "inline-block" }}>🟢 Active</span>
          </div>
        </div>

        <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ color: "#86efac", fontWeight: 700, marginBottom: "0.3rem" }}>💰 Benefit</div>
          <div style={{ color: "#d1fae5", fontSize: "0.95rem" }}>{scheme.benefit}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "0.75rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.72rem", marginBottom: "0.2rem" }}>📅 Start Date</div>
            <div style={{ color: "#d1fae5", fontSize: "0.85rem", fontWeight: 600 }}>{scheme.startDate}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "0.75rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.72rem", marginBottom: "0.2rem" }}>⏰ Last Date / Deadline</div>
            <div style={{ color: "#fbbf24", fontSize: "0.85rem", fontWeight: 600 }}>{scheme.lastDate}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "0.75rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.72rem", marginBottom: "0.2rem" }}>🏛️ Ministry</div>
            <div style={{ color: "#d1fae5", fontSize: "0.8rem" }}>{scheme.ministry}</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "0.75rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.72rem", marginBottom: "0.2rem" }}>📞 Helpline</div>
            <div style={{ color: "#38bdf8", fontSize: "0.85rem", fontWeight: 700 }}>{scheme.helpline}</div>
          </div>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: "0.5rem" }}>✅ Eligibility</div>
          <div style={{ color: "#d1fae5", fontSize: "0.9rem", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.75rem" }}>{scheme.eligibility}</div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: "0.5rem" }}>📄 Documents Required</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {scheme.documents.map(d => <span key={d} style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", fontSize: "0.78rem", padding: "0.25rem 0.65rem", borderRadius: "20px" }}>{d}</span>)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => setShowTemplate(!showTemplate)} style={{ flex: 1, background: showTemplate ? "#065f46" : "linear-gradient(90deg,#16a34a,#0d9488)", color: "#fff", border: "none", padding: "0.85rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.9rem" }}>
            {showTemplate ? "📄 Hide Template" : "📝 View Application Template"}
          </button>
          <a href={scheme.applyLink} target="_blank" rel="noreferrer" style={{ flex: 1, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)", color: "#93c5fd", padding: "0.85rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.9rem", textAlign: "center", textDecoration: "none", display: "block" }}>
            🌐 Official Website
          </a>
        </div>

        {showTemplate && (
          <div style={{ marginTop: "1.5rem", background: "#060f08", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ background: "rgba(74,222,128,0.08)", padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(74,222,128,0.15)" }}>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>📝 Application Template</span>
              <button onClick={() => copyTemplate(scheme.template)} style={{ background: copied ? "#166534" : "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: copied ? "#86efac" : "#4ade80", padding: "0.3rem 0.8rem", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem" }}>
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <pre style={{ color: "#d1fae5", fontSize: "0.78rem", padding: "1.25rem", whiteSpace: "pre-wrap", lineHeight: 1.8, margin: 0, fontFamily: "monospace", maxHeight: "400px", overflowY: "auto" }}>{scheme.template}</pre>
          </div>
        )}
      </div>
    </div>
  );

  const SchemesPage = () => (
    <div style={{ minHeight: "100vh", background: "#08100a", paddingTop: "64px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #052e16, #064e3b)", padding: "3rem 2rem 2rem", textAlign: "center", borderBottom: "1px solid rgba(74,222,128,0.15)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏛️</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#4ade80", fontSize: "2.5rem", marginBottom: "0.3rem" }}>Government Schemes</h1>
        <p style={{ color: "#6b7280", marginBottom: "0.3rem" }}>सरकारी योजना — शेतकऱ्यांसाठी</p>
        <p style={{ color: "#86efac", fontSize: "0.9rem" }}>{GOVT_SCHEMES.length} Active Schemes · Click any scheme to view details & application template</p>
      </div>

      {/* Filter */}
      <div style={{ padding: "1.5rem 2rem 0", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSchemeFilter(cat)} style={{ background: schemeFilter === cat ? "#16a34a" : "rgba(0,0,0,0.4)", border: `1px solid ${schemeFilter === cat ? "#16a34a" : "rgba(74,222,128,0.2)"}`, color: schemeFilter === cat ? "#fff" : "#6b7280", padding: "0.35rem 1rem", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem", paddingBottom: "3rem" }}>
          {filteredSchemes.map(scheme => (
            <div key={scheme.name} onClick={() => { setSelectedScheme(scheme); setShowTemplate(false); setCopied(false); }}
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "16px", padding: "1.5rem", cursor: "pointer", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.15)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "#166534", color: "#86efac", fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "8px" }}>🟢 ACTIVE</div>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>{scheme.icon}</div>
              <h3 style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "0.2rem" }}>{scheme.name}</h3>
              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "0.75rem" }}>{scheme.fullName}</p>
              <span style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "10px", marginBottom: "0.75rem", display: "inline-block" }}>{scheme.category}</span>
              <p style={{ color: "#d1fae5", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>{scheme.benefit.slice(0, 90)}...</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(74,222,128,0.1)", paddingTop: "0.75rem" }}>
                <div>
                  <div style={{ color: "#6b7280", fontSize: "0.65rem" }}>Last Date</div>
                  <div style={{ color: "#fbbf24", fontSize: "0.75rem", fontWeight: 600 }}>{scheme.lastDate.split("|")[0].trim()}</div>
                </div>
                <div style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: 600 }}>View Details →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedScheme && <SchemeModal scheme={selectedScheme} />}
    </div>
  );

  const HomePage = () => (
    <div>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #052e16 0%, #064e3b 40%, #065f46 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "64px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)" }} />
        {["🍃","🌿","🍀","🌱","🍂"].map((l, i) => (
          <div key={i} style={{ position: "absolute", fontSize: `${1.5 + i * 0.4}rem`, opacity: 0.3, animation: `float${i} ${6 + i}s ease-in-out infinite`, left: `${10 + i * 18}%`, top: `${20 + (i % 2) * 40}%` }}>{l}</div>
        ))}
        <div style={{ textAlign: "center", zIndex: 1, padding: "2rem" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "1rem" }}>
            Krushi<span style={{ color: "#4ade80" }}>Netra</span><span style={{ color: "#a3e635", fontSize: "0.6em" }}>.ai</span>
          </div>
          <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "#86efac", marginBottom: "0.5rem" }}>
            {MARATHI_THOUGHTS[thoughtIdx].thought}
          </div>
          <div style={{ color: "#6ee7b7", fontSize: "0.95rem", fontStyle: "italic", marginBottom: "3rem" }}>
            "{MARATHI_THOUGHTS[thoughtIdx].translation}"
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[["🔬 Disease Scanner","disease","#16a34a"],["🌱 Crop Advisor","advisor","#0d9488"],["🌦️ Climate","climate","#2563eb"],["🏛️ Schemes","schemes","#7c3aed"]].map(([label, p, bg]) => (
              <button key={p} onClick={() => setPage(p)} style={{ background: bg, color: "#fff", border: "none", padding: "0.85rem 1.75rem", borderRadius: "40px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 600, boxShadow: `0 0 30px ${bg}66`, transition: "transform 0.2s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#0a1a0d", padding: "5rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Playfair Display', serif", color: "#4ade80", fontSize: "2.5rem", marginBottom: "0.5rem" }}>What KrushiNetra Does</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "3rem" }}>कृषी नेत्र — शेतकऱ्याची डिजिटल डोळे</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { icon: "🔬", title: "AI Disease Scanner", desc: "Upload a crop photo. AI identifies the pathogen, severity, and gives treatment with medicine names.", page: "disease", color: "#166534" },
            { icon: "🌱", title: "Smart Crop Advisor", desc: "Tell us your soil, location, and season. Get best crop recommendations with profit estimates.", page: "advisor", color: "#134e4a" },
            { icon: "🌦️", title: "Climate Advisor", desc: "Get weather-based farming tips — when to irrigate, spray, or harvest.", page: "climate", color: "#1e3a5f" },
            { icon: "🏛️", title: "Govt. Schemes", desc: `${GOVT_SCHEMES.length} active government schemes with dates, benefits, and ready-to-use application templates.`, page: "schemes", color: "#3b1f5c" },
          ].map(f => (
            <div key={f.title} onClick={() => setPage(f.page)} style={{ background: `linear-gradient(135deg, ${f.color}, rgba(0,0,0,0.5))`, border: "1px solid rgba(74,222,128,0.15)", borderRadius: "16px", padding: "2rem", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(74,222,94,0.15)"; }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(90deg, #052e16, #065f46, #052e16)", padding: "3rem 2rem", textAlign: "center", borderTop: "1px solid rgba(74,222,128,0.2)", borderBottom: "1px solid rgba(74,222,128,0.2)" }}>
        <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "#86efac", fontWeight: 700 }}>"शेतकरी सुखी, तर देश सुखी"</div>
        <div style={{ color: "#6ee7b7", marginTop: "0.5rem", fontSize: "1rem", fontStyle: "italic" }}>"When the farmer prospers, the nation prospers"</div>
      </div>
    </div>
  );

  const DiseasePage = () => (
    <div style={{ minHeight: "100vh", background: "#0a1a0d", paddingTop: "80px", padding: "80px 1.5rem 3rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#4ade80", fontSize: "2.5rem", textAlign: "center", marginBottom: "0.3rem" }}>🔬 Disease AI Scanner</h1>
        <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "2.5rem" }}>पिकाचा फोटो टाका — AI आजार ओळखेल</p>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => fileInputRef.current.click()}
          style={{ border: `2px dashed ${dragOver ? "#4ade80" : "rgba(74,222,128,0.3)"}`, borderRadius: "16px", padding: "3rem", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(74,222,128,0.05)" : "rgba(0,0,0,0.3)", transition: "all 0.2s", marginBottom: "1.5rem" }}>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          {imagePreview ? <img src={imagePreview} alt="Crop" style={{ maxHeight: "280px", borderRadius: "12px", objectFit: "contain" }} /> : (
            <><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
            <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: "0.5rem" }}>Click or Drag & Drop</p>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Upload a photo of your diseased crop leaf or plant</p></>
          )}
        </div>
        {imageFile && !analyzing && (
          <button onClick={analyzeDisease} style={{ width: "100%", background: "linear-gradient(90deg, #16a34a, #0d9488)", color: "#fff", border: "none", padding: "1rem", borderRadius: "12px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem" }}>
            🔍 विश्लेषण करा — Analyze Disease
          </button>
        )}
        {analyzing && (
          <div style={{ textAlign: "center", padding: "2rem", background: "rgba(74,222,128,0.05)", borderRadius: "12px", marginBottom: "2rem", border: "1px solid rgba(74,222,128,0.2)" }}>
            <div style={{ fontSize: "2.5rem", animation: "spin 2s linear infinite", display: "inline-block" }}>🔬</div>
            <p style={{ color: "#4ade80", marginTop: "1rem", fontWeight: 600 }}>AI is analyzing your crop...</p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>Searching web for latest treatment protocols...</p>
          </div>
        )}
        {result && !result.error && (
          <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "16px", padding: "2rem" }}>
            {result.isHealthy ? <div style={{ textAlign: "center", color: "#4ade80", fontSize: "1.5rem", padding: "1rem" }}>✅ Your crop looks healthy! Keep up the good care.</div> : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <InfoCard label="🌾 Crop" value={result.cropName} />
                  <InfoCard label="🦠 Disease" value={result.diseaseName} />
                  <InfoCard label="🔬 Pathogen" value={result.pathogen} />
                  <InfoCard label="⚠️ Severity" value={result.severity} color={result.severity === "severe" ? "#ef4444" : result.severity === "moderate" ? "#f59e0b" : "#22c55e"} />
                </div>
                <Section title="🩺 Symptoms" items={result.symptoms} />
                <Section title="🔍 Causes" items={result.causes} />
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", marginBottom: "0.75rem" }}>💊 Treatments</h3>
                  {result.treatments?.map((t, i) => (
                    <div key={i} style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "0.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ background: t.type === "Organic" ? "#166534" : t.type === "Chemical" ? "#7c2d12" : "#1e3a5f", color: "#fff", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "8px", whiteSpace: "nowrap" }}>{t.type}</span>
                      <span style={{ color: "#d1fae5", fontSize: "0.9rem" }}>{t.remedy}</span>
                    </div>
                  ))}
                </div>
                {result.marathiTip && <div style={{ background: "linear-gradient(135deg, rgba(21,128,61,0.2), rgba(6,78,59,0.2))", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "12px", padding: "1rem 1.5rem", marginBottom: "1rem" }}>
                  <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#86efac", fontSize: "1rem", marginBottom: "0.3rem" }}>🌿 मराठी टिप्स</div>
                  <div style={{ color: "#d1fae5" }}>{result.marathiTip}</div>
                </div>}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {result.urgency && <Tag label={`⏰ ${result.urgency}`} color="#f59e0b" />}
                  {result.profitImpact && <Tag label={`📉 ${result.profitImpact}`} color="#ef4444" />}
                  {result.affectedStates?.map(s => <Tag key={s} label={`📍 ${s}`} color="#3b82f6" />)}
                </div>
              </>
            )}
          </div>
        )}
        {result?.error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "1rem", color: "#fca5a5", textAlign: "center" }}>{result.error}</div>}
      </div>
    </div>
  );

  const AdvisorPage = () => (
    <div style={{ minHeight: "100vh", background: "#080f12", paddingTop: "80px", padding: "80px 1.5rem 3rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#34d399", fontSize: "2.5rem", textAlign: "center", marginBottom: "0.3rem" }}>🌱 Smart Crop Advisor</h1>
        <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "2.5rem" }}>कोणते पीक घ्यावे — AI सांगेल</p>
        <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "16px", padding: "2rem", marginBottom: "2rem" }}>
          <textarea value={cropQuery} onChange={e => setCropQuery(e.target.value)} placeholder="Describe your situation... e.g. 'I have 2 acres in Pune, black cotton soil, summer season, want maximum profit'" style={{ width: "100%", minHeight: "120px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "10px", padding: "1rem", color: "#d1fae5", fontFamily: "inherit", fontSize: "0.95rem", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <button onClick={getCropAdvice} disabled={cropLoading || !cropQuery.trim()} style={{ marginTop: "1rem", width: "100%", background: cropLoading ? "#1f2937" : "linear-gradient(90deg, #059669, #0284c7)", color: "#fff", border: "none", padding: "1rem", borderRadius: "10px", fontSize: "1rem", fontWeight: 700, cursor: cropLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {cropLoading ? "🌱 AI is thinking..." : "🤖 Get AI Recommendation"}
          </button>
        </div>
        {cropAdvice && !cropAdvice.error && (
          <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "16px", padding: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #065f46, #0284c7)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <div style={{ color: "#a7f3d0", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Recommended Crop</div>
              <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}>{cropAdvice.recommendation}</div>
              <div style={{ color: "#6ee7b7", fontSize: "0.9rem", marginTop: "0.3rem" }}>{cropAdvice.reason}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <InfoCard label="💰 Est. Profit/Acre" value={cropAdvice.expectedProfit} color="#22c55e" />
              <InfoCard label="💧 Water Need" value={cropAdvice.waterNeed} color="#38bdf8" />
              <InfoCard label="📅 Growth Days" value={`${cropAdvice.growthDays} days`} color="#a78bfa" />
            </div>
            <Section title="🌾 Soil Preparation" items={cropAdvice.soilPrep} />
            {cropAdvice.govtSchemes?.length > 0 && <Section title="🏛️ Government Schemes" items={cropAdvice.govtSchemes} />}
            {cropAdvice.alternatives?.length > 0 && <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ color: "#34d399", fontFamily: "'Playfair Display', serif", marginBottom: "0.5rem" }}>🔄 Alternatives</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>{cropAdvice.alternatives.map(a => <Tag key={a} label={a} color="#0d9488" />)}</div>
            </div>}
            {cropAdvice.marathiAdvice && <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "10px", padding: "1rem", fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#a7f3d0" }}>🌿 {cropAdvice.marathiAdvice}</div>}
          </div>
        )}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#34d399", fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", textAlign: "center", marginBottom: "1.5rem" }}>📅 Season Guide</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {Object.entries(CROP_SEASONS).map(([season, info]) => (
              <div key={season} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "14px", padding: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{info.icon}</div>
                <h3 style={{ color: "#34d399", fontWeight: 700, marginBottom: "0.25rem" }}>{season} Season</h3>
                <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "1rem" }}>{info.months}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>{info.crops.map(c => <span key={c} style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#6ee7b7", fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>{c}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ClimatePage = () => (
    <div style={{ minHeight: "100vh", background: "#08101a", paddingTop: "80px", padding: "80px 1.5rem 3rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#38bdf8", fontSize: "2.5rem", textAlign: "center", marginBottom: "0.3rem" }}>🌦️ Climate Advisor</h1>
        <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "2.5rem" }}>हवामानानुसार शेती करा</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {Object.entries(WEATHER_TIPS).map(([key, w]) => (
            <div key={key} onClick={() => setWeather(key)} style={{ background: weather === key ? `${w.color}22` : "rgba(0,0,0,0.4)", border: `2px solid ${weather === key ? w.color : "rgba(255,255,255,0.1)"}`, borderRadius: "14px", padding: "1.25rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{w.icon}</div>
              <div style={{ color: weather === key ? w.color : "#9ca3af", fontWeight: 600, fontSize: "0.85rem" }}>{w.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${WEATHER_TIPS[weather].color}22, rgba(0,0,0,0.6))`, border: `1px solid ${WEATHER_TIPS[weather].color}55`, borderRadius: "16px", padding: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{WEATHER_TIPS[weather].icon}</div>
          <h2 style={{ color: WEATHER_TIPS[weather].color, fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "0.75rem" }}>{WEATHER_TIPS[weather].label} Day Advice</h2>
          <p style={{ color: "#d1fae5", fontSize: "1rem", lineHeight: 1.8 }}>{WEATHER_TIPS[weather].advice}</p>
        </div>
        <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "16px", padding: "1.5rem" }}>
          <h3 style={{ color: "#38bdf8", fontFamily: "'Playfair Display', serif", marginBottom: "1.25rem" }}>📅 Monthly Farming Calendar (Maharashtra)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {[{m:"June",act:"Kharif sowing begins, Prepare nursery beds"},{m:"July",act:"Transplanting paddy, Weed control"},{m:"August",act:"Top dressing of fertilizers, Pest watch"},{m:"September",act:"Disease monitoring, Irrigation management"},{m:"October",act:"Kharif harvest, Rabi land preparation"},{m:"November",act:"Rabi sowing: Wheat, Gram, Mustard"},{m:"December",act:"Irrigation for Rabi, Cold protection"},{m:"January",act:"Flowering stage care, Frost protection"},{m:"February",act:"Rabi harvest begins, Market planning"},{m:"March",act:"Zaid crop sowing starts"},{m:"April",act:"Summer crops, Land resting"},{m:"May",act:"Deep ploughing, Soil health check"}].map(({m,act})=>(
              <div key={m} style={{ background: "rgba(56,189,248,0.05)", borderLeft: "3px solid #0284c7", padding: "0.75rem", borderRadius: "0 8px 8px 0" }}>
                <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.85rem" }}>{m}</div>
                <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: "0.2rem" }}>{act}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div style={{ minHeight: "100vh", background: "#0a1a0d", paddingTop: "80px", padding: "80px 1.5rem 3rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌾</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#4ade80", fontSize: "2.5rem", marginBottom: "0.5rem" }}>KrushiNetra.ai</h1>
        <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#86efac", fontSize: "1.1rem", marginBottom: "2rem" }}>कृषी नेत्र — शेतकऱ्याची डिजिटल आँखे</div>
        <p style={{ color: "#9ca3af", lineHeight: 1.8, marginBottom: "2rem" }}>KrushiNetra.ai is an AI-powered smart farming platform built for Indian farmers — especially Maharashtrian agriculture. It uses advanced vision AI to detect crop diseases, provides personalized crop recommendations, climate-based guidance, and a complete government schemes directory with application templates.</p>
        <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <h3 style={{ color: "#4ade80", marginBottom: "1rem" }}>🎯 Mission</h3>
          <p style={{ color: "#d1fae5", lineHeight: 1.7 }}>To empower every Indian farmer with AI technology — making expert agricultural advice accessible in their language, on their phone, at zero cost.</p>
        </div>
        <div style={{ color: "#4b5563", fontSize: "0.85rem", marginTop: "2rem" }}>Made with ❤️ by <span style={{ color: "#4ade80" }}>Anurag Shinde</span> · KrushiNetra.ai</div>
      </div>
    </div>
  );

  const InfoCard = ({ label, value, color }) => (
    <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "0.75rem 1rem" }}>
      <div style={{ color: "#6b7280", fontSize: "0.72rem", marginBottom: "0.25rem" }}>{label}</div>
      <div style={{ color: color || "#d1fae5", fontWeight: 600, fontSize: "0.95rem" }}>{value}</div>
    </div>
  );
  const Section = ({ title, items }) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ color: "#4ade80", fontFamily: "'Playfair Display', serif", marginBottom: "0.75rem" }}>{title}</h3>
      {items?.map((item, i) => <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.4rem" }}><span style={{ color: "#4ade80", marginTop: "0.1rem" }}>•</span><span style={{ color: "#d1fae5", fontSize: "0.9rem" }}>{item}</span></div>)}
    </div>
  );
  const Tag = ({ label, color }) => (
    <span style={{ background: `${color}22`, border: `1px solid ${color}55`, color, fontSize: "0.78rem", padding: "0.25rem 0.7rem", borderRadius: "20px" }}>{label}</span>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a1a0d; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(10deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(-8deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-25px) rotate(5deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(-12deg)} }
        @keyframes float4 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-22px) rotate(7deg)} }
        textarea::placeholder { color: #4b5563; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a1a0d; } ::-webkit-scrollbar-thumb { background: #166534; border-radius: 3px; }
      `}</style>
      <NavBar />
      {page === "home" && <HomePage />}
      {page === "disease" && <DiseasePage />}
      {page === "advisor" && <AdvisorPage />}
      {page === "climate" && <ClimatePage />}
      {page === "schemes" && <SchemesPage />}
      {page === "about" && <AboutPage />}
    </>
  );
}
