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
        <div class="item-row">
          <div class="item-name">${escapeHtml(item.product)} ${escapeHtml(item.brand)}</div>
          <div class="item-meta">
            <span>${escapeHtml(item.quantity)} x ${escapeHtml(formatCurrency(+item.priceAtPurchase))}</span>
            <span>${escapeHtml(formatCurrency(item.total))}</span>
          </div>
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
    padding: 0;
    background: white;
    color: #000;
    font-family: "Courier New", Courier, monospace;
  }

  .preview-shell {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 16px;
  }

  .preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 16px;
  }

  .preview-actions button {
    border: none;
    border-radius: 8px;
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

  .receipt {
    width: 300px;
    background: white;
    padding: 12px;
    color: #000;
  }

  .center {
    text-align: center;
  }

  .store-name {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .subtext {
    font-size: 12px;
    line-height: 1.4;
  }

  .divider {
    border-top: 1px dashed #000;
    margin: 10px 0;
  }

  .row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    margin: 4px 0;
  }

  .label {
    white-space: nowrap;
  }

  .value {
    text-align: right;
    word-break: break-word;
  }

  .item-row {
    padding: 6px 0;
    font-size: 12px;
  }

  .item-name {
    font-weight: 700;
    margin-bottom: 2px;
  }

  .item-meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    font-size: 16px;
    font-weight: 700;
  }

  .footer {
    margin-top: 14px;
    text-align: center;
    font-size: 12px;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .preview-actions {
      display: none !important;
    }

    .preview-shell {
      padding: 0;
      display: block;
    }

    .receipt {
      width: 80mm;
      max-width: 80mm;
      padding: 8px;
    }

    @page {
      size: 80mm auto;
      margin: 0;
    }
  }
</style>
    </style>
  </head>
  <body>
    <div class="preview-shell">
      <div>
        <div class="preview-actions">
          <button class="close-btn" onclick="window.close()">Close</button>
          <button class="print-btn" onclick="window.print()">Print</button>
        </div>

        <div class="receipt">
          <div class="center">
            <div class="store-name">${APP_NAME}</div>
            <div class="subtext">${ADDRESS}</div>
            <div class="subtext">${CONTACT}</div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span class="label">Txn No:</span>
            <span class="value">${escapeHtml(transaction?.transactionNum)}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span class="value">${escapeHtml(transaction?.createdAt ? formatDateTime(transaction.createdAt) : "-")}</span>
          </div>
          <div class="row">
            <span class="label">Customer:</span>
            <span class="value">${escapeHtml(transaction?.customer)}</span>
          </div>
          <div class="row">
            <span class="label">Contact:</span>
            <span class="value">${escapeHtml(transaction?.customerPhone)}</span>
          </div>
           <div class="row">
            <span class="label">Address:</span>
            <span class="value">${escapeHtml(transaction?.customerAddress)}</span>
          </div>

          <div class="divider"></div>

          ${itemsHtml}

          <div class="divider"></div>

          <div class="row">
            <span class="label">Total Items</span>
            <span class="value">${escapeHtml(transaction?.items?.length ?? 0)}</span>
          </div>

          <div class="total-row">
            <span>TOTAL</span>
            <span>${escapeHtml(formatCurrency(transaction?.grandTotal))}</span>
          </div>

          <div class="divider"></div>

          <div class="footer">
            <div>Thank you!</div>
            <div>Please come again.</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
};

export const handlePreviewThermal = (transaction: Transaction | null) => {
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
