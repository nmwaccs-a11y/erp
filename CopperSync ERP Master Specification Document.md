# **MASTER SPECIFICATION DOCUMENT: CopperSync ERP**

**Version:** 1.0

**Date:** February 12, 2026

**Visual Identity:** QT Capital "Systematic Intelligence" (Dark Mode / High-Frequency Trading Aesthetic).

## ---

**1\. PROJECT DESCRIPTION**

**CopperSync** is a specialized Vertical SaaS ERP designed for the Copper Wire Manufacturing & Trading industry in South Asia (Gujranwala/Lahore markets).

Unlike generic ERPs (SAP/Odoo), CopperSync is built to handle specific localized market practices that standard software cannot manage:

* **Suda / Rate Pending:** The ability to receive inventory (Inward Gate Pass) without a fixed price, and fix the rate days or weeks later retroactively.  
* **Mazdori / Premium Sales:** Selling finished goods based on a "Making Charge" (Premium) \+ "Reference Copper Rate", rather than a simple fixed price.  
* **Net-for-Net (Hwala):** Managing weight-based trading with vendors where "Burning Loss" is settled via cash premiums rather than weight deductions.  
* **Parchi System:** Managing informal financial commitments alongside formal banking channels in a unified Cashbook.

**Target User Experience:** The system rejects traditional "drab" ERP interfaces in favor of a "Mission Control" aesthetic—dark, immersive, and mathematically precise, designed to reduce eye strain and highlight critical data signals.

## ---

**2\. MODULES OVERVIEW**

The system is composed of **12 Core Modules**:

1. **Authentication & Admin:** Multi-tenancy, Security, User Management.  
2. **Dashboards:** Role-specific Command Centers (Admin, Production, Finance).  
3. **Masters & Configuration:** COA, Items, Labor Rates, Wastage Formulas.  
4. **Procurement (Inward):** Gate Passes, Weighbridge Integration, POs.  
5. **Rate Management (Suda):** Retroactive Rate Fixing for Pending Inventory.  
6. **Production Core:** Drawing, Enamel, Workshop, Downtime Tracking.  
7. **Inventory & Hwala:** Multi-warehouse, Virtual Vendor Stock, Auditing.  
8. **Sales & Dispatch:** Direct/Premium Invoicing, Credit Control.  
9. **Financials:** Unified Cashbook, Parchi Management, Ledgers.  
10. **Alerts & Risk Watchdog:** Automated background risk monitoring.  
11. **Reports & Analytics:** P\&L, Costing, Yield, Aging.  
12. **Archives & Audit Trail:** Digital Evidence (Images) and Activity Logs.

## ---

**3\. FUNCTIONAL REQUIREMENTS (113+ FRs)**

### **Module 1: Administration & Security**

* **FR-1.01:** System shall support multi-tenancy, isolating data per Company ID.  
* **FR-1.02:** System shall implement Role-Based Access Control (RBAC) with default roles (Super Admin, Accountant, Gatekeeper).  
* **FR-1.03:** System shall allow custom permission sets (e.g., "View Only" for Investors).  
* **FR-1.04:** System shall enforce 2-Factor Authentication (2FA) for Admin/Finance roles.  
* **FR-1.05:** System shall log IP Address and Device Type for all logins.  
* **FR-1.06:** System shall auto-logout users after 30 minutes of inactivity.  
* **FR-1.07:** System shall allow Admins to "Force Logout" specific users.  
* **FR-1.08:** System shall allow IP Range restrictions (e.g., Factory Wi-Fi only).  
* **FR-1.09:** System shall provide a secure Password Reset workflow via email.  
* **FR-1.10:** System shall encrypt sensitive data (passwords, API keys) at rest.

### **Module 2: Masters & Configuration**

* **FR-2.01:** System shall provide a default hierarchical Chart of Accounts (Assets, Liabilities, etc.).  
* **FR-2.02:** System shall allow defining Item Categories (Raw, WIP, Finish, Scrap, Chemical).  
* **FR-2.03:** System shall maintain a "Labor Rate Matrix" (Gauge vs Rate) for auto-calculation.  
* **FR-2.04:** System shall allow defining "Wastage Formulas" per machine (e.g., Drawing \= 1%).  
* **FR-2.05:** System shall store item attributes like Solid\_Content\_% for chemicals.  
* **FR-2.06:** System shall manage Party Master with Credit Limits and Tax IDs.  
* **FR-2.07:** System shall allow setting Fiscal Years and locking closed periods.  
* **FR-2.08:** System shall allow defining multiple Warehouses (Main, Scrap, Virtual).  
* **FR-2.09:** System shall allow Excel/CSV import for master data.  
* **FR-2.10:** System shall allow configuration of "Allow Negative Stock" (Yes/No).

