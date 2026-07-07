<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Purchase Order</title>

    <style>
        @page {
            size: A4;
            margin: 20px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: DejaVu Sans, sans-serif;
            color: #374151;
            font-size: 11px;
            line-height: 1.4;
        }

        .container {
            width: 100%;
        }

        /*==========================
            HEADER
        ==========================*/

        .header {
            width: 100%;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: middle;
        }

        .logo-col {
            width: 90px;
            text-align: center;
        }

        .logo {
            width: 70px;
            height: 70px;
        }

        .company-col {
            vertical-align: middle;
            padding-left: 15px;
        }

        .company-name {
            font-size: 22px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 2px;
        }

        .company-subtitle {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 14px;
        }

        .document-col {
            width: 220px;
            text-align: right;
        }

        .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }

        .document-sub {
            font-size: 10px;
            color: #6b7280;
        }

        .po-number {
            margin-top: 6px;
            color: #2563eb;
            font-size: 11px;
            font-weight: bold;
        }

        /*==========================
            INFORMATION CARDS
        ==========================*/

        .info-wrapper {
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px;
            margin-bottom: 20px;
        }

        .card {
            border: 1px solid #dbe4f0;
            border-radius: 8px;
            padding: 12px;
        }

        .card-title {
            background: #2563eb;
            color: #fff;
            padding: 7px;
            font-weight: bold;
            text-align: center;
            margin: -12px -12px 12px -12px;
            font-size: 11px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 6px 0;
            border-bottom: 1px solid #eef2f7;
        }

        .label {
            font-weight: bold;
            color: #1e3a8a;
            width: 40%;
        }

        .value {
            color: #374151;
        }

        /*==========================
            MATERIAL TABLE
        ==========================*/

        .items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .items thead th {
            background: #2563eb;
            color: white;
            padding: 10px;
            font-size: 10px;
            text-align: center;
        }

        .items tbody td {
            border: 1px solid #e5e7eb;
            padding: 8px;
        }

        .items tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        /*==========================
            TOTAL
        ==========================*/

        .total-box {
            margin-top: 18px;
            background: #111827;
            color: white;
            padding: 12px 18px;
            border-radius: 6px;
        }

        .total-table {
            width: 100%;
            border-collapse: collapse;
        }

        .total-table td {
            color: white;
            font-size: 13px;
            font-weight: bold;
        }

        .total-right {
            text-align: right;
            font-size: 18px;
        }

        /*==========================
            SIGNATURE
        ==========================*/

        .signature-table {
            width: 100%;
            margin-top: 55px;
        }

        .signature-table td {
            width: 50%;
            text-align: center;
        }

        .signature-title {
            margin-bottom: 40px;
            color: #374151;
        }

        .signature-line {
            width: 180px;
            border-bottom: 1px solid #111827;
            margin: auto;
            margin-bottom: 8px;
        }

        .signature-name {
            font-weight: bold;
            color: #111827;
        }

        .signature-role {
            color: #6b7280;
            font-size: 10px;
        }

        /*==========================
            FOOTER
        ==========================*/

        .footer {
            margin-top: 40px;
            border-top: 1px solid #d1d5db;
            padding-top: 10px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
        }
    </style>
</head>

