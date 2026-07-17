import { useState, useId, useRef, useEffect } from "react";
import {
  LayoutDashboard, Bell, Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, Clock,
  Package, Factory, BarChart3, Sparkles, Settings,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp,
  ClipboardCheck, ArrowRight, Zap, Target,
  FileText, ShieldAlert, Layers, DollarSign,
  ShoppingCart, Bot, X, Send, MessageSquare
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  purple: "#6C63FF",
  lavender: "#F4F2FF",
  lavenderDark: "#EAE6FF",
  cyan: "#06B6D4",
  cyanBg: "#ECFEFF",
  green: "#10B981",
  greenBg: "#ECFDF5",
  amber: "#F59E0B",
  amberBg: "#FFFBEB",
  red: "#EF4444",
  redBg: "#FEF2F2",
  indigo: "#4F46E5",
  slate: "#64748B",
  border: "#E8EBF3",
  bg: "#FAFBFF",
  card: "#FFFFFF",
  text: "#1A1B2E",
  textMuted: "#6B7280",
};

// ─── Spark data helper ────────────────────────────────────────────────────────
const spark = (base: number, len = 10) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(0, base * (0.85 + Math.sin(i * 0.9) * 0.12 + i * 0.008)),
  }));

// ─── Mock Data ────────────────────────────────────────────────────────────────

const approvalTimeData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  time: 1.2 + Math.sin(i * 0.4) * 0.8 + (i > 20 ? 0.6 : 0),
}));

const aiAccuracyData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  accuracy: 84 + i * 0.6 + Math.sin(i * 0.7) * 2,
}));

const bottleneckFreqData = [
  { dept: "Procure", thisMonth: 8, lastMonth: 5 },
  { dept: "Production", thisMonth: 5, lastMonth: 7 },
  { dept: "Inventory", thisMonth: 12, lastMonth: 6 },
  { dept: "Finance", thisMonth: 4, lastMonth: 3 },
  { dept: "Quality", thisMonth: 3, lastMonth: 4 },
  { dept: "Projects", thisMonth: 6, lastMonth: 4 },
];

const approvalCycleData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  hours: 0.8 + Math.sin(i * 0.5) * 0.7 + (i > 22 ? 0.9 : 0),
}));

const APPROVALS = [
  {
    id: "PO-2024-0871",
    type: "Purchase Order",
    dept: "Procurement",
    by: "Rajan Mehta",
    priority: "Critical",
    wait: "2h 14m",
    waitMs: 134,
    amount: "₹4,82,000",
    risk: 72,
    confidence: 87,
    recommendation: "Approve — Expedite",
    recColor: P.green,
    summary: "This purchase order for 500 kg of Aluminum 6061 from Reliance Steel Ltd is critical to maintaining production continuity on Line 2. Current inventory stands at just 14 units against a safety stock of 50 — representing less than 3 days of supply. PRD-0445, the production order for Apex Corp's ₹18L order (delivery due 28 Jul), will stall without this material. Reliance Steel has a 94% on-time delivery record across 28 transactions. Immediate approval is strongly recommended to avoid a cascading production halt.",
    riskDimensions: [
      { label: "Budget Impact", score: 72, color: P.amber },
      { label: "Inventory Risk", score: 91, color: P.red },
      { label: "Vendor Reliability", score: 94, color: P.green },
      { label: "Production Impact", score: 88, color: P.red },
      { label: "Cash Flow", score: 58, color: P.amber },
      { label: "Delivery Risk", score: 82, color: P.red },
      { label: "Compliance", score: 96, color: P.green },
      { label: "Duplicate Check", score: 12, color: P.green },
    ],
    recReasoning: "Vendor is A-rated with consistent delivery performance. Material is critical path for a high-value customer order. No duplicate detected. Budget is within approved quarterly limits. Expedite to avoid Line 2 stall.",
    ifRejected: "Production Line 2 halts within 72 hours. PRD-0445 for Apex Corp delayed by minimum 5 days. Customer delivery commitment of 28 Jul will be missed, risking ₹18L order and relationship.",
    operationalImpact: "Line 2 production halts in 72 hours without this material. PRD-0445 is the primary affected production order, blocking Apex Corp delivery.",
    financialImpact: "₹4,82,000 outflow protects ₹18,00,000 customer order. Net positive impact of ₹13,18,000 if approved promptly.",
    inventoryCurrent: 14,
    inventoryRequired: 500,
    inventorySafety: 50,
    inventoryDays: 3,
    affectedOrders: ["PRD-0445", "PRD-0449"],
    productionRisk: "Line 2 halt in 72h, impacting 2 production orders and 1 customer delivery",
    projectImpact: "Project Phoenix (client-facing milestone) at risk if Line 2 stops",
    vendorScore: 94,
    vendorOnTime: "94%",
    vendorQuality: "98%",
    vendorHistory: "28 deliveries in last 12 months. 2 minor delays in Jan and Mar. No quality rejections.",
    justification: "Production Line 2 requires 500 kg of Aluminum 6061 to fulfill Production Order PRD-0445 for Apex Corp. Current stock at 14 units will be exhausted by 20 Jul. This is the only qualified supplier for this grade within delivery window.",
    relatedRecords: ["PRD-0445", "PRD-0449", "INV-AL6061", "ORD-8821", "PROJ-PHOENIX"],
    documents: ["PO Draft", "Vendor Quote REF-RS-2024-441", "Inventory Level Report", "Production Schedule Week 29"],
    timeline: [
      { time: "07:28 AM", event: "PO Request created by Rajan Mehta" },
      { time: "07:30 AM", event: "AI analysis initiated" },
      { time: "07:34 AM", event: "AI analysis complete — Expedite recommendation" },
      { time: "09:42 AM", event: "Pending approval — 2h 14m elapsed" },
    ],
    history: [
      { id: "PO-2024-0810", date: "15 Jun 2024", decision: "Approved", outcome: "Delivered on schedule" },
      { id: "PO-2024-0754", date: "2 May 2024", decision: "Approved", outcome: "Delivered 1 day early" },
      { id: "PO-2024-0691", date: "18 Mar 2024", decision: "Approved", outcome: "Minor delay, communicated in advance" },
    ],
  },
  {
    id: "BOM-2024-0341",
    type: "BOM Revision",
    dept: "Engineering",
    by: "Priya Sharma",
    priority: "High",
    wait: "45m",
    waitMs: 45,
    amount: "₹1,20,000",
    risk: 34,
    confidence: 92,
    recommendation: "Approve",
    recColor: P.green,
    summary: "This BOM revision proposes substituting SS316 with SS304 in Product Model HB-220. SS304 is an approved alternate material already in vendor qualification. The substitution results in a ₹1,20,000 cost saving per production batch with no compromise to mechanical or corrosion specifications for this product's operating environment. Six active production orders will incorporate the revised BOM upon approval. A similar revision (BOM-2024-0298) was approved in March 2024 and achieved a 14% cost reduction with zero quality incidents.",
    riskDimensions: [
      { label: "Budget Impact", score: 18, color: P.green },
      { label: "Inventory Risk", score: 22, color: P.green },
      { label: "Vendor Reliability", score: 88, color: P.green },
      { label: "Production Impact", score: 34, color: P.green },
      { label: "Cash Flow", score: 12, color: P.green },
      { label: "Delivery Risk", score: 15, color: P.green },
      { label: "Compliance", score: 91, color: P.green },
      { label: "Duplicate Check", score: 4, color: P.green },
    ],
    recReasoning: "Material substitution is technically equivalent per engineering assessment. Cost benefit is significant. Historical precedent (BOM-2024-0298) confirms this approach is safe and effective. No compliance risk identified.",
    ifRejected: "Continued use of SS316 at higher cost. No immediate operational risk, but ₹1,20,000 per batch cost saving opportunity is forfeited. Estimated annual impact: ₹7.2L in avoidable material costs.",
    operationalImpact: "6 active production orders will incorporate revised BOM. Minimal transition risk — SS304 is already in stock.",
    financialImpact: "₹1,20,000 cost saving per batch. Estimated annual saving of ₹7.2L based on current production volumes.",
    inventoryCurrent: 340,
    inventoryRequired: 180,
    inventorySafety: 100,
    inventoryDays: 45,
    affectedOrders: ["PRD-0440", "PRD-0441", "PRD-0442", "PRD-0443", "PRD-0444", "PRD-0445"],
    productionRisk: "Low — SS304 already qualified and in stock",
    projectImpact: "No project impact identified",
    vendorScore: 88,
    vendorOnTime: "91%",
    vendorQuality: "99%",
    vendorHistory: "SS304 supplier Mittal Steel: 18 deliveries, 1 minor delay. Consistent quality.",
    justification: "Engineering review confirmed SS304 meets all mechanical requirements for HB-220 product line. Regulatory compliance verified. Material cost differential justifies revision. SS304 is readily available from current approved vendors.",
    relatedRecords: ["PRD-0440", "PRD-0441", "PRD-0442", "PRD-0443", "PRD-0444", "PRD-0445", "SPEC-HB220-v3"],
    documents: ["BOM Revision Document", "Engineering Assessment Report", "Material Comparison Table", "Compliance Certificate SS304"],
    timeline: [
      { time: "09:00 AM", event: "BOM revision submitted by Priya Sharma" },
      { time: "09:02 AM", event: "AI analysis complete — Approve recommendation" },
      { time: "09:45 AM", event: "Pending approval — 45m elapsed" },
    ],
    history: [
      { id: "BOM-2024-0298", date: "14 Mar 2024", decision: "Approved", outcome: "14% cost reduction, zero quality incidents" },
      { id: "BOM-2024-0251", date: "8 Jan 2024", decision: "Approved", outcome: "Implemented successfully" },
      { id: "BOM-2024-0204", date: "22 Oct 2023", decision: "Sent for Revision", outcome: "Revised and re-approved, no issues" },
    ],
  },
  {
    id: "EXP-2024-0112",
    type: "Team Training",
    dept: "Operations",
    by: "Vikram Nair",
    priority: "Low",
    wait: "3h 8m",
    waitMs: 188,
    amount: "₹28,500",
    risk: 18,
    confidence: 96,
    recommendation: "Approve",
    recColor: P.green,
    summary: "This expense request covers mandatory safety and compliance training for 15 production floor operators. The training is a regulatory requirement under Factory Act guidelines and must be completed before 31 Jul 2024. The amount of ₹28,500 is within the pre-approved training budget for Q3 (remaining budget: ₹1,42,000). The training vendor, SafetyFirst Compliance Solutions, has conducted 4 previous sessions for Habu with consistent positive feedback. No operational disruption expected — training is scheduled for off-shift hours.",
    riskDimensions: [
      { label: "Budget Impact", score: 8, color: P.green },
      { label: "Inventory Risk", score: 2, color: P.green },
      { label: "Vendor Reliability", score: 96, color: P.green },
      { label: "Production Impact", score: 4, color: P.green },
      { label: "Cash Flow", score: 6, color: P.green },
      { label: "Delivery Risk", score: 2, color: P.green },
      { label: "Compliance", score: 98, color: P.green },
      { label: "Duplicate Check", score: 2, color: P.green },
    ],
    recReasoning: "Mandatory regulatory training with low financial impact. Budget exists. No operational risk. Compliance risk if rejected (regulatory penalty exposure). Straightforward approval.",
    ifRejected: "Regulatory non-compliance risk. Factory Act violation potential. 15 operators would be unqualified for certain tasks. Recommended alternative: delay by maximum 1 week only.",
    operationalImpact: "No operational disruption. Training scheduled during off-shift hours (Saturday 8 AM - 1 PM).",
    financialImpact: "₹28,500 within Q3 training budget (₹1,42,000 remaining). Compliance value significantly exceeds cost.",
    inventoryCurrent: 0,
    inventoryRequired: 0,
    inventorySafety: 0,
    inventoryDays: 0,
    affectedOrders: [],
    productionRisk: "None — scheduled during off-shift hours",
    projectImpact: "No project impact",
    vendorScore: 96,
    vendorOnTime: "100%",
    vendorQuality: "100%",
    vendorHistory: "SafetyFirst Compliance Solutions: 4 sessions delivered for Habu. 100% satisfaction rating. Certified trainer.",
    justification: "Mandatory Factory Act compliance training for 15 production operators due 31 Jul 2024. Scheduled during off-shift to minimize disruption. Budget pre-approved in Q3 plan.",
    relatedRecords: ["BUDGET-Q3-OPS", "COMPLIANCE-FACTORY-ACT-2024", "VENDOR-SAFETYFIRST-01"],
    documents: ["Training Agenda", "Vendor Invoice", "Compliance Requirement Notice", "Q3 Budget Approval"],
    timeline: [
      { time: "06:37 AM", event: "Expense request submitted by Vikram Nair" },
      { time: "06:38 AM", event: "AI analysis complete — Approve recommendation" },
      { time: "09:45 AM", event: "Pending approval — 3h 8m elapsed" },
    ],
    history: [
      { id: "EXP-2024-0092", date: "15 Apr 2024", decision: "Approved", outcome: "Training completed, 0 incidents" },
      { id: "EXP-2024-0071", date: "12 Jan 2024", decision: "Approved", outcome: "Training completed, certification obtained" },
      { id: "EXP-2024-0048", date: "8 Oct 2023", decision: "Approved", outcome: "Completed successfully" },
    ],
  },
  {
    id: "PRD-2024-0456",
    type: "Production Order",
    dept: "Manufacturing",
    by: "Anita Rao",
    priority: "High",
    wait: "1h 30m",
    waitMs: 90,
    amount: "₹7,65,000",
    risk: 55,
    confidence: 79,
    recommendation: "Needs Review",
    recColor: P.amber,
    summary: "Production order for 120 units of Product HB-340 for customer Zenith Industries. Delivery due 2 Aug 2024. Material availability check shows 2 of 4 required materials are below required quantity — SS304 has sufficient stock but Copper Alloy C110 is at 40% of required quantity. The production order can proceed partially but full completion may be delayed by 3-4 days pending Copper Alloy replenishment.",
    riskDimensions: [
      { label: "Budget Impact", score: 44, color: P.amber },
      { label: "Inventory Risk", score: 68, color: P.amber },
      { label: "Vendor Reliability", score: 72, color: P.amber },
      { label: "Production Impact", score: 55, color: P.amber },
      { label: "Cash Flow", score: 38, color: P.green },
      { label: "Delivery Risk", score: 61, color: P.amber },
      { label: "Compliance", score: 92, color: P.green },
      { label: "Duplicate Check", score: 8, color: P.green },
    ],
    recReasoning: "Material shortage for Copper Alloy C110 creates partial completion risk. Recommend approving with condition that procurement raises emergency PO for Copper Alloy immediately.",
    ifRejected: "Production delay of full order. Zenith Industries delivery at risk. ₹7.65L order fulfillment blocked.",
    operationalImpact: "Line 3 capacity available. Partial production possible with current stock, full order requires Copper Alloy replenishment.",
    financialImpact: "₹7,65,000 order value. On-time delivery maintains customer relationship.",
    inventoryCurrent: 84,
    inventoryRequired: 210,
    inventorySafety: 60,
    inventoryDays: 8,
    affectedOrders: ["ORD-8841"],
    productionRisk: "Partial completion risk — Copper Alloy shortage",
    projectImpact: "No project impact",
    vendorScore: 72,
    vendorOnTime: "82%",
    vendorQuality: "94%",
    vendorHistory: "Copper Alloy supplier Bharat Metals: 3 late deliveries in last 2 months.",
    justification: "Customer order ORD-8841 from Zenith Industries requires 120 units HB-340 by 2 Aug. Standard production order with materials mostly available.",
    relatedRecords: ["ORD-8841", "INV-CA-C110", "INV-SS304", "CUST-ZENITH"],
    documents: ["Production Order Draft", "Material Availability Report", "Customer PO ORD-8841"],
    timeline: [
      { time: "08:15 AM", event: "Production order submitted by Anita Rao" },
      { time: "08:17 AM", event: "AI analysis — material shortage detected" },
      { time: "08:20 AM", event: "Needs Review recommendation issued" },
      { time: "09:45 AM", event: "Pending approval — 1h 30m elapsed" },
    ],
    history: [
      { id: "PRD-2024-0431", date: "4 Jul 2024", decision: "Approved", outcome: "Completed on schedule, ₹7.8L fulfilled" },
      { id: "PRD-2024-0402", date: "18 Jun 2024", decision: "Approved", outcome: "2-day delay due to material issue" },
      { id: "PRD-2024-0378", date: "3 Jun 2024", decision: "Approved", outcome: "Completed on schedule" },
    ],
  },
  {
    id: "INV-2024-0233",
    type: "Invoice Approval",
    dept: "Finance",
    by: "Suresh Kumar",
    priority: "Medium",
    wait: "5h 22m",
    waitMs: 322,
    amount: "₹3,14,000",
    risk: 41,
    confidence: 83,
    recommendation: "Needs Review",
    recColor: P.amber,
    summary: "Invoice from Kapoor Industries for machining services rendered in June 2024. The invoice amount of ₹3,14,000 is 8.4% above the contracted rate. Possible causes: additional overtime charges or scope creep. Finance team should verify against work order WO-2024-0334 before approving. Kapoor Industries was recently onboarded (July 2024) and this is their first invoice submission. Recommend reconciliation with actual work order quantities before payment.",
    riskDimensions: [
      { label: "Budget Impact", score: 55, color: P.amber },
      { label: "Inventory Risk", score: 10, color: P.green },
      { label: "Vendor Reliability", score: 62, color: P.amber },
      { label: "Production Impact", score: 18, color: P.green },
      { label: "Cash Flow", score: 41, color: P.amber },
      { label: "Delivery Risk", score: 12, color: P.green },
      { label: "Compliance", score: 78, color: P.amber },
      { label: "Duplicate Check", score: 24, color: P.green },
    ],
    recReasoning: "Invoice amount 8.4% above contracted rate. First invoice from new vendor. Reconciliation required before payment to avoid overpayment.",
    ifRejected: "Vendor payment delayed. Potential relationship issue with new vendor. Work order services already rendered — payment will eventually be required.",
    operationalImpact: "No immediate operational impact. Services already rendered.",
    financialImpact: "₹3,14,000 payment. Possible overpayment of ₹24,400 if invoice not reconciled with work order.",
    inventoryCurrent: 0,
    inventoryRequired: 0,
    inventorySafety: 0,
    inventoryDays: 0,
    affectedOrders: ["WO-2024-0334"],
    productionRisk: "None",
    projectImpact: "No project impact",
    vendorScore: 62,
    vendorOnTime: "100%",
    vendorQuality: "100%",
    vendorHistory: "Kapoor Industries: newly onboarded July 2024. No delivery history. Single engagement.",
    justification: "Payment for machining services under WO-2024-0334 completed in June. Invoice submitted as per NET-30 terms.",
    relatedRecords: ["WO-2024-0334", "VENDOR-KAPOOR-01", "CONTRACT-KI-2024"],
    documents: ["Invoice KI-2024-001", "Work Order WO-2024-0334", "Vendor Contract", "Service Completion Report"],
    timeline: [
      { time: "04:23 AM", event: "Invoice submitted by Kapoor Industries via portal" },
      { time: "04:25 AM", event: "Auto-routed to Suresh Kumar (Finance)" },
      { time: "04:28 AM", event: "AI flagged rate discrepancy — Needs Review" },
      { time: "09:45 AM", event: "Pending approval — 5h 22m elapsed" },
    ],
    history: [],
  },
];