### **Module 3: Procurement (Inward)**

* **FR-3.01:** System shall generate unique Purchase Orders (PO) with PDF export.  
* **FR-3.02:** System shall allow Inward Gate Pass (IGP) creation linked to POs.  
* **FR-3.03:** System shall capture Gross, Tare, and Net weights.  
* **FR-3.04:** System shall integrate with Weighbridge to fetch Read-Only weight data.  
* **FR-3.05:** System shall provide a **"Rate Status Toggle"** (Fixed vs. Pending).  
* **FR-3.06:** If Rate is **Pending**, system shall increase Stock Qty but post **Zero Value** to Ledger.  
* **FR-3.07:** System shall log Pending entries in a "Pending Challans Register".  
* **FR-3.08:** System shall allow "Tare Pending" status for vehicles entering loaded.  
* **FR-3.09:** System shall capture Driver Name and Vehicle Number.  
* **FR-3.10:** System shall generate a Goods Receipt Note (GRN) PDF.

### **Module 4: Rate Management (Suda)**

* **FR-4.01:** System shall provide an interface listing all "Pending Rate" challans.  
* **FR-4.02:** System shall allow bulk selection of challans for a single party.  
* **FR-4.03:** System shall allow input of "Final Agreed Rate".  
* **FR-4.04:** System shall post a Journal Entry dated to the *Rate Fixing Date* (Debit Inventory / Credit Party).  
* **FR-4.05:** System shall retroactively update Inventory Valuation (WAC).  
* **FR-4.06:** System shall change status from Pending to Posted.  
* **FR-4.07:** System shall allow attaching digital proofs to Rate Fixing.  
* **FR-4.08:** System shall prevent Rate Fixing in closed fiscal periods.

### **Module 5: Production Core**

* **FR-5.01:** System shall provide a grid-based "Daily Production Log".  
* **FR-5.02:** System shall record Input Material (Batch/Weight) and Output Material (Gauge/Weight).  
* **FR-5.03:** System shall validate Input ≈ Output \+ Scrap within defined tolerance.  
* **FR-5.04:** System shall auto-move stock: Raw $\\to$ WIP $\\to$ Finish.  
* **FR-5.05:** System shall track Varnish consumption by "Drum" units.  
* **FR-5.06:** System shall auto-generate "Empty Drum" scrap stock upon issuance.  
* **FR-5.07:** System shall calculate Weekly Labor Wages based on output $\\times$ matrix rate.  
* **FR-5.08:** System shall allow "Downtime Recording" with reasons.  
* **FR-5.09:** System shall generate unique Batch IDs for traceability.  
* **FR-5.10:** System shall highlight high wastage entries in Red.

### **Module 6: Inventory & Hwala**

* **FR-6.01:** System shall maintain real-time stock balances for all warehouses.  
* **FR-6.02:** System shall support "Virtual Warehouses" for Vendor stock.  
* **FR-6.03:** System shall support "Hwala Transfers" (moving stock without financial impact).  
* **FR-6.04:** System shall enforce "Net-for-Net" logic on Hwala Returns.  
* **FR-6.05:** System shall record "Processing Premium" as a cost addition during Hwala Return.  
* **FR-6.06:** System shall allow Internal Stock Transfers.  
* **FR-6.07:** System shall provide a "Stock Taking" module for physical adjustments.  
* **FR-6.08:** System shall track Inventory Aging (Days since Inward).  
* **FR-6.09:** System shall generate Bin Cards for item history.  
* **FR-6.10:** System shall calculate total Inventory Value based on Weighted Average Cost.

### **Module 7: Sales & Dispatch**

* **FR-7.01:** System shall generate Sales Orders (SO) and track fulfillment.  
* **FR-7.02:** System shall generate Sales Invoices linked to SOs.  
* **FR-7.03:** System shall support "Direct Sale" (Debit \= Qty $\\times$ Rate).  
* **FR-7.04:** System shall support "Premium Sale" (Debit \= Qty $\\times$ Premium).  
* **FR-7.05:** For Premium Sales, system shall record Reference\_Scrap\_Rate for P\&L.  
* **FR-7.06:** System shall check Customer Credit Limit before approving Invoice.  
* **FR-7.07:** System shall apply GST/Tax logic if configured.  
* **FR-7.08:** System shall auto-generate Outward Gate Pass upon Invoice posting.  
* **FR-7.09:** System shall handle Sales Returns (Credit Notes).  
* **FR-7.10:** System shall allow sending Invoices via WhatsApp/Email.