<body>

    <div class="container">

        <!-- HEADER -->

        <div class="header">

            <table class="header-table">

                <tr>

                    <!-- LOGO -->
                    <td class="logo-col">

                        <img src="{{ public_path('images/arfeels.png') }}" class="logo">

                    </td>

                    <!-- COMPANY -->
                    <td class="company-col">

                        <div class="company-name">
                            A' ARFEELS LUMBER TRADING
                        </div>

                        {{-- <div class="company-subtitle">
                            Quality Lumber & Construction Materials Supplier
                        </div> --}}

                        <div class="document-title">
                            PURCHASE ORDER
                        </div>

                        <div class="document-sub">
                            Official Business Document
                        </div>

                        <div class="po-number">
                            {{ $purchaseOrder->po_number }}
                        </div>

                    </td>

                </tr>

            </table>

        </div>
        <!-- INFORMATION CARDS -->

        <table class="info-wrapper">

            <tr>

                <!-- PURCHASE INFORMATION -->

                <td width="50%">

                    <div class="card">

                        <div class="card-title">
                            PURCHASE INFORMATION
                        </div>

                        <table class="info-table">

                            <tr>

                                <td class="label">
                                    PO Number
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->po_number }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Order Date
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->order_date }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Prepared By
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->manager?->user?->name ?? '-' }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Status
                                </td>

                                <td class="value">
                                    {{ strtoupper($purchaseOrder->status) }}
                                </td>

                            </tr>

                        </table>

                    </div>

                </td>



                <!-- SUPPLIER INFORMATION -->

                <td width="50%">

                    <div class="card">

                        <div class="card-title">
                            SUPPLIER INFORMATION
                        </div>

                        <table class="info-table">

                            <tr>

                                <td class="label">
                                    Company
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->supplier->company_name ?? '-' }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Email
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->supplier->email ?? '-' }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Phone
                                </td>

                                <td class="value">
                                    {{ $purchaseOrder->supplier->phone ?? '-' }}
                                </td>

                            </tr>

                            <tr>

                                <td class="label">
                                    Address
                                </td>
                                <td class="value">
                                    {!! nl2br(e(wordwrap($purchaseOrder->supplier->address ?? '-', 35, "\n", true))) !!}
                                </td>

                            </tr>

                        </table>

                    </div>

                </td>

            </tr>

        </table>



        <!-- ORDERED MATERIALS -->

        <table class="items">

            <thead>

                <tr>

                    <th width="6%">
                        #
                    </th>

                    <th width="34%">
                        MATERIAL
                    </th>

                    <th width="12%">
                        QUANTITY
                    </th>

                    <th width="12%">
                        UNIT
                    </th>

                    <th width="18%">
                        UNIT PRICE
                    </th>

                    <th width="18%">
                        SUBTOTAL
                    </th>

                </tr>

            </thead>

            <tbody>

                @foreach ($purchaseOrder->items as $index => $item)
                    <tr>

                        <td class="center">

                            {{ $index + 1 }}

                        </td>

                        <td>

                            {{ $item->rawMaterial->material_name ?? '-' }}

                        </td>

                        <td class="center">

                            {{ number_format($item->quantity) }}

                        </td>

                        <td class="center">

                            {{ $item->rawMaterial->unit->name ?? '-' }}

                        </td>

                        <td class="right">

                            ₱{{ number_format($item->unit_price, 2) }}

                        </td>

                        <td class="right">

                            ₱{{ number_format($item->subtotal, 2) }}

                        </td>

                    </tr>
                @endforeach

            </tbody>

        </table>
        <!-- TOTAL -->

        <div class="total-box">

            <table class="total-table">

                <tr>

                    <td>
                        TOTAL PURCHASE AMOUNT
                    </td>

                    <td class="total-right">
                        ₱{{ number_format($purchaseOrder->total_amount, 2) }}
                    </td>

                </tr>

            </table>

        </div>



        <!-- SIGNATURES -->

        <table class="signature-table">

            <tr>

                <!-- PREPARED BY -->

                <td>

                    <div class="signature-title">

                        Prepared By

                    </div>

                    <div class="signature-line"></div>

                    <div class="signature-name">

                        {{ $purchaseOrder->manager?->user?->name ?? '-' }}

                    </div>

                    <div class="signature-role">

                        Purchasing Manager

                    </div>

                </td>



                <!-- APPROVED BY -->

                <td>

                    <div class="signature-title">

                        Approved By

                    </div>

                    <div class="signature-line"></div>

                    <div class="signature-name">

                        {{ $purchaseOrder->supplier->company_name ?? '-' }}

                    </div>

                    <div class="signature-role">

                        Supplier Representative

                    </div>

                </td>

            </tr>

        </table>



        <!-- FOOTER -->

        <div class="footer">

            <strong>
                A' ARFEELS LUMBER TRADING
            </strong>

            <br><br>

            This Purchase Order was electronically generated by the
            Inventory & Purchasing Management System.

            <br>

            No handwritten signature is required unless otherwise requested.

            <br><br>

            © {{ date('Y') }} A' ARFEELS Lumber Trading. All Rights Reserved.

        </div>

    </div>

</body>

</html>