const APPROVAL_HISTORY = [
  { id: "PO-2024-0860", type: "Purchase Order", dept: "Procurement", decision: "Approved", decidedBy: "Rajiv Sharma", decideTime: "38m", aiRec: "Approve", outcome: "Delivered on time", financial: "₹3.2L", lessons: "AI accuracy confirmed. Vendor performance as predicted." },
  { id: "BOM-2024-0335", type: "BOM Revision", dept: "Engineering", decision: "Approved", decidedBy: "Priya Sharma", decideTime: "1h 12m", aiRec: "Approve", outcome: "11% cost reduction achieved", financial: "₹0.8L saving", lessons: "Cost reduction realized. Recommend similar reviews for other BOMs." },
  { id: "EXP-2024-0108", type: "Expense", dept: "Finance", decision: "Rejected", decidedBy: "Rajiv Sharma", decideTime: "25m", aiRec: "Reject (duplicate)", outcome: "Duplicate confirmed, ₹45k saved", financial: "₹45k saved", lessons: "AI duplicate detection working effectively. Trust AI on duplicates." },
  { id: "PO-2024-0847", type: "Purchase Order", dept: "Procurement", decision: "Approved", decidedBy: "Anita Rao", decideTime: "4h 22m", aiRec: "Expedite", outcome: "Delayed approval caused 2-day production delay", financial: "₹2.1L cost impact", lessons: "Delayed approval despite AI expedite recommendation caused downstream damage. Act faster on Critical items." },
  { id: "PRD-2024-0431", type: "Production Order", dept: "Manufacturing", decision: "Approved", decidedBy: "Rajiv Sharma", decideTime: "52m", aiRec: "Approve", outcome: "Completed on schedule", financial: "₹7.8L fulfilled", lessons: "Standard production approval. AI recommendation aligned." },
  { id: "INV-2024-0225", type: "Invoice", dept: "Finance", decision: "Approved", decidedBy: "Suresh Kumar", decideTime: "1h 04m", aiRec: "Approve", outcome: "Vendor satisfied, credit terms maintained", financial: "₹1.6L", lessons: "Timely payment maintained vendor goodwill." },
  { id: "BOM-2024-0328", type: "BOM Revision", dept: "Engineering", decision: "Sent for Revision", decidedBy: "Priya Sharma", decideTime: "2h 33m", aiRec: "Review", outcome: "Revision improved spec, quality issue avoided", financial: "₹0 (risk avoided)", lessons: "AI correctly flagged review need. Revision prevented potential quality failure." },
  { id: "EXP-2024-0099", type: "Expense", dept: "Operations", decision: "Approved", decidedBy: "Vikram Nair", decideTime: "18m", aiRec: "Approve", outcome: "Training completed, 0 compliance incidents", financial: "₹22k", lessons: "Fast approval of compliance training is best practice." },
];

// ─── Sparkline component ───────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  const id = useId();
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${id})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Department Health Card ────────────────────────────────────────────────────
type DeptStatus = "Healthy" | "At Risk" | "Critical";
interface DeptDef {
  name: string;
  icon: React.ElementType;
  status: DeptStatus;
  metric: string;
  metricLabel: string;
  summary: string;
  detail: string;
  sparkColor: string;
}

const DEPARTMENTS: DeptDef[] = [
  { name: "Procurement", icon: ShoppingCart, status: "At Risk", metric: "23 Active POs", metricLabel: "POs", summary: "4 POs pending approval >2h. Vendor risk alert on Shree Metals (late delivery pattern).", detail: "4 critical POs stalled", sparkColor: P.amber },
  { name: "Production", icon: Factory, status: "Healthy", metric: "47 Orders Running", metricLabel: "Orders", summary: "Lines 1, 2, 3 operational. Line 2 tracking 78% efficiency, 6% below weekly target.", detail: "Line 2 at 78% efficiency", sparkColor: P.green },
  { name: "Inventory", icon: Package, status: "Critical", metric: "12 Alerts Active", metricLabel: "Alerts", summary: "3 materials below safety stock. Aluminum 6061 at 14 units — 3-day supply remaining.", detail: "Aluminum 6061 critical", sparkColor: P.red },
  { name: "Finance", icon: DollarSign, status: "Healthy", metric: "₹48.2L MTD", metricLabel: "Revenue", summary: "Revenue on track. Two invoices ₹4.1L overdue 30+ days. Cash position stable.", detail: "₹18.2L AR overdue", sparkColor: P.green },
  { name: "Quality", icon: ShieldAlert, status: "At Risk", metric: "97.3% Score", metricLabel: "Quality", summary: "NCR-2091 open 4 days. Batch B-2024-110 on QC hold pending root cause.", detail: "1 NCR open, 1 batch on hold", sparkColor: P.amber },
  { name: "Projects", icon: Layers, status: "At Risk", metric: "18 Active", metricLabel: "Projects", summary: "2 of 18 projects behind schedule. Project Phoenix 4 days delayed, blocking client delivery.", detail: "Project Phoenix 4 days late", sparkColor: P.amber },
];


function DeptHealthCard({ dept }: { dept: DeptDef }) {
  const Icon = dept.icon;
  const statusColor = dept.status === "Healthy" ? P.green : dept.status === "At Risk" ? P.amber : P.red;
  const statusBg = dept.status === "Healthy" ? P.greenBg : dept.status === "At Risk" ? P.amberBg : P.redBg;
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: statusBg }}>
            <Icon size={14} style={{ color: statusColor }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{dept.name}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: statusColor, background: statusBg }}>{dept.status}</span>
      </div>
      <div className="text-lg font-bold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{dept.metric}</div>
      <p className="text-xs leading-snug" style={{ color: P.textMuted }}>{dept.summary}</p>
      <div className="text-xs" style={{ color: P.slate }}>{dept.detail}</div>
      <Sparkline data={spark(50)} color={dept.sparkColor} />
    </div>
  );
}