### **Module 8: Financials (Cashbook)**

* **FR-8.01:** System shall provide a Unified Cashbook (Cash, Bank, Parchi).  
* **FR-8.02:** System shall allow creating "Parchi Commitments" (Amount, Due Date).  
* **FR-8.03:** System shall track Parchi status: Pending, Cleared, Bounced.  
* **FR-8.04:** System shall allow "Parchi Adjustment" to settle Ledger balances.  
* **FR-8.05:** System shall generate Parchi Aging Reports.  
* **FR-8.06:** System shall allow recording Expenses against COA heads.  
* **FR-8.07:** System shall provide Bank Reconciliation features.  
* **FR-8.08:** System shall allow Contra Entries (Cash $\\leftrightarrow$ Bank).  
* **FR-8.09:** System shall prevent negative Cash-in-Hand.

### **Module 9: Alerts & Risk**

* **FR-9.01:** System shall run a background risk scheduler every hour.  
* **FR-9.02:** System shall alert if Parchi is Due within X days.  
* **FR-9.03:** System shall alert if Scrap Stock is held \>3 days without fixed rate.  
* **FR-9.04:** System shall alert if Tare Weight is missing \>24 hours.  
* **FR-9.05:** System shall alert if Customer Debt Age \> threshold.  
* **FR-9.06:** System shall alert if Production Wastage \> formula tolerance.  
* **FR-9.07:** System shall display a "Risk Dashboard Widget".  
* **FR-9.08:** System shall allow configuration of all alert thresholds.  
* **FR-9.09:** System shall send Critical Alerts via Email/SMS.  
* **FR-9.10:** System shall log all alerts in history.

### **Module 10: Reports**

* **FR-10.01:** System shall generate Profit & Loss Statement.  
* **FR-10.02:** System shall generate Balance Sheet.  
* **FR-10.03:** System shall generate Trial Balance.  
* **FR-10.04:** System shall generate "Cost Per Kg" Report.  
* **FR-10.05:** System shall generate "Mazdori Party Report" (Financial \+ Material Balances).  
* **FR-10.06:** System shall generate Inventory Valuation Report.  
* **FR-10.07:** System shall generate Daily Production Summary.  
* **FR-10.08:** System shall generate Yield & Wastage Analysis.  
* **FR-10.09:** System shall generate AR/AP Aging Reports.  
* **FR-10.10:** System shall export reports to PDF/Excel.

### **Module 11: Archives & Audit**

* **FR-11.01:** System shall require Image Upload for Gate Passes.  
* **FR-11.02:** System shall require Image Upload for Parchi Commitments.  
* **FR-11.03:** System shall store images in secure cloud storage.  
* **FR-11.04:** System shall log Audit Trail for all Create/Edit/Delete actions.  
* **FR-11.05:** Audit Log shall capture User, Time, Old Value, New Value.  
* **FR-11.06:** System shall highlight "Suspicious Activity" in Audit Log.  
* **FR-11.07:** System shall prevent modification of the Audit Log.  
* **FR-11.08:** System shall provide a specific "User Activity Report".

## ---

**4\. USE CASES (User Stories)**

### **UC-01: Inward Procurement with Rate Pending (Suda)**

* **Actor:** Gatekeeper.  
* **Scenario:** Truck arrives with 5000kg Wire. Rate is undecided.  
* **Flow:**  
  1. Gatekeeper creates Inward Gate Pass. Connects Weighbridge.  
  2. Sets Rate Status to **"Pending"**.  
  3. System adds 5000kg to Stock but posts 0 Rs to Ledger.  
  4. *3 Days Later:* Owner opens "Rate Fixing", selects challan, enters 2400 Rs.  
  5. System posts Debit Inventory / Credit Supplier (12M Rs).

### **UC-02: Premium Sale (Mazdori)**

* **Actor:** Sales Manager.  
* **Scenario:** Selling 500kg Enamel Wire to a customer who provided scrap.  
* **Flow:**  
  1. Manager creates Invoice. Selects "Premium Sale".  
  2. Enters Premium Rate (450 Rs). Enters Ref Scrap Rate (2350 Rs \- Hidden).  
  3. System calculates Revenue \= 225,000 Rs.  
  4. System calculates COGS using Ref Rate to ensure accurate P\&L.

