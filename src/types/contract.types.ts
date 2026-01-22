// Contract Request DTOs - Type definitions for each contract API

// =============================================================
// CONTRACT 1: Unified Maintenance Contract (عقد صيانة الموحد النهائي)
// =============================================================
export interface Contract1SimpleDto {
    // Section 01: Contract Data
    requestDate: string;
    requestNumber: string;

    // Section 02: First Party
    mainEstablishmentName: string;
    subEstablishmentName: string;
    unifiedNo: string;
    area: string;
    contractNotary: string;

    // Section 03: Second Party
    serviceProviderName: string;
    licenseNo: string;
    secondunifiedNo: string;
    secondContractNotary: string;

    // Section 04: Contract Details
    contractDuration: string;
    visitsNo: string;
    systemType: string;

    // Section 05: Visit Dates
    adStartDate: string;
    hStartDate: string;
    adEndDate: string;
    hEndDate: string;

    // Section 08: Financial Summary
    grandTotalLabelEn: string;
    grandTotalValue: string;
    grandTotalLabelAr: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract1RepeatedDto {
    visits: { value: string[] }[];
    quantities: { value: string[] }[];
    financialDetails: { value: string[] }[];
    maintenanceFees: { value: string[] }[];
    section11Rows?: { value: string[] }[];
    section12Rows?: { value: string[] }[];
}

export interface Contract1RequestDto {
    simple: Contract1SimpleDto;
    repeated: Contract1RepeatedDto;
}

// =============================================================
// CONTRACT 2: Fire Extinguisher Maintenance Contract
// =============================================================
export interface Contract2SimpleDto {
    // Section 01: Contract Data
    requestDate: string;
    requestNumber: string;

    // Section 02: First Party
    mainEstablishmentName: string;
    subEstablishmentName: string;
    firstUnifiedNo: string;
    secondUnifiedNo: string;
    area: string;
    contractNotary: string;

    // Section 03: Second Party
    serviceProviderName: string;
    licenseNo: string;
    secondContractNotary: string;

    // Section 04: Contract Details
    contractDuration: string;
    visitsNo: string;
    systemType: string;

    // Section 05: Contract Dates
    adStartDate: string;
    hStartDate: string;
    adEndDate: string;
    hEndDate: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract2RepeatedDto {
    visits: { value: string[] }[];
    quantities: { value: string[] }[];
    refillingPrices: { value: string[] }[];
}

export interface Contract2RequestDto {
    simple: Contract2SimpleDto;
    repeated: Contract2RepeatedDto;
}

// =============================================================
// CONTRACT 3: Technical Inspection Report
// =============================================================
export interface Contract3SimpleDto {
    // Report Header
    reportNumber: string;
    secondReportDate: string;
    firstReportDate: string;

    // Section 1: Report Data
    branchName: string;
    mainCompanyName: string;
    area: string;
    unifiedNumber: string;
    generalSafetyStatus: string;
    systemType: string;
    firstEngineerName: string;
    secondEngineerName: string;
    serviceProviderName: string;

    // Section 6: Authentication
    clientName: string;
    approvalDate: string;

    // Section 4: Main Recommendation
    mainRecommendation?: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

// Checklist item: [description, classification, isPass (true/false or 1/0)]
export type Contract3ChecklistItem = [string, string, boolean | number | string];

// Inspection row value: [item, total, working, broken, checklistItems[]]
export interface Contract3InspectionRow {
    value: [string, string, string, string, Contract3ChecklistItem[]];
}

export interface Contract3RepeatedDto {
    inspectionAlarm: Contract3InspectionRow[];
    inspectionFighting: Contract3InspectionRow[];
    inspectionEscape: Contract3InspectionRow[];
    faults: { value: string[] }[];
    assembly: { value: string[] }[];
}

export interface Contract3RequestDto {
    simple: Contract3SimpleDto;
    repeated: Contract3RepeatedDto;
}

// =============================================================
// CONTRACT 4: Fire Extinguisher Repair Quotation
// =============================================================
export interface Contract4SimpleDto {
    // Header
    secondRequestNumber: string;
    firstRequestNumber: string;
    date: string;