function AttentionItem({ severity, title, explanation, time, link }: {
  severity: "Critical" | "High";
  title: string;
  explanation: string;
  time: string;
  link?: string;
}) {
  const isC = severity === "Critical";
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-1.5" style={{ borderColor: isC ? P.red : P.amber, background: isC ? P.redBg : P.amberBg }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: isC ? P.red : P.amber, background: isC ? "#fee2e2" : "#fef3c7" }}>{severity}</span>
        <span className="text-sm font-semibold" style={{ color: P.text }}>{title}</span>
      </div>
      <p className="text-xs leading-snug" style={{ color: P.textMuted }}>{explanation}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: P.slate }}>{time}</span>
        {link && <span className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: P.purple }}>→ {link}</span>}
      </div>
    </div>
  );
}

function BlockedChain({ items }: { items: { blocked: string; by: string; needs: string; color: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border p-3" style={{ borderColor: item.color + "44", background: item.color + "11" }}>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="font-semibold" style={{ color: P.text }}>{item.blocked}</span>
            <ArrowRight size={10} style={{ color: P.slate }} />
            <span style={{ color: item.color }}>blocked by</span>
            <ArrowRight size={10} style={{ color: P.slate }} />
            <span className="font-medium" style={{ color: P.text }}>{item.by}</span>
            <ArrowRight size={10} style={{ color: P.slate }} />
            <span style={{ color: P.textMuted }}>needs</span>
            <ArrowRight size={10} style={{ color: P.slate }} />
            <span className="font-semibold" style={{ color: P.indigo }}>{item.needs}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskCard({ rank, title, level, body, action }: { rank: number; title: string; level: string; body: string; action: string }) {
  const c = level === "HIGH" ? P.red : level === "MEDIUM" ? P.amber : P.green;
  const bg = level === "HIGH" ? P.redBg : level === "MEDIUM" ? P.amberBg : P.greenBg;
  return (
    <div className="rounded-xl border p-3 flex flex-col gap-1.5" style={{ borderColor: c + "44", background: bg }}>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: c }}>{rank}</span>
        <span className="text-sm font-semibold" style={{ color: P.text }}>{title}</span>
        <span className="ml-auto text-xs font-bold" style={{ color: c }}>{level}</span>
      </div>
      <p className="text-xs leading-snug" style={{ color: P.textMuted }}>{body}</p>
      <div className="text-xs font-medium" style={{ color: P.indigo }}>Recommended: {action}</div>
    </div>
  );
}

function ChangeItem({ label, delta, note }: { label: string; delta: string; note: string }) {
  const up = delta.startsWith("+");
  return (
    <div className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{ borderColor: P.border }}>
      <span className="mt-0.5 flex-shrink-0">
        {up ? <ArrowUpRight size={14} style={{ color: P.green }} /> : <ArrowDownRight size={14} style={{ color: P.red }} />}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium" style={{ color: P.text }}>{label} </span>
        <span className="text-sm font-bold" style={{ color: up ? P.green : P.red }}>{delta}</span>
        <div className="text-xs mt-0.5" style={{ color: P.textMuted }}>{note}</div>
      </div>
    </div>
  );
}

