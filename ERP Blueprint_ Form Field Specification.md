I completely understand. If this document is going directly to your development team (or Antigravity), it cannot just be a high-level overview—it needs to be a granular, field-by-field blueprint so there is absolutely zero guesswork when building the database schemas and UI screens.

Here is the **Ultimate Architectural Blueprint (Version 5.0)**. It contains every single module, every form, every specific field (with data types and UI behaviors), and the exact database impact for each action.

You can copy everything below the line directly into your documentation.

### ---

**\[ DOCUMENT START \]**

# **ULTIMATE SYSTEM BLUEPRINT: CopperSync ERP**

**Target Market:** Gujranwala Copper Manufacturing & Trading

**Version:** 5.0 (Granular Form & Field Specification)

**Core Architecture:** Dual-Ledger (Financial Khata \+ Metal Khata), Floating Net-for-Net Balances, Triangle Trade, and Dynamic Watta.

## ---

**MODULE 1: MASTER DATA & RULES ENGINE**

**Motivation:** The foundation of the ERP. If data isn't configured correctly here, the transactional forms will fail.

### **Form 1.1: Party Master (Customers & Vendors)**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Party ID** | Auto-ID | Read-Only | e.g., PTY-001. Hidden DB PK is UUID. |
| **Party Name** | String | Text Input | e.g., "Ali Copper Traders" |
| **Party Type** | Enum | Segmented Control | \`\[ Customer |
| **Opening Fin. Bal** | Decimal | Number Input | Starting PKR balance. |
| **Opening Metal Bal** | Decimal | Number Input | Starting KG balance (Advance or Owed). |
| **Credit Limit (PKR)** | Decimal | Number Input | Auto-blocks sales if exceeded. |

### **Form 1.2: Item Master**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Item Code** | Auto-ID | Read-Only | e.g., ITM-001. |
| **Item Name** | String | Text Input | e.g., "Enameled Wire 28 SWG" |
| **Category** | Enum | Dropdown | \`\[ Raw |
| **Standard Unit** | String | Dropdown | KG, Drum, Piece. |

### **Form 1.3: Watta (Premium) Master Matrix**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Contract ID** | Auto-ID | Read-Only | e.g., WAT-26-001. |
| **Party** | UUID | Dropdown | Links to Party Master. |
| **Effective Date** | Date | Date Picker | Rates apply from this date onward to protect old data. |
| **Direction** | Toggle | UI Toggle | \`\[ Sales (Gauge) |
| **Grid: Min/Max Spec** | Integer | Grid Input | E.g., Min Gauge 25, Max Gauge 30 (or Purity Enum). |
| **Grid: Watta Rate** | Decimal | Grid Input | E.g., 513 PKR. Used by billing engines. |

## ---

**MODULE 2: SALES & TRIANGLE TRADE (OUTWARD)**

**Motivation:** Handles both standard trading (Direct) and toll manufacturing billing (Premium/Mazdori), plus direct-to-vendor scrap routing.

### **Form 2.1: Sales Invoice (Direct & Premium)**

*Database Impact: Deducts Inventory, Hits Customer Fin. Khata (PKR), Hits Customer Metal Khata (KG).*

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Invoice ID** | Auto-ID | Read-Only | e.g., SI-26-0001. |
| **Date** | Date | Date Picker | Defaults to Today. |
| **Customer** | UUID | Dropdown | Selects Party. Checks Credit Limit. |
| **Sale Mode** | Toggle | UI Switch | \`\[ Direct |
| **Ref Scrap Rate** | Decimal | Number Input | Visible ONLY if Mode \= Premium. |
| **Grid: Item** | UUID | Dropdown | Filters by 'Finish' or 'Scrap'. |
| **Grid: Gauge** | Integer | Number Input | Used to query Watta Matrix. |
| **Grid: Gross Wt.** | Decimal | Number Input | Weight with drum. |
| **Grid: Tare Wt.** | Decimal | Number Input | Empty drum weight. |
| **Grid: Net Wt.** | Decimal | Auto-Calc | Gross \- Tare. **Deducts from Inventory & Metal Khata.** |
| **Grid: Watta Rate** | Decimal | Auto-Fetch | System finds Watta based on Party, Date, and Gauge. |
| **Grid: Final Rate** | Decimal | Auto-Calc | If Direct: Manual Input. If Premium: Ref Rate \+ Watta Rate. |
| **Grid: Amount** | Decimal | Auto-Calc | Net Wt. \* Final Rate. |
| **Final Total** | Decimal | Auto-Calc | Sum of grid. **Hits Financial Khata (PKR).** |

### **Form 2.2: Triangle Trade Scrap Drop (Direct to Vendor)**

*Database Impact: ZERO impact on Main Factory Inventory. Shifts Metal Khata balances.*

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Transfer ID** | Auto-ID | Read-Only | e.g., TT-26-001. |
| **Source Customer** | UUID | Dropdown | **Credits** Customer's Metal Khata (+KG). |
| **Dest. Vendor** | UUID | Dropdown | **Debits** Vendor's Metal Khata (-KG). |
| **Item** | UUID | Dropdown | e.g., Copper Scrap. |
| **Weight** | Decimal | Number Input | Amount dropped off. |
| **Remaining Qty** | Background | Hidden | Sets Remaining\_Unsettled\_Weight \= Input Weight (For later batch splitting). |

## ---

**MODULE 3: HWALA & VENDOR SETTLEMENTS (INWARD)**

**Motivation:** Decouples physical metal receipts from financial settlements. Allows partial clearing of old scrap batches against bulk incoming wire.

### **Form 3.1: Vendor Settlement Receipt (The Batch Splitter)**

*Database Impact: Adds to Factory Inventory. Clears pending scrap batches. Calculates and posts Purchase Mazdoori to Fin. Khata.*

**Section A: Incoming Physical Stock**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Receipt ID** | Auto-ID | Read-Only | e.g., VR-26-0001. |
| **Vendor** | UUID | Dropdown | Selects Purchase Party. |
| **Received Item** | UUID | Dropdown | e.g., "Wire No 8". |
| **Net Weight In** | Decimal | Number Input | e.g., 2300kg. **Instantly adds to Factory Stock & Vendor Metal Khata.** |
| **Purity Level** | Enum | Dropdown | e.g., 90%+. |
| **Vendor Watta** | Decimal | Auto-Fetch | System fetches Watta based on Vendor, Date, Purity. |

**Section B: Scrap Allocation Matrix (Clearing old batches)**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Pending Batches** | Query | Modal Grid | Shows all vendor's scrap where Remaining\_Unsettled\_Weight \> 0\. |
| **Selected Batch** | Checkbox | UI Action | User selects row (e.g., 700kg @ 3000 Rs). |
| **Consume Qty** | Decimal | Number Input | User inputs how much of this batch to clear (e.g., 700kg). Reduces Remaining\_Unsettled\_Weight in DB. |

**Section C: Financial Settlement Engine**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Total Consumed** | Decimal | Auto-Calc | Sum of 'Consume Qty' column (e.g., 1000kg). |
| **Unallocated Wire** | Decimal | Auto-Calc | Net Weight In \- Total Consumed (e.g., 1300kg). Sets Remaining\_Unallocated\_Weight. |
| **Total Scrap Val.** | Decimal | Auto-Calc | Sum(Consume Qty \* Historical Scrap Rate). |
| **Total Wire Val.** | Decimal | Auto-Calc | Sum(Consume Qty \* (Historical Scrap Rate \+ Vendor Watta)). |
| **Mazdoori Payable** | Decimal | Auto-Calc | Total Wire Val. \- Total Scrap Val.. **Posts Credit to Vendor Financial Khata (PKR).** |

## ---

**MODULE 4: PROCUREMENT & SUDA (ADVANCE SETTLEMENT)**

**Motivation:** Handles standard fixed-rate purchases and the settlement of "Advance Metal" (the unallocated wire from Module 3\) at today's market rate.

### **Form 4.1: Purchase Invoice (Fixed & Suda Mode)**

*Database Impact: Suda mode ONLY hits Financial Khata (PKR). Fixed mode hits Inventory \+ Financial Khata.*

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Invoice ID** | Auto-ID | Read-Only | e.g., PI-26-0001. |
| **Supplier** | UUID | Dropdown | **Alert triggers if Remaining\_Unallocated\_Weight \> 0 exists.** |
| **Settlement Mode** | Toggle | UI Switch | \`\[ Standard Intake |
| *(If Settle Advance)* |  |  |  |
| **Select Stock** | Grid | UI Action | User selects the 1300kg unallocated batch. |
| **Final Market Rate** | Decimal | Number Input | User inputs today's rate. |
| **Net Payable** | Decimal | Auto-Calc | Weight \* Rate. **Hits Fin. Khata. Sets Remaining\_Unallocated \= 0\.** |
| *(If Standard)* |  |  |  |
| **Grid: Item** | UUID | Dropdown | Select Material. |
| **Grid: Net Wt.** | Decimal | Number Input | **Adds to Inventory & Metal Khata.** |
| **Grid: Rate** | Decimal | Number Input | Rate per KG. |
| **Net Payable** | Decimal | Auto-Calc | Weight \* Rate. **Hits Fin. Khata.** |

## ---

**MODULE 5: PRODUCTION (INTERNAL LOGIC)**

**Motivation:** Pure inventory transformation. No financial ledgers are hit.

### **Form 5.1: Enamel / Drawing Production Log**

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Log ID** | Auto-ID | Read-Only | e.g., PRD-26-001. |
| **Machine No** | String | Dropdown | e.g., M1, D2. |
| **Input Material** | UUID | Dropdown | E.g., Wire No 8\. |
| **Input Weight** | Decimal | Number Input | **Deducts from WIP Inventory.** |
| **Output Material** | UUID | Dropdown | E.g., Enamel Wire 28 SWG. |
| **Output Weight** | Decimal | Number Input | **Adds to Finished Goods Inventory.** |
| **Scrap Weight** | Decimal | Number Input | **Adds to Scrap Inventory.** |
| **Wastage %** | Decimal | Auto-Calc | (Input \- (Output \+ Scrap)) / Input \* 100\. |

## ---

**MODULE 6: FINANCIALS & LIQUIDITY**

**Motivation:** Centralized terminal for all physical and paper money movement.

### **Form 6.1: Unified Cashbook & Parchi Voucher**

*Database Impact: Moves PKR between Chart of Accounts. Clears Party debts.*

| Field Name | Data Type | UI Component | Logic & Database Impact |
| :---- | :---- | :---- | :---- |
| **Voucher ID** | Auto-ID | Read-Only | e.g., CV-26-0001. |
| **Date** | Date | Date Picker | Defaults to Today. |
| **Voucher Type** | Toggle | Segmented UI | \`\[ Receive |
| **Mode** | Toggle | Segmented UI | \`\[ Cash |
| **Source Account** | UUID | Dropdown | Fetches from COA (e.g., Meezan Bank). Reduces balance. |
| **Dest. Account** | UUID | Dropdown | Fetches from COA (e.g., Wage Expense). Increases balance. |
| **Party (Optional)** | UUID | Dropdown | If selected, clears debt in Party Fin. Khata. |
| **Amount** | Decimal | Number Input | Transaction Value. |
| **Parchi Due Date** | Date | Date Picker | *Visible only if Mode \= Parchi.* Triggers dashboard alerts. |
| **Parchi Status** | Enum | Dropdown | \`\[ Pending |

## ---

**MODULE 7: DASHBOARDS & REPORTING**

**Motivation:** The UI view for the Accountant/Owner to visualize the Dual-Ledger system.

### **Screen 7.1: Unified Party Dashboard**

* **UI Element 1: Financial Card (PKR)**  
  * *Query:* Sums general\_ledger for Party\_ID.  
  * *Display:* Massive text. Red if Payable, Green if Receivable.  
* **UI Element 2: Material Card (KG)**  
  * *Query:* Sums party\_material\_ledger for Party\_ID.  
  * *Display:* Massive text. Blue if Advance Metal held, Yellow if Scrap out.  
* **UI Element 3: The "Pending Action" Alert Bar**  
  * *Logic:* Checks database for Remaining\_Unsettled\_Weight \> 0 or Remaining\_Unallocated\_Weight \> 0\.  
  * *Display:* "You have 1300kg of unallocated metal from this party. \[Click to Settle\]".

### **\[ DOCUMENT END \]**