    // Section 01: Contract Data
    requestType: string;
    requestDate: string;

    // Section 02: First Party
    mainEstablishmentName: string;
    subEstablishmentName: string;
    unifiedNo: string;
    area: string;
    contractNotary: string;
    site: string;

    // Section 03: Financial Summary
    subTotal: string;
    tax: string;
    total: string;

    // Section 04: Approval
    name: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract4RepeatedDto {
    costRows: { value: string[] }[];
}

export interface Contract4RequestDto {
    simple: Contract4SimpleDto;
    repeated: Contract4RepeatedDto;
}

// =============================================================
// CONTRACT 5: Safety Systems Repair Quotation
// =============================================================
export interface Contract5SimpleDto {
    // Header
    quotationNumber: string;
    date: string;
    reference: string;

    // Section 01: Quotation Data
    subBranchName: string;
    mainEstablishmentName: string;
    area: string;
    site: string;
    unifiedNo: string;
    supplierName: string;
    generalSafetyStatus: string;
    systemType: string;
    engineerName: string;

    // Section 03: Financial Summary
    subTotal: string;
    total: string;
    vat: string;
    grandTotal: string;

    // Section 05: Second Party Info
    name: string;
    priceQuoteDate: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract5BoqRow {
    value: (string | string[])[]; // [Item, Descriptions[], Qty, UnitPrice, Total]
    systemTitle?: string; // Optional: e.g., "2. نظام مكافحة الحریق (Fire Fighting System)"
}

export interface Contract5RepeatedDto {
    boqRowsFireAlarm?: Contract5BoqRow[];
    boqRowsFireFighting?: Contract5BoqRow[];
    boqRowsExitSafety?: Contract5BoqRow[];
}

export interface Contract5RequestDto {
    simple: Contract5SimpleDto;
    repeated: Contract5RepeatedDto;
}

// =============================================================
// CONTRACT 6: Fire Extinguisher Delivery Receipt (After Maintenance)
// =============================================================
export interface Contract6SimpleDto {
    // Header
    firstRequestNumber: string;
    secondRequestNumber: string;
    date: string;

    // Section 01: Contract Data
    requestType: string;
    requestDate: string;

    // Section 02: First Party
    mainEstablishmentName: string;
    subEstablishmentName: string;
    firstUnifiedNo: string;
    secondUnifiedNo: string;
    area: string;
    firstContractNotary: string;
    secondContractNotary: string;
    theSite: string;

    // Section 03: Second Party
    serviceProviderName: string;
    licenseNo: string;

    // Section 06: Authentication
    customerName: string;
    companyName: string;
    firstReceiptDate: string;
    secondReceiptDate: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract6RepeatedDto {
    deliveryDetails: { value: string[] }[];
}

export interface Contract6RequestDto {
    simple: Contract6SimpleDto;
    repeated: Contract6RepeatedDto;
}

// =============================================================
// CONTRACT 7: Fire Extinguisher Receipt (Before Maintenance)
// =============================================================
export interface Contract7SimpleDto {
    // Header
    referenceNo: string;
    date: string;

    // Section 01: Contract Data
    requestType: string;
    requestDate: string;
    requestNo: string;

    // Section 02: First Party
    mainEstablishmentName: string;
    subEstablishmentName: string;
    firstUnifiedNo: string;
    secondUnifiedNo: string;
    area: string;
    firstContractNotary: string;
    secondContractNotary: string;
    theSite: string;

    // Section 03: Second Party
    serviceProviderName: string;
    licenseNo: string;

    // Section 06: Authentication
    receiverName: string;
    receiverDate: string;
    delivererName: string;
    delivererDate: string;

    // QR Code Employee IDs
    consumerEmployeeId?: string;
    providerEmployeeId?: string;
}

export interface Contract7RepeatedDto {
    safetyEquipmentRows: { value: string[] }[];
}

export interface Contract7RequestDto {
    simple: Contract7SimpleDto;
    repeated: Contract7RepeatedDto;
}

// =============================================================
// Common Response Types
// =============================================================
export interface ContractGenerationResponse {
    success: boolean;
    message: string;
    pdfBuffer?: Buffer;
}