### **UC-03: Hwala (Virtual Loop)**

* **Actor:** Inventory Manager.  
* **Scenario:** Sending 1000kg Scrap to Vendor for processing.  
* **Flow:**  
  1. Create Outward GP: 1000kg Scrap $\\to$ "Virtual Warehouse (Vendor)".  
  2. System moves stock.  
  3. *Return:* Create Inward GP: 1000kg Wire \#8 from Vendor.  
  4. System deducts Scrap from Virtual, adds Wire to Main.  
  5. Manager records "Processing Fee" cash payment.

### **UC-04: Daily Production & Theft Check**

* **Actor:** Floor Manager.  
* **Scenario:** Recording daily output.  
* **Flow:**  
  1. Manager enters Input (1000kg) and Output (960kg) \+ Scrap (20kg).  
  2. Missing: 20kg (2%).  
  3. System Alert: "Wastage High (2%). Allowed 1%."  
  4. Manager must enter explanation to save.

### **UC-05: Parchi Settlement**

* **Actor:** Accountant.  
* **Scenario:** Clearing a due Parchi.  
* **Flow:**  
  1. Accountant selects "Pay Parchi".  
  2. Selects Parchi \#101 (500k). Source: "Meezan Bank".  
  3. System clears Parchi Liability, Credits Bank.

## ---

**5\. UI/UX SCREEN SPECIFICATIONS (58 Screens)**

**Design System:** QT Capital "Infinite Void". **Visual Rules:**

* **Background:** \#000000 or \#030303 (No Grey/White).  
* **Cards:** rgba(10,10,10,0.7) with blur(12px).  
* **Typography:** **Aeonik Fono** for all data/numbers.

