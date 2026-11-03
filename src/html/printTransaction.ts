import { Transaction } from "../types/common";
import { ADDRESS, APP_NAME, CONTACT } from "../utils/commonUtil";
import { formatDateTime } from "../utils/datesUtil";
import { escapeHtml } from "../utils/htmlUtils";
import { formatCurrency } from "../utils/mathUtils";

const buildPreviewHtml = (transaction: Transaction | null) => {
  const itemsHtml =
    transaction?.items
      ?.map(
        (item) => `
            <div class="receipt-item">
              <div class="receipt-item-name">
                <div class="product-name">${escapeHtml(item.product)} ${escapeHtml(item.brand)}</div>
              </div>
              <div class="receipt-item-qty">${escapeHtml(item.quantity)}</div>
              <div class="receipt-item-price">${escapeHtml(formatCurrency(+item.priceAtPurchase))}</div>
              <div class="receipt-item-total">${escapeHtml(formatCurrency(item.total))}</div>
            </div>
          `,
      )
      .join("") ?? "";

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Receipt Preview</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              background: #f3f4f6;
              color: #1f2937;
              font-family: Arial, Helvetica, sans-serif;
            }

            .preview-shell {
              max-width: 720px;
              margin: 0 auto;
            }

            .preview-actions {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              margin-bottom: 16px;
            }

            .preview-actions button {
              border: none;
              border-radius: 12px;
              padding: 10px 18px;
              font-size: 14px;
              cursor: pointer;
            }

            .close-btn {
              background: #e5e7eb;
              color: #111827;
            }

            .print-btn {
              background: #111827;
              color: white;
            }

            .receipt-card {
              max-width: 520px;
              margin: 0 auto;
              background: white;
              border: 1px solid #e7dcc7;
              border-radius: 20px;
              padding: 28px;
              box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
            }

            .receipt-header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 16px;
            }

            .receipt-title {
              margin: 0;
              font-size: 22px;
              font-weight: 700;
              letter-spacing: 0.04em;
              color: #1f2937;
            }

            .receipt-sub {
              margin-top: 8px;
              font-size: 14px;
              color: #6b7280;
            }

            .receipt-section {
              margin-top: 18px;
              border-bottom: 1px dashed #000;
              padding-bottom: 16px;
            }

            .receipt-section-transaction-num {
              margin-top: 1px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }

            .receipt-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 16px;
              margin-bottom: 10px;
              font-size: 14px;
            }

            .receipt-row:last-child {
              margin-bottom: 0;
            }

            .receipt-label {
              color: #6b7280;
              min-width: 90px;
            }

            .receipt-value {
              color: #111827;
              font-weight: 500;
              text-align: right;
              word-break: break-word;
            }

            .receipt-table-head,
            .receipt-item {
              display: grid;
              grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
              gap: 12px;
              align-items: start;
            }

            .receipt-table-head {
              margin-top: 18px;
              margin-bottom: 10px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.04em;
              text-transform: uppercase;
              color: #6b7280;
            }

            .receipt-item {
              padding: 12px 0;
              border-bottom: 1px dotted #d1d5db;
              font-size: 14px;
            }

            .receipt-item-name {
              min-width: 0;
            }

            .product-name {
              font-weight: 600;
              color: #111827;
            }

            .product-status {
              margin-top: 6px;
              font-size: 12px;
              color: #6b7280;
              text-transform: capitalize;
            }

            .receipt-item-qty {
              text-align: center;
              color: #374151;
            }

            .receipt-item-price,
            .receipt-item-total {
              text-align: right;
              color: #374151;
            }

            .receipt-item-total {
              font-weight: 600;
              color: #111827;
            }

            .receipt-summary {
              margin-top: 18px;
              border-top: 1px dashed #000;
              padding-top: 16px;
            }

            .summary-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              margin-bottom: 10px;
            }

            .summary-row:last-child {
              margin-bottom: 0;
            }

            .summary-label {
              color: #6b7280;
            }

            .summary-value {
              color: #111827;
              font-weight: 500;
            }

            .grand-total {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 22px;
              font-weight: 700;
              color: #111827;
            }

            .transaction-number {
              display: flex;
              justify-content: space-between;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }

              .preview-actions {
                display: none !important;
              }

              .preview-shell {
                max-width: 100%;
              }

              .receipt-card {
                max-width: 100%;
                border: none;
                border-radius: 0;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="preview-shell">
            <div class="preview-actions">
              <button class="close-btn" onclick="window.close()">Close</button>
              <button class="print-btn" onclick="window.print()">Print</button>
            </div>

            <div class="receipt-card">
              <div class="receipt-header">
                <h1 class="receipt-title">${APP_NAME}</h1>
                <div class="receipt-sub">${ADDRESS}</div>
                <div class="receipt-sub">${CONTACT}</div>
              </div>
              <div class="receipt-section">
                <div class="receipt-row">
                  <div class="receipt-label">Transaction #</div>
                  <div class="receipt-value">${escapeHtml(transaction?.transactionNum)}</div>
                </div>
                <div class="receipt-row">
                  <div class="receipt-label">Date</div>
                  <div class="receipt-value">${escapeHtml(transaction?.createdAt ? formatDateTime(transaction?.createdAt) : "-")}</div>
                </div>
                <div class="receipt-row">
                  <div class="receipt-label">Customer</div>
                  <div class="receipt-value">${escapeHtml(transaction?.customer)}</div>
                </div>
                <div class="receipt-row">
                  <div class="receipt-label">Contact</div>
                  <div class="receipt-value">${escapeHtml(transaction?.customerPhone)}</div>
                </div>
                <div class="receipt-row">
                  <div class="receipt-label">Address</div>
                  <div class="receipt-value">${escapeHtml(transaction?.customerAddress)}</div>
                </div>
              </div>

              <div class="receipt-table-head">
                <div>Item</div>
                <div style="text-align:center;">Qty</div>
                <div style="text-align:right;">Price</div>
                <div style="text-align:right;">Total</div>
              </div>

              <div>
                ${itemsHtml}
              </div>

              <div class="receipt-summary">
                <div class="summary-row">
                  <div class="summary-label">Total Items</div>
                  <div class="summary-value">${escapeHtml(transaction?.items?.length ?? 0)}</div>
                </div>

                <div class="grand-total">
                  <span>Total Amount</span>
                  <span>${escapeHtml(formatCurrency(transaction?.grandTotal))}</span>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

export const handlePreview = (transaction: Transaction | null) => {
  const previewWindow = window.open("", "_blank", "width=760,height=900");

  if (!previewWindow) return;

  previewWindow.document.open();
  previewWindow.document.write(buildPreviewHtml(transaction));
  previewWindow.document.close();
  previewWindow.focus();
};

export const handlePrint = (transaction: Transaction | null) => {
  const printWindow = window.open("", "", "width=760,height=900");

  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(buildPreviewHtml(transaction));
  printWindow.document.close();

  // Wait until content is fully loaded before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();

    // Optional: auto close after printing
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};