// ─── Approval Card (compact list) ────────────────────────────────────────────
function ApprovalCard({
  apv, selected, onClick, onReview,
}: {
  apv: typeof APPROVALS[0]; selected: boolean;
  onClick: () => void; onReview: () => void;
}) {
  const pc = apv.priority === "Critical" ? P.red : apv.priority === "High" ? P.amber : apv.priority === "Medium" ? P.cyan : P.green;
  const isLate = apv.waitMs > 120;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-3 border-b transition-colors"
      style={{
        borderColor: P.border,
        borderLeft: selected ? `3px solid ${P.purple}` : "3px solid transparent",
        background: selected ? P.lavender : P.card,
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-xs font-bold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{apv.id}</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ color: pc, background: pc + "22" }}>{apv.priority}</span>
      </div>
      <div className="text-xs mb-0.5" style={{ color: P.textMuted }}>{apv.type} · {apv.dept}</div>
      <div className="text-xs mb-1" style={{ color: P.slate }}>by {apv.by}</div>
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-xs font-semibold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{apv.amount}</span>
        <span className="text-xs font-medium" style={{ color: isLate ? P.red : P.textMuted }}>
          <Clock size={10} className="inline mr-0.5" />{apv.wait}
        </span>
      </div>
      <div className="mb-2.5">
        <div className="flex items-center justify-between text-xs mb-0.5" style={{ color: P.textMuted }}>
          <span>AI Risk</span><span style={{ color: apv.risk > 60 ? P.red : apv.risk > 35 ? P.amber : P.green }}>{apv.risk}</span>
        </div>
        <div className="rounded-full h-1 overflow-hidden" style={{ background: P.border }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${apv.risk}%`, background: apv.risk > 60 ? P.red : apv.risk > 35 ? P.amber : P.green }} />
        </div>
      </div>
      {/* Review with AI button */}
      <button
        onClick={(e) => { e.stopPropagation(); onReview(); }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: P.lavender, color: P.purple, border: `1px solid ${P.lavenderDark}` }}
      >
        <Sparkles size={11} />
        Review with AI
      </button>
    </div>
  );
}

// ─── Approval Detail ──────────────────────────────────────────────────────────
const AI_STEPS = [
  "Connecting to Odoo ERP…",
  "Retrieving purchase history for this vendor…",
  "Checking inventory levels & safety stock…",
  "Analysing production dependencies…",
  "Reviewing financial impact & budget utilisation…",
  "Cross-referencing historical approvals…",
  "Detecting duplicate requests…",
  "Generating risk assessment…",
  "Preparing recommendation…",
];

function ApprovalDetail({ apv, startReview }: { apv: typeof APPROVALS[0]; startReview: boolean }) {
  const [tab, setTab] = useState(0);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">(startReview ? "loading" : "idle");
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (startReview) { setAiState("loading"); setStepIdx(0); }
  }, [apv.id, startReview]);

  useEffect(() => {
    if (aiState !== "loading") return;
    if (stepIdx < AI_STEPS.length - 1) {
      const t = setTimeout(() => setStepIdx(s => s + 1), 260);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setAiState("done"); setTab(0); }, 400);
      return () => clearTimeout(t);
    }
  }, [aiState, stepIdx]);

  function handleTab(i: number) { setTab(i); }
  const actionsUnlocked = aiState === "done";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: P.border }}>
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{apv.id}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: P.indigo, background: P.lavender }}>{apv.type}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: P.slate, background: "#F1F5F9" }}>{apv.dept}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: P.textMuted }}>Submitted by {apv.by} · Today at {apv.type === "Invoice Approval" ? "04:23 AM" : "07:28 AM"}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-bold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{apv.amount}</span>
            <span className="text-xs" style={{ color: apv.waitMs > 120 ? P.red : P.textMuted }}><Clock size={10} className="inline mr-0.5" />{apv.wait} waiting</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1" style={{ background: apv.recColor + "15", border: `1px solid ${apv.recColor}44` }}>
            <CheckCircle size={16} style={{ color: apv.recColor }} />
            <div>
              <div className="text-xs font-bold" style={{ color: apv.recColor }}>{apv.recommendation}</div>
              <div className="text-xs" style={{ color: P.textMuted }}>{apv.confidence}% confidence</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex justify-between text-xs" style={{ color: P.textMuted }}><span>AI Risk Score</span><span style={{ color: apv.risk > 60 ? P.red : apv.risk > 35 ? P.amber : P.green }}>{apv.risk}/100</span></div>
            <div className="rounded-full h-2 overflow-hidden" style={{ background: P.border }}>
              <div className="h-full rounded-full" style={{ width: `${apv.risk}%`, background: apv.risk > 60 ? P.red : apv.risk > 35 ? P.amber : P.green }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — only shown after AI review */}
      {aiState === "done" && (
        <div className="flex border-b" style={{ borderColor: P.border }}>
          {["AI Analysis", "Business Impact", "Context & History", "Records & Timeline"].map((t, i) => (
            <button key={i} onClick={() => handleTab(i)}
              className="px-3 py-2 text-xs font-semibold border-b-2 transition-colors"
              style={{
                borderColor: tab === i ? P.purple : "transparent",
                color: tab === i ? P.purple : P.textMuted,
                background: "transparent",
              }}>
              {i === 0 && <Sparkles size={10} className="inline mr-1" />}{t}
            </button>
          ))}
        </div>
      )}

      {/* ── Idle state: prompt user to start review ── */}
      {aiState === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: P.lavender }}>
            <Sparkles size={28} style={{ color: P.purple }} />
          </div>
          <div className="text-center max-w-xs">
            <div className="font-bold text-base mb-2" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI Review Required
            </div>
            <p className="text-sm leading-relaxed" style={{ color: P.textMuted }}>
              Before taking action on this approval, run an AI analysis. The AI will examine inventory levels, vendor history, financial impact, production dependencies, and risk factors.
            </p>
          </div>
          <button
            onClick={() => { setAiState("loading"); setStepIdx(0); }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${P.purple}, ${P.indigo})`, boxShadow: `0 4px 20px ${P.purple}40` }}
          >
            <Sparkles size={16} />
            Review with AI
          </button>
          <div className="text-xs text-center" style={{ color: P.textMuted }}>
            Analyses 847 Odoo records · Takes ~3 seconds
          </div>
        </div>
      )}

      {/* ── Loading state: AI analysis in progress ── */}
      {aiState === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: P.lavender }}>
            <Bot size={28} style={{ color: P.purple }} />
          </div>
          <div className="text-center">
            <div className="font-bold text-base mb-1" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI is analysing this request
            </div>
            <div className="text-xs" style={{ color: P.textMuted }}>Connecting to Odoo ERP and reviewing all related data…</div>
          </div>
          <div className="w-full max-w-xs space-y-2">
            {AI_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-xs transition-all duration-300"
                style={{ opacity: i <= stepIdx ? 1 : 0.25, color: i < stepIdx ? P.green : i === stepIdx ? P.purple : P.textMuted }}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: i < stepIdx ? P.green : i === stepIdx ? P.lavender : "#F0F1F8" }}>
                  {i < stepIdx
                    ? <CheckCircle size={12} style={{ color: "#fff" }} />
                    : i === stepIdx
                    ? <div className="w-2 h-2 rounded-full animate-ping" style={{ background: P.purple }} />
                    : <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.border }} />
                  }
                </div>
                <span style={{ fontWeight: i === stepIdx ? 600 : 400 }}>{step}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: P.purple, animationDelay: `${d}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Done: full tabbed detail ── */}
      {aiState === "done" && (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 0 && (
          <>
            <div className="rounded-xl p-4" style={{ background: P.lavender, border: `1px solid ${P.lavenderDark}` }}>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.purple }}>Executive Summary</div>
              <p className="text-sm leading-relaxed" style={{ color: P.text }}>{apv.summary}</p>
            </div>
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.textMuted }}>AI Risk Analysis</div>
              <div className="grid grid-cols-2 gap-2">
                {apv.riskDimensions.map((r, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ background: "#F8F9FC", border: `1px solid ${P.border}` }}>
                    <div className="flex justify-between items-center mb-1 text-xs" style={{ color: P.textMuted }}>
                      <span>{r.label}</span>
                      <span className="font-bold" style={{ color: r.color }}>{r.score}</span>
                    </div>
                    <div className="rounded-full h-1.5 overflow-hidden" style={{ background: P.border }}>
                      <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: P.greenBg, border: `1px solid ${P.green}44` }}>
              <div className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: P.green }}>AI Recommendation</div>
              <p className="text-sm mb-2" style={{ color: P.text }}>{apv.recReasoning}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: P.red }}>If Rejected:</div>
              <p className="text-xs" style={{ color: P.textMuted }}>{apv.ifRejected}</p>
            </div>
          </>
        )}
        {tab === 1 && (
          <div className="space-y-3">
            {[
              { title: "Operational Impact", body: apv.operationalImpact },
              { title: "Financial Impact", body: apv.financialImpact },
              apv.inventoryRequired > 0 ? { title: "Inventory Impact", body: `Current stock: ${apv.inventoryCurrent} units | Required: ${apv.inventoryRequired} units | Safety stock: ${apv.inventorySafety} units | Days supply remaining: ${apv.inventoryDays}` } : null,
              apv.affectedOrders.length > 0 ? { title: "Production Impact", body: `Affected orders: ${apv.affectedOrders.join(", ")}. ${apv.productionRisk}` } : null,
              { title: "Project Impact", body: apv.projectImpact },
              { title: "Vendor Performance", body: `Score: ${apv.vendorScore}/100 | On-time: ${apv.vendorOnTime} | Quality: ${apv.vendorQuality}. ${apv.vendorHistory}` },
            ].filter(Boolean).map((section, i) => section && (
              <div key={i} className="rounded-xl p-3 border" style={{ borderColor: P.border, background: P.card }}>
                <div className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: P.textMuted }}>{section.title}</div>
                <p className="text-sm" style={{ color: P.text }}>{section.body}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl p-3 border" style={{ borderColor: P.border }}>
              <div className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: P.textMuted }}>Business Justification</div>
              <p className="text-sm" style={{ color: P.text }}>{apv.justification}</p>
            </div>
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.textMuted }}>Historical Similar Approvals</div>
              {apv.history.length > 0 ? (
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: P.border }}>
                  <table className="w-full text-xs">
                    <thead><tr style={{ background: P.bg }}><th className="text-left p-2 font-semibold" style={{ color: P.textMuted }}>ID</th><th className="text-left p-2 font-semibold" style={{ color: P.textMuted }}>Date</th><th className="text-left p-2 font-semibold" style={{ color: P.textMuted }}>Decision</th><th className="text-left p-2 font-semibold" style={{ color: P.textMuted }}>Outcome</th></tr></thead>
                    <tbody>{apv.history.map((h, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${P.border}` }}>
                        <td className="p-2 font-mono" style={{ color: P.indigo }}>{h.id}</td>
                        <td className="p-2" style={{ color: P.textMuted }}>{h.date}</td>
                        <td className="p-2 font-semibold" style={{ color: P.green }}>{h.decision}</td>
                        <td className="p-2" style={{ color: P.text }}>{h.outcome}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : <div className="text-xs text-center py-4" style={{ color: P.textMuted }}>No prior history for this vendor/type</div>}
            </div>
          </div>
        )}
        {tab === 3 && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.textMuted }}>Related ERP Records</div>
              <div className="flex flex-wrap gap-2">
                {apv.relatedRecords.map((r, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg font-mono" style={{ background: P.lavender, color: P.indigo }}>{r}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.textMuted }}>Supporting Documents</div>
              <div className="space-y-1.5">
                {apv.documents.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                    <FileText size={12} style={{ color: P.purple }} />
                    <span style={{ color: P.text }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.textMuted }}>Approval Timeline</div>
              <div className="space-y-2">
                {apv.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: i === apv.timeline.length - 1 ? P.amber : P.green }} />
                    <div className="text-xs" style={{ color: i === apv.timeline.length - 1 ? P.amber : P.textMuted }}>
                      <span className="font-mono mr-2">{t.time}</span>{t.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )} {/* end aiState === "done" */}

      {/* Action buttons — only active after AI review */}
      {aiState !== "idle" && (
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: P.border }}>
          {aiState === "loading" && (
            <div className="w-full text-xs text-center py-2 rounded-lg" style={{ background: P.amberBg, color: P.amber }}>
              AI analysis in progress — actions will unlock when complete
            </div>
          )}
          {aiState === "done" && (
            <>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle size={12} style={{ color: P.green }} />
                <span className="text-xs font-medium" style={{ color: P.green }}>AI review complete — actions unlocked</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Approve", color: P.green, bg: P.greenBg },
                  { label: "Send for Revision", color: P.amber, bg: P.amberBg },
                  { label: "Escalate", color: P.indigo, bg: P.lavender },
                  { label: "Reject", color: P.red, bg: P.redBg },
                  { label: "Request Clarification", color: P.slate, bg: "#F1F5F9" },
                  { label: "Schedule Discussion", color: P.cyan, bg: P.cyanBg },
                ].map((btn, i) => (
                  <button
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
                    style={{ color: btn.color, background: btn.bg, border: `1px solid ${btn.color}44` }}
                  >{btn.label}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Approval History View ────────────────────────────────────────────────────
function ApprovalHistoryView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-2">
        {[
          { label: "Total Approved", value: "847", color: P.green },
          { label: "Avg Decision Time", value: "1h 23m", color: P.cyan },
          { label: "AI Rec. Accuracy", value: "91%", color: P.purple },
          { label: "Cost Savings from AI", value: "₹24.1L", color: P.indigo },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 border text-center" style={{ borderColor: P.border, background: P.card }}>
            <div className="text-xl font-bold mb-0.5" style={{ color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div className="text-xs" style={{ color: P.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: P.border }}>
        <table className="w-full text-xs">
          <thead><tr style={{ background: P.bg, borderBottom: `1px solid ${P.border}` }}>
            {["Request ID", "Type", "Dept", "Decision", "Decided By", "Time", "AI Rec", "Outcome", "Financial Impact"].map((h, i) => (
              <th key={i} className="text-left p-3 font-semibold" style={{ color: P.textMuted }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {APPROVAL_HISTORY.map((h) => (
              <>
                <tr
                  key={h.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ borderTop: `1px solid ${P.border}` }}
                  onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                >
                  <td className="p-3 font-mono font-bold" style={{ color: P.indigo }}>{h.id}</td>
                  <td className="p-3" style={{ color: P.text }}>{h.type}</td>
                  <td className="p-3" style={{ color: P.textMuted }}>{h.dept}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                      color: h.decision === "Approved" ? P.green : h.decision === "Rejected" ? P.red : P.amber,
                      background: h.decision === "Approved" ? P.greenBg : h.decision === "Rejected" ? P.redBg : P.amberBg,
                    }}>{h.decision}</span>
                  </td>
                  <td className="p-3" style={{ color: P.text }}>{h.decidedBy}</td>
                  <td className="p-3 font-mono" style={{ color: P.textMuted }}>{h.decideTime}</td>
                  <td className="p-3" style={{ color: P.purple }}>{h.aiRec}</td>
                  <td className="p-3" style={{ color: P.text }}>{h.outcome}</td>
                  <td className="p-3 font-mono font-semibold" style={{ color: h.financial.includes("saving") || h.financial.includes("saved") ? P.green : P.text }}>{h.financial}</td>
                </tr>
                {expanded === h.id && (
                  <tr key={h.id + "-exp"} style={{ background: P.lavender }}>
                    <td colSpan={9} className="p-3">
                      <div className="text-xs space-y-1">
                        <div><span className="font-bold" style={{ color: P.purple }}>Lessons Learned: </span><span style={{ color: P.text }}>{h.lessons}</span></div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Overview View ────────────────────────────────────────────────────────────
function OverviewView() {
  const [completedExpanded, setCompletedExpanded] = useState(true);
  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Section A: AI Status Banner */}
      <div className="rounded-2xl border p-5" style={{ background: "linear-gradient(135deg, #F4F2FF 0%, #ECFEFF 100%)", borderColor: P.lavenderDark }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: P.purple }} />
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: P.purple }}>AI Business Intelligence — Live Briefing</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <p className="text-sm leading-relaxed" style={{ color: P.text }}>
              Business health is <strong>moderate</strong> today. Revenue is tracking 8.7% above July target at ₹48.2L, driven by strong order intake from Reliance Corp and Zenith Industries. However, <strong>three critical issues demand immediate attention</strong>: Aluminum 6061 stock will halt Line 2 production within 72 hours, four high-value purchase orders have been pending approval for over 2 hours creating downstream delivery risk, and Apex Corp's ₹7.4L payment is 47 days overdue. <strong>Recommend clearing the PO queue and escalating the AR collection today.</strong>
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-2 lg:items-end">
            {[
              { label: "3 Critical", color: P.red, bg: P.redBg },
              { label: "23 Awaiting Decision", color: P.amber, bg: P.amberBg },
              { label: "₹48.2L Revenue", color: P.green, bg: P.greenBg },
              { label: "84% Ops Health", color: P.purple, bg: P.lavender },
            ].map((chip, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ color: chip.color, background: chip.bg }}>{chip.label}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: P.lavenderDark, color: P.slate }}>
          Last synced from Odoo: 2 min ago · 847 records analysed · Confidence: 94%
        </div>
      </div>

      {/* Section B: Department Health Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>What is happening across the organization today?</div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {DEPARTMENTS.map((d, i) => <DeptHealthCard key={i} dept={d} />)}
        </div>
      </div>

      {/* Section C: Attention + Blocked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>What requires immediate attention?</div>
          <div className="space-y-2.5">
            <AttentionItem severity="Critical" title="Aluminum 6061 Stock Depleting" explanation="Production Line 2 will halt in 72h if material not procured. PO-0871 pending approval is the blocker." time="3 days remaining" link="View in Approval Center" />
            <AttentionItem severity="High" title="4 Purchase Orders Stalled" explanation="POs linked to active production orders have been waiting 2h+. Delivery commitments for Orders #8821 and #8834 at risk." time="2h 14m waiting" link="View in Approval Center" />
            <AttentionItem severity="High" title="Customer Payment Overdue" explanation="Apex Corp invoice ₹7.4L is 47 days past due. No response to last 2 follow-ups. Recommend escalation." time="47 days overdue" />
            <AttentionItem severity="High" title="Production Order PRD-445 Delayed" explanation="2 days behind schedule due to material shortage. Customer delivery date 28 Jul at risk." time="2 days late" />
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Which operations are blocked?</div>
          <BlockedChain items={[
            { blocked: "Production Line 2", by: "Aluminum 6061 shortage", needs: "PO-0871 approval", color: P.red },
            { blocked: "Customer Delivery #8821", by: "PRD-445 production delay", needs: "Material shortage resolved", color: P.amber },
            { blocked: "Project Phoenix Milestone", by: "BOM-341 engineering approval", needs: "Technical review complete", color: P.amber },
            { blocked: "Vendor Invoice Payment", by: "Finance audit pending", needs: "CFO authorization", color: P.cyan },
          ]} />
        </div>
      </div>

      {/* Section D: Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>What changed since yesterday?</div>
          <ChangeItem label="Revenue" delta="+₹1.2L" note="New orders received" />
          <ChangeItem label="Purchase Requests" delta="+3 raised" note="Pending approval queue" />
          <ChangeItem label="Quality Score" delta="+0.4%" note="NCR-2088 resolved" />
          <ChangeItem label="Project Alpha" delta="-At Risk" note="Timeline slip detected" />
          <ChangeItem label="Vendor Registrations" delta="+2 new" note="Awaiting verification" />
          <ChangeItem label="Inventory Items" delta="-5 below reorder" note="Consumed below reorder level" />
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>What are the biggest business risks?</div>
          <div className="space-y-2.5">
            <RiskCard rank={1} title="Inventory Depletion" level="HIGH" body="3 critical materials below safety stock. Production stoppage probability: 78% within 5 days without action." action="Expedite PO approvals" />
            <RiskCard rank={2} title="Cash Flow Tightening" level="MEDIUM" body="AR overdue ₹18.2L from 5 customers. DSO trending up 4 days vs last month." action="AR follow-up" />
            <RiskCard rank={3} title="Vendor Reliability" level="MEDIUM" body="Shree Metals: 3 late deliveries in 6 weeks. Alternate sourcing recommended." action="Qualify alternates" />
            <RiskCard rank={4} title="Production Capacity" level="LOW" body="Line 2 efficiency 78%. Weekly output target will be missed by ~12% if not addressed." action="Maintenance review" />
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>What decisions are waiting?</div>
          <div className="text-2xl font-bold mb-1" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>23 items</div>
          <div className="text-xs mb-3" style={{ color: P.textMuted }}>require your decision</div>
          <div className="space-y-2">
            {APPROVALS.slice(0, 4).map((apv, i) => {
              const pc = apv.priority === "Critical" ? P.red : apv.priority === "High" ? P.amber : apv.priority === "Medium" ? P.cyan : P.green;
              return (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                  <span className="text-xs font-mono font-bold flex-1 min-w-0 truncate" style={{ color: P.indigo }}>{apv.id}</span>
                  <span className="text-xs" style={{ color: P.textMuted }}>{apv.amount}</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ color: pc, background: pc + "22" }}>{apv.priority}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs font-semibold cursor-pointer" style={{ color: P.purple }}>View All in Approval Center →</div>
        </div>
      </div>

      {/* Section E: Completed Today */}
      <div className="rounded-2xl border" style={{ borderColor: P.border, background: P.card }}>
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setCompletedExpanded(!completedExpanded)}
        >
          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: P.textMuted }}>What has been completed today?</div>
          <button style={{ color: P.textMuted }}>{completedExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </div>
        {completedExpanded && (
          <div className="px-4 pb-4 space-y-2.5">
            {[
              { text: "Production Order PRD-441 completed", detail: "48 units produced, on schedule" },
              { text: "Invoice INV-229 approved and scheduled for payment", detail: "₹2.8L — payment scheduled for today" },
              { text: "Vendor Kapoor Industries onboarded", detail: "Quality verification passed, active" },
              { text: "Quality inspection QC-2088 resolved", detail: "NCR closed, corrective action documented" },
              { text: "Customer delivery Order #8804 dispatched", detail: "Reliance Corp, on time" },
              { text: "BOM-339 approved", detail: "Engineering sign-off received, ready for production" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: P.green }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: P.text }}>{item.text}</div>
                  <div className="text-xs" style={{ color: P.textMuted }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Approval Center View ─────────────────────────────────────────────────────
function ApprovalCenterView() {
  const [centerTab, setCenterTab] = useState<"active" | "history">("active");
  const [selectedApv, setSelectedApv] = useState<typeof APPROVALS[0] | null>(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [reviewKey, setReviewKey] = useState(0);
  const [startReview, setStartReview] = useState(false);

  function handleReview(apv: typeof APPROVALS[0]) {
    setSelectedApv(apv);
    setStartReview(true);
    setReviewKey(k => k + 1);
  }

  function handleSelect(apv: typeof APPROVALS[0]) {
    setSelectedApv(apv);
    setStartReview(false);
    setReviewKey(k => k + 1);
  }

  const filters = ["All", "Critical", "High", "Medium", "Purchase Orders", "BOMs", "Expenses"];
  const filtered = filterPriority === "All" ? APPROVALS :
    filterPriority === "Purchase Orders" ? APPROVALS.filter(a => a.type === "Purchase Order") :
    filterPriority === "BOMs" ? APPROVALS.filter(a => a.type === "BOM Revision") :
    filterPriority === "Expenses" ? APPROVALS.filter(a => a.type === "Team Training") :
    APPROVALS.filter(a => a.priority === filterPriority);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 border-r flex flex-col" style={{ borderColor: P.border }}>
        {/* Panel header */}
        <div className="p-3 border-b" style={{ borderColor: P.border }}>
          <div className="flex gap-1 mb-2">
            <button onClick={() => setCenterTab("active")} className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ background: centerTab === "active" ? P.purple : P.bg, color: centerTab === "active" ? "white" : P.textMuted }}>Active (23)</button>
            <button onClick={() => setCenterTab("history")} className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ background: centerTab === "history" ? P.purple : P.bg, color: centerTab === "history" ? "white" : P.textMuted }}>History</button>
          </div>
          {centerTab === "active" && (
            <div className="flex flex-wrap gap-1">
              {filters.map(f => (
                <button key={f} onClick={() => setFilterPriority(f)}
                  className="px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
                  style={{ background: filterPriority === f ? P.purple : P.bg, color: filterPriority === f ? "white" : P.textMuted }}>
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {centerTab === "active" ? filtered.map(apv => (
            <ApprovalCard
              key={apv.id}
              apv={apv}
              selected={selectedApv?.id === apv.id}
              onClick={() => handleSelect(apv)}
              onReview={() => handleReview(apv)}
            />
          )) : (
            <div className="p-3 text-xs text-center" style={{ color: P.textMuted }}>Select History tab to view full history</div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-hidden">
        {centerTab === "history" ? (
          <div className="h-full overflow-y-auto">
            <ApprovalHistoryView />
          </div>
        ) : selectedApv ? (
          <ApprovalDetail key={reviewKey} apv={selectedApv} startReview={startReview} />
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: P.textMuted }}>
            <div className="text-center">
              <ClipboardCheck size={40} className="mx-auto mb-3 opacity-30" />
              <div className="text-sm">Select an approval to review</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Intelligence View ─────────────────────────────────────────────────────
function AIIntelligenceView() {
  const approvalId = useId();
  const accuracyId = useId();
  return (
    <div className="p-6 flex gap-6">
      {/* Main left */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Daily Executive Summary */}
        <div className="rounded-2xl border p-5" style={{ background: "linear-gradient(135deg, #F4F2FF 0%, #F0FEFF 100%)", borderColor: P.lavenderDark }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} style={{ color: P.purple }} />
            <span className="text-xs font-medium" style={{ color: P.purple }}>AI-Generated · Updated 9:45 AM · Based on 847 Odoo records</span>
          </div>
          <div className="text-base font-bold mb-3" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Today's Business Intelligence Summary</div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: P.text }}>
            Revenue performance remains strong at ₹48.2L month-to-date, tracking 8.7% above July target, with Reliance Corp and Zenith Industries accounting for 62% of new order intake this week. However, the business faces a <strong>material supply crisis</strong> that requires immediate executive intervention: Aluminum 6061 inventory at 14 units will halt Line 2 production within 72 hours, directly endangering the ₹18L Apex Corp order due 28 Jul. Procurement efficiency has degraded — average PO approval time is now 2.8 hours against a 45-minute target, a 273% overage that is causing cascading production delays. On the financial side, AR aging has worsened with ₹18.2L overdue from 5 customers and DSO trending up 4 days versus last month, tightening working capital. Quality metrics remain solid at 97.3% but one open NCR and one batch hold require resolution today to prevent delivery impact. <strong>Recommended priorities: (1) approve PO-0871 immediately, (2) escalate Apex Corp AR, (3) schedule Line 2 efficiency review.</strong>
          </p>
          <div className="mb-3">
            <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: P.purple }}>Key Takeaways</div>
            <ul className="space-y-1">
              {[
                "Revenue is on track but a production halt in 72h could reverse gains this week",
                "Approval velocity is the single biggest operational risk — 4 critical POs have been waiting 2h+",
                "AR collections need immediate escalation — ₹18.2L overdue is squeezing working capital",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: P.text }}>
                  <span className="font-bold mt-0.5" style={{ color: P.purple }}>•</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-3" style={{ background: P.card }}>
            <div className="text-xs font-bold mb-2" style={{ color: P.text }}>What needs your decision today</div>
            {[
              "Approve PO-0871 (Aluminum 6061) — blocks Line 2 production",
              "Clear 3 remaining stalled POs — delivery risk on Orders #8821, #8834",
              "Escalate Apex Corp AR collection — ₹7.4L, 47 days overdue",
              "Review Line 2 efficiency — 78%, schedule maintenance",
              "Resolve BOM-341 approval — Project Phoenix milestone at risk",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs py-1" style={{ color: P.text }}>
                <span className="font-bold w-4 flex-shrink-0" style={{ color: P.indigo }}>{i + 1}.</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* Detected Anomalies */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Detected Anomalies</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              { title: "Unusual Spending Pattern", body: "Procurement spend 34% above 30-day average. 3 vendors received POs in same week for similar materials. Possible duplicate procurement.", level: "MEDIUM" },
              { title: "Production Efficiency Drop", body: "Line 2 efficiency fell 11% vs last week. Maintenance was performed 6 days ago. Pattern matches pre-failure signature from March 2024.", level: "HIGH" },
              { title: "Vendor Payment Anomaly", body: "Kapoor Industries received payment 12 days earlier than contractual terms. ₹3.14L processed before delivery confirmation.", level: "HIGH" },
              { title: "Inventory Consumption Spike", body: "Aluminum 6061 consumption 2.4× normal rate this week. Either production surge or unrecorded waste. Reconciliation recommended.", level: "MEDIUM" },
            ].map((a, i) => {
              const c = a.level === "HIGH" ? P.red : P.amber;
              const bg = a.level === "HIGH" ? P.redBg : P.amberBg;
              return (
                <div key={i} className="rounded-xl border p-4" style={{ borderColor: c + "44", background: bg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} style={{ color: c }} />
                    <span className="text-sm font-semibold" style={{ color: P.text }}>{a.title}</span>
                    <span className="ml-auto text-xs font-bold" style={{ color: c }}>{a.level}</span>
                  </div>
                  <p className="text-xs leading-snug" style={{ color: P.textMuted }}>{a.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottleneck Predictions */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Operational Bottleneck Predictions</div>
          <div className="space-y-3">
            {[
              { title: "Line 2 production halt if Aluminum PO not approved today", timeframe: "In 3 days", prob: 89, depts: ["Production", "Procurement", "Finance"], action: "Approve PO-0871 immediately", impact: "₹18L customer order at risk" },
              { title: "Project Phoenix milestone miss if BOM-341 not cleared this week", timeframe: "In 7 days", prob: 74, depts: ["Engineering", "Projects", "Delivery"], action: "Clear BOM-341 today", impact: "Client relationship and delivery penalty risk" },
              { title: "Cash flow stress if AR collections not escalated", timeframe: "In 14 days", prob: 61, depts: ["Finance", "Operations"], action: "Escalate Apex Corp and 4 other overdue accounts", impact: "Working capital constraint" },
            ].map((pred, i) => {
              const c = pred.prob > 80 ? P.red : pred.prob > 65 ? P.amber : P.cyan;
              return (
                <div key={i} className="rounded-xl border p-4" style={{ borderColor: P.border, background: P.card }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: c + "15" }}>
                      <Target size={16} style={{ color: c }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: c, background: c + "15" }}>{pred.timeframe}</span>
                        <span className="text-xs font-bold" style={{ color: c }}>{pred.prob}% probability</span>
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: P.text }}>{pred.title}</div>
                      <div className="w-full rounded-full h-1.5 mb-2" style={{ background: P.border }}>
                        <div className="h-full rounded-full" style={{ width: `${pred.prob}%`, background: c }} />
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {pred.depts.map((d, j) => <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ background: P.lavender, color: P.purple }}>{d}</span>)}
                      </div>
                      <div className="text-xs" style={{ color: P.green }}><strong>Action:</strong> {pred.action}</div>
                      <div className="text-xs" style={{ color: P.red }}><strong>If ignored:</strong> {pred.impact}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend Analysis */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Trend Analysis</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4" style={{ borderColor: P.border, background: P.card }}>
              <div className="text-sm font-semibold mb-3" style={{ color: P.text }}>Procurement Approval Time (last 30 days)</div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={approvalTimeData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: P.textMuted }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 9, fill: P.textMuted }} tickLine={false} axisLine={false} unit="h" />
                  <Tooltip contentStyle={{ fontSize: 11, borderColor: P.border }} />
                  <Line type="monotone" dataKey="time" stroke={P.purple} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: P.border, background: P.card }}>
              <div className="text-sm font-semibold mb-3" style={{ color: P.text }}>AI Recommendation Accuracy (last 12 weeks)</div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={aiAccuracyData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                  <defs>
                    <linearGradient id={accuracyId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={P.green} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={P.green} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: P.textMuted }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: P.textMuted }} tickLine={false} axisLine={false} domain={[80, 100]} unit="%" />
                  <Tooltip contentStyle={{ fontSize: 11, borderColor: P.border }} />
                  <Area type="monotone" dataKey="accuracy" stroke={P.green} strokeWidth={2} fill={`url(#${accuracyId})`} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-64 flex-shrink-0 space-y-4">
        {/* Priorities */}
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Recommended Priorities</div>
          <div className="text-xs mb-2" style={{ color: P.textMuted }}>Based on current ERP data, AI recommends:</div>
          {[
            { task: "Approve PO-0871 for Aluminum 6061", urgency: "Critical", time: "5 min", impact: "Prevents Line 2 halt" },
            { task: "Clear 3 stalled POs in queue", urgency: "Critical", time: "15 min", impact: "Unblocks delivery" },
            { task: "Escalate Apex Corp AR ₹7.4L", urgency: "High", time: "10 min", impact: "Improves cash flow" },
            { task: "Approve BOM-2024-0341", urgency: "High", time: "5 min", impact: "₹1.2L cost saving" },
            { task: "Review Line 2 efficiency report", urgency: "Medium", time: "20 min", impact: "Production improvement" },
            { task: "Verify Kapoor Industries invoice", urgency: "Medium", time: "10 min", impact: "Prevent overpayment" },
          ].map((p, i) => {
            const c = p.urgency === "Critical" ? P.red : p.urgency === "High" ? P.amber : P.green;
            return (
              <div key={i} className="flex items-start gap-2 py-2 border-b last:border-0" style={{ borderColor: P.border }}>
                <span className="w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-white flex-shrink-0 mt-0.5" style={{ background: c }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: P.text }}>{p.task}</div>
                  <div className="text-xs" style={{ color: P.textMuted }}>{p.time} · {p.impact}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Register */}
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: P.textMuted }}>Risk Register</div>
          {[
            { name: "Inventory Depletion", prob: 78, impact: "High", trend: "↑ Increasing" },
            { name: "Cash Flow Stress", prob: 54, impact: "Medium", trend: "↑ Increasing" },
            { name: "Vendor Single-Source", prob: 62, impact: "High", trend: "→ Stable" },
            { name: "Approval Backlog", prob: 88, impact: "High", trend: "↑ Increasing" },
          ].map((r, i) => {
            const c = r.prob > 70 ? P.red : r.prob > 50 ? P.amber : P.green;
            return (
              <div key={i} className="py-2 border-b last:border-0" style={{ borderColor: P.border }}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-medium" style={{ color: P.text }}>{r.name}</span>
                  <span className="text-xs font-bold" style={{ color: c }}>{r.prob}%</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: P.textMuted }}>
                  <span>Impact: {r.impact}</span>
                  <span style={{ color: r.trend.startsWith("↑") ? P.red : P.textMuted }}>{r.trend}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Health Check */}
        <div className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: P.purple }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: P.textMuted }}>AI Health Check</span>
          </div>
          {[
            { label: "Records analysed", value: "847" },
            { label: "Last sync", value: "2 min ago" },
            { label: "Anomalies detected", value: "4" },
            { label: "Predictions active", value: "3" },
            { label: "Accuracy rate", value: "91%" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs" style={{ borderColor: P.border }}>
              <span style={{ color: P.textMuted }}>{item.label}</span>
              <span className="font-bold font-mono" style={{ color: P.text }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Business Intelligence View ───────────────────────────────────────────────
function BusinessIntelView() {
  const cycleId = useId();

  const bottlenecks = [
    { domain: "Procurement", title: "Approval Velocity Gap", cause: "Average approval time 2.8h vs 45min target. 3 approvers consistently delay responses during morning hours.", depts: ["Production", "Inventory"], impact: "₹12L production value at risk weekly", action: "Automate low-risk PO approvals under ₹50k", confidence: 91, urgency: "HIGH" },
    { domain: "Inventory", title: "Raw Material Single-Source Risk", cause: "4 critical materials sourced from single vendors. Shree Metals supplies 3 of them with degrading performance over 6 weeks.", depts: ["Production", "Quality"], impact: "Production halt risk within 2 weeks", action: "Qualify alternate suppliers for Aluminum, SS304, Copper", confidence: 87, urgency: "CRITICAL" },
    { domain: "Production", title: "Line 2 Efficiency Degradation", cause: "Efficiency at 78%, 11% below target. Root cause: unplanned micro-stoppages averaging 4/shift since maintenance last week.", depts: ["Production", "Finance"], impact: "12% weekly output shortfall ≈ ₹6.2L", action: "Schedule preventive maintenance and operator review", confidence: 83, urgency: "HIGH" },
    { domain: "Finance", title: "Accounts Receivable Aging", cause: "₹18.2L overdue >30 days from 5 customers. No structured follow-up process. DSO increasing 4 days vs last month.", depts: ["Finance", "Operations"], impact: "Cash flow tightening, working capital stress", action: "Implement AR aging alerts and escalation workflow", confidence: 94, urgency: "HIGH" },
    { domain: "Quality", title: "Inspection Backlog", cause: "Average inspection time 3.2 days vs 1-day target. Understaffed QC team during peak production on Lines 1 and 3.", depts: ["Production", "Delivery"], impact: "Customer delivery delays averaging 1.4 days", action: "Prioritise QC capacity for Line 1 and Line 3", confidence: 78, urgency: "MEDIUM" },
    { domain: "Projects", title: "Engineering Change Lag", cause: "BOM revision approvals averaging 4.1 days. Engineering change approvals averaging 2.3 days beyond 24h SLA.", depts: ["Engineering", "Production"], impact: "Project milestones slipping, rework risk", action: "Set SLA for BOM approvals at 24h with escalation", confidence: 82, urgency: "MEDIUM" },
  ];

  const depts = ["Procurement", "Production", "Inventory", "Finance", "Quality", "Projects", "Delivery"];
  const impactMatrix: Record<string, Record<string, string>> = {
    "Approval Velocity Gap": { Procurement: "critical", Production: "high", Inventory: "medium", Finance: "low", Quality: "none", Projects: "low", Delivery: "high" },
    "Raw Material Single-Source Risk": { Procurement: "high", Production: "critical", Inventory: "critical", Finance: "medium", Quality: "high", Projects: "medium", Delivery: "high" },
    "Line 2 Efficiency Degradation": { Procurement: "none", Production: "critical", Inventory: "medium", Finance: "high", Quality: "medium", Projects: "none", Delivery: "high" },
    "Accounts Receivable Aging": { Procurement: "none", Production: "none", Inventory: "none", Finance: "critical", Quality: "none", Projects: "none", Delivery: "none" },
    "Inspection Backlog": { Procurement: "none", Production: "medium", Inventory: "none", Finance: "low", Quality: "critical", Projects: "none", Delivery: "high" },
    "Engineering Change Lag": { Procurement: "none", Production: "high", Inventory: "low", Finance: "none", Quality: "medium", Projects: "critical", Delivery: "medium" },
  };
  const impactColor: Record<string, string> = { critical: P.red, high: P.amber, medium: "#FCD34D", low: "#6EE7B7", none: P.border };
  const impactLabel: Record<string, string> = { critical: "C", high: "H", medium: "M", low: "L", none: "·" };

  return (
    <div className="p-6 space-y-8">
      {/* Bottleneck Cards */}
      <div>
        <div className="mb-1 text-base font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Operational Bottlenecks — Cross-functional Visibility</div>
        <div className="text-xs mb-4" style={{ color: P.textMuted }}>AI-identified constraints affecting business throughput</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {bottlenecks.map((b, i) => {
            const c = b.urgency === "CRITICAL" ? P.red : b.urgency === "HIGH" ? P.amber : P.cyan;
            const bg = b.urgency === "CRITICAL" ? P.redBg : b.urgency === "HIGH" ? P.amberBg : P.cyanBg;
            return (
              <div key={i} className="rounded-2xl border p-4 flex flex-col gap-2" style={{ borderColor: c + "44", background: bg }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color: P.purple, background: P.lavender }}>{b.domain}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: c }}>{b.urgency}</span>
                </div>
                <div className="text-sm font-bold" style={{ color: P.text }}>{b.title}</div>
                <p className="text-xs leading-snug" style={{ color: P.textMuted }}>{b.cause}</p>
                <div className="flex flex-wrap gap-1">
                  {b.depts.map((d, j) => <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ background: P.card, color: P.slate }}>{d}</span>)}
                </div>
                <div className="text-xs font-semibold" style={{ color: c }}>Impact: {b.impact}</div>
                <div className="text-xs" style={{ color: P.indigo }}>Action: {b.action}</div>
                <div className="flex items-center justify-between text-xs" style={{ color: P.textMuted }}>
                  <span>AI Confidence</span><span className="font-bold" style={{ color: P.green }}>{b.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-functional Impact Map */}
      <div>
        <div className="mb-1 text-base font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cross-functional Impact Map</div>
        <div className="text-xs mb-4" style={{ color: P.textMuted }}>How each bottleneck cascades across departments · C=Critical H=High M=Medium L=Low</div>
        <div className="rounded-2xl border overflow-auto" style={{ borderColor: P.border }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: P.bg }}>
                <th className="text-left p-3 font-semibold min-w-48" style={{ color: P.textMuted }}>Bottleneck</th>
                {depts.map(d => <th key={d} className="p-3 font-semibold" style={{ color: P.textMuted }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((b, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${P.border}` }}>
                  <td className="p-3 font-medium" style={{ color: P.text }}>{b.title}</td>
                  {depts.map(d => {
                    const level = impactMatrix[b.title]?.[d] ?? "none";
                    const color = impactColor[level];
                    return (
                      <td key={d} className="p-3 text-center">
                        <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-white font-bold text-xs" style={{ background: color }}>{impactLabel[level]}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div>
        <div className="mb-4 text-base font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>This Month vs Last Month — Key Operational Metrics</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-5" style={{ borderColor: P.border, background: P.card }}>
            <div className="text-sm font-semibold mb-3" style={{ color: P.text }}>Approval Cycle Time Trend (last 30 days, hours)</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={approvalCycleData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                <defs>
                  <linearGradient id={cycleId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P.purple} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={P.purple} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: P.textMuted }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10, fill: P.textMuted }} tickLine={false} axisLine={false} unit="h" />
                <Tooltip contentStyle={{ fontSize: 11, borderColor: P.border }} />
                <Area type="monotone" dataKey="hours" stroke={P.purple} strokeWidth={2} fill={`url(#${cycleId})`} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: P.border, background: P.card }}>
            <div className="text-sm font-semibold mb-3" style={{ color: P.text }}>Bottleneck Frequency by Department (this month vs last)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={bottleneckFreqData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: P.textMuted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: P.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderColor: P.border }} />
                <Bar dataKey="lastMonth" fill={P.lavenderDark} name="Last Month" isAnimationActive={false} radius={[3, 3, 0, 0]} />
                <Bar dataKey="thisMonth" fill={P.purple} name="This Month" isAnimationActive={false} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Full-page AI Assistant ───────────────────────────────────────────────────
const SUGGESTED_GROUPS = [
  {
    label: "Approvals",
    questions: [
      "Why should PO-0871 be approved?",
      "Show delayed purchase orders",
      "Which approvals are high risk today?",
      "Compare PO-0871 with previous similar approvals",
    ],
  },
  {
    label: "Operations",
    questions: [
      "What needs my attention today?",
      "Which operations are currently blocked?",
      "Summarise today's production status",
      "What changed since yesterday?",
    ],
  },
  {
    label: "Inventory & Production",
    questions: [
      "What inventory will run out this week?",
      "Which production orders are at risk?",
      "Show materials below safety stock",
      "Predict production delays",
    ],
  },
  {
    label: "Finance & Vendors",
    questions: [
      "Which vendors are underperforming?",
      "Show overdue customer invoices",
      "What is the current cash flow status?",
      "Generate executive summary",
    ],
  },
];

const FULL_AI_RESPONSES: Record<string, { text: string; tags?: string[] }> = {
  "Why should PO-0871 be approved?": {
    text: `**PO-2024-0871 — Aluminum 6061 (500 kg) from Reliance Steel Ltd — ₹4,82,000**

AI Recommendation: ✅ Approve — Expedite

Here's the business case:

📦 **Inventory:** Current stock is 14 units against a safety stock of 50. At current consumption, Line 2 halts in 72 hours without this material.

🏭 **Production:** Production Order PRD-0445 is directly blocked. This order fulfils Apex Corp's ₹18L customer order due 28 July.

🤝 **Vendor:** Reliance Steel Ltd has a 94% on-time delivery record across 28 transactions in the last 12 months. No quality rejections. No duplicate PO detected.

💰 **Financial:** ₹4,82,000 outflow protects ₹18,00,000 in revenue. Net positive impact: ₹13,18,000.

⚠️ **If rejected or delayed:** Line 2 stops in 3 days → PRD-0445 misses deadline → Apex Corp delivery delayed → customer escalation risk → potential penalty clause activation.

AI Confidence: 87% · Risk Score: 72/100 (elevated due to single-source dependency on this material)`,
    tags: ["PO-2024-0871", "Aluminum 6061", "Reliance Steel", "PRD-0445"],
  },
  "What needs my attention today?": {
    text: `**Today's Priority Briefing — 17 July 2026**

Based on live Odoo data (847 records analysed), here are your top 5 priorities ranked by business impact:

1. 🔴 **Approve PO-2024-0871 immediately** — Blocks Line 2 in 72h. ₹18L order at risk. Takes 2 minutes to review with AI and approve.

2. 🔴 **Escalate Apex Corp AR (₹7.4L, 47 days overdue)** — No response to last 2 follow-ups. Recommend escalation to senior contact or legal review.

3. 🟡 **Review BOM-2024-0341** — Engineering change saving ₹1.2L per batch. Waiting 45 minutes. Low risk, high reward — quick win.

4. 🟡 **Investigate Line 2 efficiency drop** — Down 11% vs last week. Pattern matches pre-failure signature from March 2024. Preventive maintenance recommended before weekend.

5. 🟡 **Close NCR-2091** — Quality non-conformance open 4 days. Batch B-2024-110 on hold. Resolution will unblock 2 production orders.

Total estimated time if all actions taken today: ~3 hours.`,
    tags: ["PO-2024-0871", "Apex Corp", "BOM-0341", "Line 2", "NCR-2091"],
  },
  "What inventory will run out this week?": {
    text: `**Critical Inventory Depletion Forecast — Next 7 Days**

🔴 **CRITICAL (0–3 days)**
• Aluminum 6061 — 14 units remaining — **3-day supply** — blocks Line 2 production
• SS304 Sheet 2mm — 8 units remaining — **2-day supply** — affects 3 production orders

🟡 **HIGH (4–5 days)**
• Copper Wire 4mm — 22 units remaining — **4-day supply** — impacts electrical assembly
• Bearing SKF 6205 — 31 units remaining — **5-day supply** — maintenance stock

🟢 **MEDIUM (6–7 days)**
• Cutting Tool Insert TGN322 — 18 units — **6-day supply**
• Hydraulic Oil ISO 46 — 2 drums — **7-day supply**

**Recommended Action:** Raise RFQs immediately for Aluminum 6061 and SS304. Both have approved vendors (Reliance Steel, Kapoor Metals). Lead time typically 3–5 days.

PO approvals PO-0871 and PO-0868 cover the first two depletions — expediting these approvals is the single highest-leverage action today.`,
    tags: ["Aluminum 6061", "SS304", "Copper Wire", "Inventory Alert"],
  },
  "Which vendors are underperforming?": {
    text: `**Vendor Performance Analysis — Last 90 Days**

🔴 **Critical Performance Issues**
**Shree Metals Ltd** — Overall Score: 58/100
• On-time delivery: 67% (target: 90%)
• 3 quality rejections in July alone
• Average delay: 4.8 days per shipment
• Recommendation: Issue formal performance notice. Qualify alternate supplier immediately — Tata Steel or Jindal are pre-qualified.

🟡 **Below Target**
**Delta Plastics Pvt Ltd** — Overall Score: 71/100
• 2 rejected batches in July (moisture content)
• Average delay: 4.2 days
• Recommendation: Quality audit at supplier facility. Consider conditional approval only.

**Global Fasteners Co** — Overall Score: 74/100
• 78% on-time (target: 90%)
• Pricing 12% above market rate (benchmark: 3 alternative suppliers)
• Recommendation: Renegotiate pricing or source alternatives

🟢 **Top Performers (for reference)**
• Reliance Steel Ltd — 94% on-time, zero quality issues
• Kapoor Industries — 96% on-time, A+ rating

Want me to draft a vendor performance notice for Shree Metals?`,
    tags: ["Shree Metals", "Delta Plastics", "Vendor Risk", "Quality"],
  },
  "Predict production delays": {
    text: `**AI Production Risk Forecast**

Based on current inventory levels, pending approvals, and historical patterns:

📅 **In 3 days (20 Jul)**
🔴 Line 2 production halt — **89% probability**
Cause: Aluminum 6061 depletion. Mitigated by: Approve PO-2024-0871 today.

📅 **In 5 days (22 Jul)**
🟡 PRD-0445 delivery deadline miss — **81% probability**
Cause: Cascading from Line 2 halt. Affects: Apex Corp ₹18L order.

📅 **In 7 days (24 Jul)**
🟡 Project Phoenix Milestone 3 miss — **74% probability**
Cause: BOM-0341 approval delay holding up engineering documentation.

📅 **In 10 days (27 Jul)**
🟡 SS304 production stoppage — **68% probability**
Cause: SS304 Sheet 2mm depletion. PO-0868 in approval queue.

📅 **In 14 days (31 Jul)**
🟡 Cash flow pressure — **61% probability**
Cause: AR aging + delayed vendor payments combining.

**Key insight:** Clearing the PO approval queue today resolves the first 3 risk items with a single action cluster. Estimated 2-hour effort prevents ₹20L+ in downstream impact.`,
    tags: ["Line 2", "PRD-0445", "Production Risk", "Forecast"],
  },
  "Generate executive summary": {
    text: `**HABU TECHNOLOGY — EXECUTIVE SUMMARY**
*17 July 2026 · Generated 09:45 AM · Based on 847 Odoo records*

---

**Business Health: 84% — Moderate ⚠️**

**Revenue & Finance**
MTD Revenue: ₹48.2L (+8.7% vs target) ✅
Profit: ₹11.6L (+9.1%) ✅
Cash Flow: ₹12.4L available — tightening risk
AR Overdue: ₹18.2L (5 customers, avg 38 days)

**Operations**
Production: 47 orders running across 3 lines
Efficiency: Line 1: 94% ✅ | Line 2: 78% ⚠️ | Line 3: 91% ✅
Quality Score: 97.3% (+0.4% vs yesterday)

**Procurement**
Pending Approvals: 23 (₹14.2L combined)
Critical: 2 (blocking production)
High Risk: 4 (>2h waiting)

**Inventory**
Critical Shortages: 2 materials (Aluminum 6061, SS304)
Low Stock Alerts: 12 items
Estimated Days to Halt: 3 days (if POs not cleared)

**Key Risks Today**
1. Production halt in 72h (inventory-linked) — Severity: CRITICAL
2. Customer delivery miss for Apex Corp — Severity: HIGH
3. Vendor reliability: Shree Metals degrading — Severity: HIGH

**CEO Recommendation:** Clear PO queue, expedite AR collection, schedule Line 2 maintenance.`,
    tags: ["Executive", "Revenue", "Production", "Risk"],
  },
  "Which approvals are high risk today?": {
    text: `**High Risk Approvals Requiring Immediate Attention**

🔴 **CRITICAL RISK**
**PO-2024-0871** — Purchase Order — ₹4,82,000 — Risk: 72/100
• Blocking: Production Line 2 (72h to halt)
• Vendor: Reliance Steel (reliable) — expedite approval
• Wait time: 2h 14m

**INV-2024-0233** — Invoice Approval — ₹3,14,000 — Risk: 68/100
• Flagged: Early payment outside contractual terms
• Requires: CFO review before approving
• Wait time: 5h 22m

🟡 **MEDIUM RISK**
**PRD-2024-0456** — Production Order — ₹7,65,000 — Risk: 55/100
• Capacity concern: Line 3 at 91% — additional load may affect quality
• Recommend: Schedule check before approval
• Wait time: 1h 30m

🟢 **LOW RISK (Safe to Approve)**
**BOM-2024-0341** — BOM Revision — ₹1,20,000 saving — Risk: 34/100
**EXP-2024-0112** — Training Expense — ₹28,500 — Risk: 18/100

Want me to open the AI review for any of these?`,
    tags: ["High Risk", "PO-0871", "INV-0233", "PRD-0456"],
  },
  "Show overdue customer invoices": {
    text: `**Accounts Receivable — Overdue Invoices**

Total Overdue: ₹18.2L across 5 customers

🔴 **Critical (>45 days)**
• Apex Corp — ₹7,40,000 — **47 days overdue** — No response to 2 follow-ups. Recommend escalation.
• Zenith Industries — ₹6,10,000 — **51 days overdue** — Disputed invoice (quantity mismatch). Pending resolution.

🟡 **High (31–45 days)**
• Suresh Machinery — ₹2,80,000 — **38 days overdue** — Partial payment promised by 20 Jul.
• Kapoor Exports — ₹1,20,000 — **33 days overdue** — New contact person, following up.

🟡 **Medium (15–30 days)**
• Bharat Steel Fab — ₹50,000 — **22 days overdue** — Payment in process per email.

**Recommended Actions:**
1. Apex Corp: Escalate to CEO level contact. Consider placing on credit hold.
2. Zenith Industries: Schedule dispute resolution call this week.
3. Suresh Machinery: Confirm 20 Jul payment commitment in writing.

Collecting Apex Corp and Zenith alone would improve cash flow by ₹13.5L.`,
    tags: ["AR", "Apex Corp", "Zenith", "Collections"],
  },
  "What is the current cash flow status?": {
    text: `**Cash Flow Analysis — 17 July 2026**

**Current Position: ₹12.4L available** ⚠️ (Moderate — tightening trend)

**Inflows (MTD)**
• Revenue collected: ₹38.6L
• AR received this week: ₹4.2L
• Total MTD: ₹42.8L

**Outflows (MTD)**
• Vendor payments: ₹22.1L
• Operating expenses: ₹8.3L
• Total MTD: ₹30.4L

**Risk Factors**
• ₹18.2L AR overdue (not yet collected)
• ₹14.2L PO approvals pending (outflow when approved)
• Net stressed position: potentially -₹20L within 30 days if AR not collected

**Forecast (Next 30 Days)**
• Expected inflows: ₹52L (if collections normalise)
• Expected outflows: ₹44L
• Net: +₹8L (healthy if AR collected)
• Without AR collection: -₹12L (cash flow stress)

**AI Recommendation:** Prioritise Apex Corp (₹7.4L) and Zenith Industries (₹6.1L) AR collection this week. This single action converts a projected cash stress into a comfortable position.`,
    tags: ["Cash Flow", "AR", "Finance", "Forecast"],
  },
  default: {
    text: `I've scanned 847 live Odoo records. Here's my current read on the business:

**Most Urgent:** Approve PO-2024-0871 before end of morning — it blocks Line 2 production in 72 hours and puts a ₹18L customer order at risk.

**Also Needs Attention:**
• Apex Corp payment ₹7.4L is 47 days overdue
• BOM-2024-0341 has a ₹1.2L cost saving waiting on approval
• Line 2 efficiency is down 11% — potential equipment issue

Is there a specific area you'd like me to investigate deeper? I can analyse approvals, inventory, production, vendors, finance, or generate reports.`,
    tags: ["Overview"],
  },
};

function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai" as const,
      text: "Hello Rajiv! I'm your Habu AI Assistant — continuously monitoring 847 Odoo ERP records in real time.\n\nI've identified 5 items that need your attention today. The most critical: **Aluminum 6061 stock will halt Line 2 production in 72 hours** unless PO-2024-0871 is approved today.\n\nWhat would you like to explore?",
      tags: [] as string[],
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeSuggGroup, setActiveSuggGroup] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function send(text: string) {
    if (!text.trim() || typing) return;
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { role: "user", text, tags: [], time }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const resp = FULL_AI_RESPONSES[text] ?? FULL_AI_RESPONSES.default;
      setMessages(m => [...m, { role: "ai", text: resp.text, tags: resp.tags ?? [], time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 900 + Math.random() * 800);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Render markdown-lite: bold with **, bullet points
  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <p key={i} className={line.startsWith("•") || line.startsWith("-") ? "ml-3" : ""} style={{ marginBottom: line === "" ? "0.5rem" : "0.15rem" }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: P.text, fontWeight: 700 }}>{part}</strong>
              : <span key={j}>{part}</span>
          )}
        </p>
      );
    });
  }

  const proactiveItems = [
    { color: P.red, label: "CRITICAL", text: "PO-0871 blocks Line 2 in 72h", action: "Why should PO-0871 be approved?" },
    { color: P.amber, label: "HIGH", text: "Apex Corp ₹7.4L — 47 days overdue", action: "Show overdue customer invoices" },
    { color: P.amber, label: "HIGH", text: "Line 2 efficiency down 11%", action: "Predict production delays" },
    { color: P.cyan, label: "INFO", text: "23 approvals pending — ₹14.2L total", action: "Which approvals are high risk today?" },
    { color: P.green, label: "INSIGHT", text: "Revenue +8.7% vs July target", action: "Generate executive summary" },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Chat */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: P.border, background: P.card }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${P.purple}, ${P.indigo})` }}>
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Habu AI Assistant</div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: P.textMuted }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Live · Connected to Odoo ERP · 847 records monitored
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: P.textMuted }}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: P.lavender }}>
              <Sparkles size={11} style={{ color: P.purple }} />
              <span style={{ color: P.purple, fontWeight: 600 }}>AI Confidence: 94%</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl" style={{ background: P.greenBg, color: P.green, fontWeight: 600 }}>
              Last sync: 2 min ago
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: `${P.border} transparent` }}>
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: P.lavender }}>
                  <Sparkles size={14} style={{ color: P.purple }} />
                </div>
              )}
              <div className="max-w-[75%] space-y-1.5">
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: m.role === "user" ? P.purple : P.card,
                    color: m.role === "user" ? "#fff" : P.text,
                    border: m.role === "user" ? "none" : `1px solid ${P.border}`,
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                    boxShadow: m.role === "ai" ? "0 1px 6px rgba(0,0,0,0.04)" : "none",
                  }}
                >
                  {m.role === "ai" ? renderText(m.text) : m.text}
                </div>
                {m.role === "ai" && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {m.tags.map((tag, ti) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: P.lavender, color: P.indigo }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs px-1" style={{ color: P.textMuted }}>{m.time}</div>
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold" style={{ background: P.indigo }}>
                  RK
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: P.lavender }}>
                <Sparkles size={14} style={{ color: P.purple }} />
              </div>
              <div className="rounded-2xl px-4 py-3" style={{ background: P.card, border: `1px solid ${P.border}` }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: P.purple, animationDelay: `${d}s` }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: P.textMuted }}>Analysing Odoo data…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions bar */}
        <div className="flex-shrink-0 px-6 py-3 border-t" style={{ borderColor: P.border, background: P.card }}>
          <div className="flex gap-2 mb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {SUGGESTED_GROUPS.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveSuggGroup(i)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                style={{
                  background: activeSuggGroup === i ? P.purple : P.lavender,
                  color: activeSuggGroup === i ? "#fff" : P.purple,
                }}
              >{g.label}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {SUGGESTED_GROUPS[activeSuggGroup].questions.map((q, i) => (
              <button
                key={i}
                onClick={() => { send(q); inputRef.current?.focus(); }}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-xl border transition-all hover:border-[#C4BEFF] hover:bg-[#F4F2FF] whitespace-nowrap"
                style={{ borderColor: P.border, color: P.slate, background: P.bg }}
              >{q}</button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t flex-shrink-0" style={{ borderColor: P.border, background: P.card }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors" style={{ background: P.bg, borderColor: P.border }}>
            <MessageSquare size={16} style={{ color: P.textMuted, flexShrink: 0 }} />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: P.text }}
              placeholder="Ask about approvals, inventory, production, finance, vendors, or any operational question…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
              style={{ background: P.purple, color: "#fff" }}
            >
              <Send size={12} /> Send
            </button>
          </div>
          <div className="text-xs mt-2 text-center" style={{ color: P.textMuted }}>
            AI responses are generated from live Odoo ERP data · Always verify critical decisions
          </div>
        </div>
      </div>

      {/* Right: Proactive Insights Panel */}
      <div className="w-72 flex-shrink-0 border-l flex flex-col overflow-hidden" style={{ borderColor: P.border, background: P.card }}>
        <div className="px-4 py-4 border-b flex-shrink-0" style={{ borderColor: P.border }}>
          <div className="font-bold text-sm" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Proactive Alerts
          </div>
          <div className="text-xs mt-0.5" style={{ color: P.textMuted }}>AI-detected — click to ask</div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: "thin" }}>
          {proactiveItems.map((item, i) => (
            <button
              key={i}
              onClick={() => send(item.action)}
              className="w-full text-left p-3 rounded-xl border transition-all hover:border-[#C4BEFF] hover:shadow-sm"
              style={{ borderColor: P.border, background: P.bg }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: item.color + "22", color: item.color }}>
                  {item.label}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: P.text }}>{item.text}</p>
              <p className="text-xs mt-1" style={{ color: P.purple }}>Ask AI →</p>
            </button>
          ))}
        </div>

        {/* AI Stats */}
        <div className="p-4 border-t flex-shrink-0 space-y-3" style={{ borderColor: P.border }}>
          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: P.textMuted }}>AI Status</div>
          {[
            { label: "Records Analysed", value: "847" },
            { label: "Anomalies Detected", value: "4" },
            { label: "Active Predictions", value: "3" },
            { label: "Recommendation Accuracy", value: "91%" },
            { label: "Last Full Sync", value: "2 min ago" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span style={{ color: P.textMuted }}>{s.label}</span>
              <span className="font-semibold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: ClipboardCheck, label: "Approval Center", id: "approvals" },
  { icon: Bot, label: "AI Assistant", id: "assistant" },
  { icon: Sparkles, label: "AI Intelligence", id: "ai" },
  { icon: BarChart3, label: "Business Intel", id: "business" },
  { icon: Settings, label: "Settings", id: "settings" },
];

function Sidebar({ active, onNav, collapsed, onToggle }: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="h-full flex flex-col border-r transition-all duration-200 flex-shrink-0"
      style={{ width: collapsed ? 72 : 240, background: P.card, borderColor: P.border }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b flex-shrink-0" style={{ borderColor: P.border }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: P.purple }}>
          <Zap size={14} color="white" />
        </div>
        {!collapsed && (
          <div className="ml-2.5 overflow-hidden">
            <div className="text-sm font-bold leading-none" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Habu</div>
            <div className="text-xs" style={{ color: P.textMuted }}>Enterprise Ops</div>
          </div>
        )}
        <button onClick={onToggle} className="ml-auto text-slate-400 hover:text-slate-600 flex-shrink-0">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl text-sm font-medium transition-colors mb-0.5"
              style={{
                width: "calc(100% - 12px)",
                background: isActive ? P.lavender : "transparent",
                color: isActive ? P.purple : P.textMuted,
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.id === "approvals" && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: P.amber, color: "white" }}>23</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t" style={{ borderColor: P.border }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: P.purple }}>RK</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-semibold truncate" style={{ color: P.text }}>Rajiv Kumar</div>
              <div className="text-xs truncate" style={{ color: P.textMuted }}>Operations Head</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar() {
  const [time, setTime] = useState(new Date());
  return (
    <div className="h-14 border-b flex items-center px-4 gap-4 flex-shrink-0" style={{ background: P.card, borderColor: P.border }}>
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-1 max-w-xs" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <Search size={14} style={{ color: P.textMuted }} />
        <input placeholder="Search across all operations..." className="bg-transparent text-sm outline-none flex-1" style={{ color: P.text }} readOnly />
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: P.lavender, color: P.purple }}>⌘K</span>
      </div>
      {/* Date / time */}
      <div className="flex-1 text-center">
        <div className="text-sm font-semibold" style={{ color: P.text, fontFamily: "'DM Mono', monospace" }}>
          {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: P.bg }}>
          <Bell size={16} style={{ color: P.textMuted }} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: P.red }}>4</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: P.purple }}>RK</div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold" style={{ color: P.text }}>Rajiv Kumar</div>
            <div className="text-xs" style={{ color: P.textMuted }}>Operations Head</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="text-base font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</div>
      {[
        { section: "ERP Connection", items: ["Odoo instance URL", "Sync frequency", "API credentials"] },
        { section: "Notifications", items: ["Email alerts", "Desktop notifications", "Critical threshold alerts"] },
        { section: "AI Preferences", items: ["Confidence threshold", "Auto-flag sensitivity", "Recommendation verbosity"] },
        { section: "Display", items: ["Theme", "Language", "Date format"] },
      ].map((s, i) => (
        <div key={i} className="rounded-2xl border p-4" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-sm font-bold mb-3" style={{ color: P.text }}>{s.section}</div>
          {s.items.map((item, j) => (
            <div key={j} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: P.border, color: P.textMuted }}>
              <span>{item}</span>
              <span className="text-xs px-2 py-1 rounded" style={{ background: P.bg, color: P.slate }}>Configure</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
// ─── AI Assistant (floating) ──────────────────────────────────────────────────
const AI_RESPONSES: Record<string, string> = {
  default: "I've scanned all 847 records in Odoo. Here's what stands out: Aluminum 6061 has 3 days of supply left, 4 purchase orders are awaiting approval and blocking production commitments, and Apex Corp's ₹7.4L invoice is 47 days overdue. Would you like me to prioritise any of these?",
  "What needs my attention today?": "Today's top 5 priorities:\n1. Approve PO-2024-0871 immediately — blocks Line 2 production in 72h\n2. Follow up on Apex Corp ₹7.4L payment (47 days overdue)\n3. Review BOM-2024-0341 — cost saving of ₹1.2L waiting on engineering sign-off\n4. Check Line 2 efficiency drop — down 11% vs last week, possible equipment issue\n5. Verify quality hold on Batch B-2024-110 — NCR-2091 is 4 days open",
  "Why should PO-0871 be approved?": "PO-2024-0871 is for 500 kg of Aluminum 6061 from Reliance Steel Ltd (₹4,82,000). Without it:\n• Line 2 halts in ~72 hours\n• Production Order PRD-0445 is blocked\n• Apex Corp's ₹18L order (due 28 Jul) is at risk\n\nVendor has a 94% on-time delivery rate. No duplicate detected. Budget is within quarterly limits. AI confidence to approve: 87%.",
  "Show delayed purchase orders": "4 purchase orders are currently delayed or at risk:\n• PO-2024-0871 — Aluminum 6061 — waiting 2h 14m — CRITICAL\n• PO-2024-0868 — SS304 Sheet — waiting 1h 45m — HIGH\n• PO-2024-0855 — Copper Wire — waiting 3h 02m — MEDIUM\n• PO-2024-0849 — Machine Parts — waiting 4h 18m — HIGH\n\nPO-0871 is the most urgent — linked to an active production order.",
  "What inventory will run out this week?": "Critical inventory depletions this week:\n🔴 Aluminum 6061 — 14 units — 3 days supply — CRITICAL\n🔴 SS304 Sheet 2mm — 8 units — 2 days supply — CRITICAL\n🟡 Copper Wire 4mm — 22 units — 4 days supply — HIGH\n🟡 Bearing SKF 6205 — 31 units — 5 days supply — MEDIUM\n\nRaise RFQs immediately for the first two. SS304 is even more urgent than Aluminum.",
  "Which vendors are underperforming?": "Underperforming vendors this quarter:\n1. Shree Metals Ltd — 67% on-time (target 90%) — 3 quality issues — CRITICAL\n2. Delta Plastics Pvt Ltd — 2 rejected batches in July — avg delay 4.2 days\n3. Global Fasteners Co — 78% on-time — pricing 12% above market rate\n\nRecommend issuing performance notice to Shree Metals and qualifying Apex Steel as an alternate supplier.",
  "Predict production delays": "Based on current data, AI predicts:\n• In 3 days: Line 2 halts (Aluminum shortage) — 89% probability\n• In 7 days: PRD-0445 misses delivery date for Apex Corp — 81% probability\n• In 10 days: Project Phoenix milestone delayed — 74% probability\n• In 14 days: Cash flow stress if AR not collected — 61% probability\n\nImmediate action on PO-0871 resolves the first two cascading risks.",
  "Generate executive summary": "📊 HABU TECHNOLOGY — DAILY EXECUTIVE SUMMARY\n17 July 2026 · Generated at 09:45 AM\n\nOperational Health: 84% (Moderate)\nRevenue MTD: ₹48.2L (+8.7% vs target) ✅\nProduction: 47 orders running, 3 at risk ⚠️\nInventory: 3 critical materials below safety stock 🔴\nApprovals Pending: 23 items (₹14.2L combined value)\nQuality Score: 97.3% (+0.4% vs yesterday) ✅\n\nTOP RISK: Aluminum 6061 depletion will halt Line 2 in 72 hours. PO-0871 approval is the single most important action today.",
};

const QUICK_QUESTIONS = [
  "What needs my attention today?",
  "Why should PO-0871 be approved?",
  "Show delayed purchase orders",
  "What inventory will run out this week?",
  "Which vendors are underperforming?",
  "Predict production delays",
  "Generate executive summary",
];

function AIAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello Rajiv! I'm continuously monitoring Habu's Odoo ERP — 847 records analysed as of 9:43 AM.\n\nI've identified 5 items that need your attention today, including a critical inventory shortage that will halt Line 2 production in 72 hours. Ask me anything about operations, approvals, vendors, or inventory." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = AI_RESPONSES[text] ?? AI_RESPONSES.default;
      setMessages(m => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, 1100 + Math.random() * 600);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl border overflow-hidden"
      style={{
        width: 400, height: 560, background: P.card, borderColor: P.border,
        boxShadow: `0 20px 60px ${P.purple}20, 0 4px 20px rgba(0,0,0,0.08)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${P.purple}18, ${P.cyanBg})`, borderBottom: `1px solid ${P.border}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: P.purple }}>
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Habu AI Assistant</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs" style={{ color: P.purple }}>Live · 847 records monitored</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors">
          <X size={15} style={{ color: P.textMuted }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: `${P.border} transparent` }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {m.role === "ai" && (
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: P.lavender }}>
                <Sparkles size={11} style={{ color: P.purple }} />
              </div>
            )}
            <div
              className="max-w-[82%] text-xs rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line"
              style={{
                background: m.role === "user" ? P.purple : P.bg,
                color: m.role === "user" ? "#fff" : P.text,
                border: m.role === "user" ? "none" : `1px solid ${P.border}`,
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: P.lavender }}>
              <Sparkles size={11} style={{ color: P.purple }} />
            </div>
            <div className="flex gap-1 px-3.5 py-2.5 rounded-2xl" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
              {[0, 0.15, 0.3].map((d, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: P.purple, animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {QUICK_QUESTIONS.slice(0, 3).map(q => (
          <button key={q} onClick={() => send(q)}
            className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors hover:border-[#C4BEFF] hover:bg-[#F4F2FF] whitespace-nowrap"
            style={{ borderColor: P.border, color: P.slate }}
          >{q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${P.border}` }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
          <input
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: P.text }}
            placeholder="Ask about approvals, inventory, production, risks…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
          />
          <button
            onClick={() => send(input)}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: input.trim() ? P.purple : P.border }}
          >
            <Send size={11} style={{ color: input.trim() ? "#fff" : P.textMuted }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const viewLabels: Record<string, string> = {
    overview: "Operational Command Center",
    approvals: "Approval Center",
    assistant: "AI Assistant",
    ai: "AI Intelligence",
    business: "Business Intelligence",
    settings: "Settings",
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: P.bg, fontFamily: "'Inter', sans-serif", color: P.text }}>
      <Sidebar active={activeView} onNav={setActiveView} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        {/* Page title */}
        <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: P.border, background: P.card }}>
          <div className="text-sm font-bold" style={{ color: P.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{viewLabels[activeView]}</div>
          <div className="text-xs" style={{ color: P.textMuted }}>Habu Technology · Live from Odoo · 847 records</div>
        </div>
        {/* Content */}
        <div
          className={`flex-1 ${(activeView === "approvals" || activeView === "assistant") ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}
          style={{ background: P.bg }}
        >
          {activeView === "overview" && <OverviewView />}
          {activeView === "approvals" && (
            <div className="flex-1 overflow-hidden" style={{ height: "100%" }}>
              <ApprovalCenterView />
            </div>
          )}
          {activeView === "assistant" && (
            <div className="flex-1 overflow-hidden" style={{ height: "100%" }}>
              <AIAssistantPage />
            </div>
          )}
          {activeView === "ai" && <AIIntelligenceView />}
          {activeView === "business" && <BusinessIntelView />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </div>

      {/* Floating AI Assistant */}
      {chatOpen
        ? <AIAssistant onClose={() => setChatOpen(false)} />
        : (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-white text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${P.purple}, ${P.indigo})`,
              boxShadow: `0 8px 30px ${P.purple}45`,
            }}
          >
            <Bot size={16} />
            AI Assistant
            <span className="flex gap-1">
              {[0, 0.15, 0.3].map((d, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
          </button>
        )
      }
    </div>
  );
}