* **Accents:** **Neon Green** (\#2CDE85), **Reactor Red** (\#FF4D4D), **Electric Lemon** (\#DBEB00).

### **Group 1: Authentication**

1. **1.01 Login Portal:** Black void, deep recessed inputs, Neon Cyan focus rings.

2. **1.02 2FA Verification:** 6-digit input with filling neon dots.  
3. **1.03 Password Reset:** Strength meter glowing Red $\\to$ Green.  
4. **1.04 Tenant Selection:** Grid of factory tiles with "Online" pulse status.

### **Group 2: Dashboards**

5. **2.01 Super Admin Command:** 12-col Bento Grid. "Net Liquidity" tile with Neon Green sparkline.

6. **2.02 Production HUD (Tablet):** Massive buttons (height: 80px). "Running" (Green Glow) / "Stopped" (Red Glow).  
7. **2.03 Financial Overview:** "Cash Velocity" bar charts (In vs Out).  
8. **2.04 Global Search:** Full-screen overlay with category filtering.

### **Group 3: Masters**

9. **3.01 System Config:** Vertical tabs with "Black Glass" toggles.

10. **3.02 COA Editor:** Tree view with subtle guide lines (white/5).  
11. **3.03 Item Master:** Data table with "Category" badges.  
12. **3.04 Item Details:** Form with specific attributes (Solid Content %).  
13. **3.05 Party Master:** Cards showing Credit Utilization bars.  
14. **3.06 Party Ledger Settings:** Opening Balance locking.  
15. **3.07 Labor Rate Matrix:** Spreadsheet-style grid for Gauge vs Rate.  
16. **3.08 Wastage Formula:** Machine-wise tolerance settings.

### **Group 4: Procurement**

17. **4.01 PO List:** Filterable table (Draft/Sent/Closed).  
18. **4.02 Create PO:** Vendor dropdown \+ Line Items grid.  
19. **4.03 Inward Gate Pass List:** Timeline feed. Status Badge: **"Tare Pending"** (Blinking Lemon Dot).  
20. **4.04 IGP Entry Form:**  
    * **Rate Toggle:** Switch between "Fixed" (Blue) and "Pending" (Electric Lemon). Pending collapses price fields.  
21. **4.05 Weighbridge Modal:** Floating glass overlay. Massive Digital Display font (14,500 KG).

### **Group 5: Rate Management**

22. **5.01 Pending Challans:** List view. Rows \>3 days glow Reactor Red.  
23. **5.02 Rate Fixing:** Bulk selection checkboxes. "Fix Rate" action bar.  
24. **5.03 Rate History:** Audit log of fixed rates.

### **Group 6: Production**

25. **6.01 Daily Drawing Log:** "Terminal" style grid. Wastage dot indicators (Green \<1%, Red \>1%).  
26. **6.02 Enamel Job List:** Kanban board (Queued/Running/Done).  
27. **6.03 Enamel Entry:** Inputs for Machine, Operator, Drum Toggle.  
28. **6.04 Workshop Log:** Rod-to-Strip conversion inputs.  
29. **6.05 Downtime Modal:** Stopwatch timer & Reason icons.

### **Group 7: Inventory**

30. **7.01 Stock Summary:** Bento grid of item cards. High stock \= Faint Green fill.  
31. **7.02 Hwala Map:** Node-link diagram. Glowing lines indicate active balance.  
32. **7.03 Virtual Warehouse:** Sidebar showing vendor-specific holdings.  
33. **7.04 Transfer Note:** Source $\\to$ Target dropdowns.  
34. **7.05 Stock Audit:** Table comparing System vs Physical Qty (Variance in Red/Green).  
35. **7.06 Bin Card:** Vertical timeline of item movement.

### **Group 8: Sales**

36. **8.01 Sales Order List:** Progress bars for fulfillment.  
37. **8.02 Invoice Generator:**  
    * **Sale Type:** Segmented Control (Direct/Premium). Premium reveals hidden Ref\_Scrap\_Rate in muted grey.  
38. **8.03 Dispatch Challan:** Driver signature pad.  
39. **8.04 Sales Return:** Credit Note creation form.

### **Group 9: Financials**

40. **9.01 Unified Cashbook:** Central axis list. Debits (Left/Red), Credits (Right/Green).  
41. **9.02 Transaction Modal:** Radial menu for Receive/Pay/Transfer.  
42. **9.03 Parchi Board:** Columns for Due Today/This Week/Future.  
43. **9.04 Parchi Modal:** Digital cheque interface. Days\_To\_Maturity counter updates live.  
44. **9.05 General Ledger:** Standard date-wise table with Monospace running balance.  
45. **9.06 Mazdori Ledger:** Split view (Money Balance | Material Balance).

### **Group 10: Alerts**

46. **10.01 Notification Dropdown:** List of alerts from Bell icon.  
47. **10.02 Risk Widget:** Traffic light dashboard component. Red light pulses if critical alerts exist.  
48. **10.03 Alert Rules:** Sliders for setting threshold limits.

### **Group 11: Reports**

49. **11.01 Reports Hub:** Icon grid of all reports.  
50. **11.02 P\&L Statement:** Waterfall chart visualization.  
51. **11.03 Balance Sheet:** T-Account visual.  
52. **11.04 Cost Per Kg:** Line chart with neon stroke (1.5px).  
53. **11.05 Yield Heatmap:** Grid colored by wastage intensity (Dark Green $\\to$ Bright Red).  
54. **11.06 Aging Analysis:** Stacked bar chart (0-30, 30-60, 60+).

### **Group 12: Archives**

55. **12.01 Document Viewer:** Lightbox for weighing slips. Zoom/Rotate controls.  
56. **12.02 Audit Trail:** Timeline of system actions.  
57. **12.03 Diff Viewer:** Split view showing Old vs New values.  
58. **12.04 User Log:** Activity history filtered by User ID.

    This is the specification for **Module 13: AI Market Intelligence & Prediction**. This module bridges the gap between your internal factory data and the external global economy, using Google's Gemini Models to give you a "Hedge Fund" level advantage.

---

# **MODULE 13: AI Market Intelligence & Prediction (The "Oracle")**

**Core Technology:** Google Gemini 1.5 Pro (via API).

**Purpose:** To predict Copper price movements using multi-asset analysis and to act as a "Chatbot Analyst" that knows everything about your factory's internal data.

## **1\. Functional Requirements (FRs)**

### **13.1 Market Analysis Engine (The "Hedge Fund" Brain)**

* **FR-13.01:** The system shall fetch real-time and historical data for **Copper (LME)**, **Crude Oil (Brent)**, **Gold (XAU)**, **USD/PKR Exchange Rate**, and **US Dollar Index (DXY)** via external financial APIs.  
* **FR-13.02:** The system shall send this data to the **Gemini API** to perform **Correlation Analysis** (e.g., *"Oil is up, Dollar is down $\\to$ Copper likely to rise"*).  
* **FR-13.03:** The system shall generate **Technical Analysis** signals using Gemini (RSI, MACD, Bollinger Bands) on the Copper chart.  
* **FR-13.04:** The system shall perform **Fundamental Analysis** by scraping news (e.g., "Strike in Chilean Mines", "China Manufacturing Data") and assessing sentiment.  
* **FR-13.05:** The system shall generate three specific prediction reports:  
  * **Next 24 Hours:** (Action: Buy Now / Wait).  
  * **Weekly Outlook:** (Trend: Bullish/Bearish).  
  * **Monthly Forecast:** (Inventory Strategy: Stockpile vs. Liquidate).

### **13.2 Internal Business Intelligence (The "Chat with Data")**

* **FR-13.06:** The system shall implement a **Text-to-SQL** engine. When a user asks *"Who are my top 5 loss-making customers?"*, the AI converts this to a SQL query, fetches data, and explains the answer.  
* **FR-13.07:** The AI must have read-access to: **Ledgers**, **Inventory Levels**, **Production Logs**, and **Parchi Commitments**.  
* **FR-13.08:** The system shall answer complex reasoning questions like: *"If I buy 50 tons of scrap at today's rate, and the market drops 2%, how much will I lose based on my current stock average?"*  
* **FR-13.09:** The system shall support **Voice Input** (Speech-to-Text) for the mobile app (e.g., *"Hey Oracle, is Alpha Cables' cheque cleared?"*).

---

## **2\. Use Cases (User Stories)**

### **UC-13A: The Morning Briefing (Prediction)**

* **Actor:** Owner.  
* **Scenario:** 9:00 AM Strategy Check.  
* **Flow:**  
  1. Owner opens the **"Oracle Dashboard"**.  
  2. AI Display: *"Copper Sentiment: **BEARISH** (65% Confidence)."*  
  3. Reasoning: *"The US Dollar Index (DXY) rose sharply overnight, and China released weak manufacturing data. Oil is also down."*  
  4. **AI Recommendation:** *"Do not fix rates for Pending Inward Challans today. Wait for a drop to $8,400."*  
  5. Owner decides to hold off on "Suda" fixing.

### **UC-13B: The "Chat Analyst" (Internal Data)**

* **Actor:** Sales Manager.  
* **Scenario:** Checking client history before a deal.  
* **Flow:**  
  1. Manager opens Chat: *"Tell me about Party 'Beta Transformers'. Are they risky?"*  
  2. **AI Response:** *"Analysis of Beta Transformers:*  
     * *Current Debt:* 2.5 Million PKR (High).  
     * *Avg Payment Delay:* 45 Days (Slow).  
     * *Trend:* They stopped buying Premium Wire 2 months ago.  
     * *Verdict:* **High Risk**. Do not offer credit \> 500k."\*

---

## **3\. UI/UX Screen Specifications**

### **Screen 13.01: The Oracle Dashboard (Market View)**

* **Design Aesthetic:** "Bloombeerg Terminal" meets "Sci-Fi".  
* **Layout:** 3-Pane View.  
  * **Left (The Chart):** LME Copper Chart with AI annotations (e.g., arrows drawn by AI pointing to resistance levels).  
  * **Top Right (The Narrative):** A typing text effect (Monospace) where Gemini explains the market: *"Global supply chain looks tight due to strikes in Peru..."*  
  * **Bottom Right (Correlations):** A correlation heat map.  
    * *Oil:* 🟢 (+0.8)  
    * *Dollar:* 🔴 (-0.9)  
    * *Gold:* 🟡 (+0.2)

### **Screen 13.02: The "Oracle Chat" (Internal Query)**

* **Location:** A floating button (Orb Icon) present on every screen.  
* **Interaction:** Clicking opens a Glassmorphism Chat Panel.  
* **Visuals:**  
  * **User Message:** Aligned Right (Cyan Border).  
  * **AI Thinking:** A pulsing nebula animation (\#2CDE85) while fetching SQL data.  
  * **AI Response:** Aligned Left. Supports Tables and Mini-Charts inside the chat bubble.  
* **Sample Query:** *"Show me a bar chart of my production wastage for last week."* $\\to$ AI generates a chart widget *inside* the chat.

---

### **Integration Note for Developers**

* **API Key:** Store the Gemini API Key in the .env file (GEMINI\_API\_KEY).  
* **Context Window:** You must feed the AI a "System Prompt" containing your database schema (table names, column names) so it knows *how* to query your data. It does **not** need the actual data rows in the prompt, just the structure.  
59. 