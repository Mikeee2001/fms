<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Weekly Sales Summary</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1f2937;
            margin: 40px;
        }

        * {
            box-sizing: border-box;
        }

        .header {
            text-align: center;
        }

        .logo {
            width: 90px;
            margin-bottom: 8px;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #d97706;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 25px;
        }

        .report-title {
            font-size: 38px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }

        .generated {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 25px;
        }

        .divider {
            border: none;
            border-top: 3px solid #f59e0b;
            margin-bottom: 25px;
        }

        table {
            border-collapse: collapse;
        }

        .summary-table {
            width: 100%;
        }

        .summary-table th {
            background: #f5f5f5;
            border: 1px solid #d1d5db;
            padding: 12px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
        }

        .summary-table td {
            border: 1px solid #d1d5db;
            padding: 12px;
            font-size: 13px;
        }

        .summary-table td:first-child {
            text-align: left;
        }

        .summary-table td:not(:first-child) {
            text-align: center;
        }

        .summary-table tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .grand-total {
            width: 100%;
            margin-top: 28px;
            background: #1f2937;
            color: white;
        }

        .grand-total td {
            padding: 18px;
            text-align: center;
            font-weight: bold;
        }

        .grand-title {
            font-size: 20px;
            width: 30%;
        }

        .grand-label {
            font-size: 17px;
            margin-bottom: 6px;
        }

        .grand-value {
            font-size: 18px;
        }

        .footer {
            margin-top: 35px;
            border-top: 1px solid #d1d5db;
            padding-top: 15px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            line-height: 20px;
        }
    </style>

</head>

<body>

    <!-- HEADER -->

    <div class="header">

        <img src="{{ public_path('images/arfeels.png') }}" class="logo">

        <div class="company-name">
            Arfeels Furniture Trading
        </div>

        <div class="subtitle">
            Official Sales Report
        </div>

        <div class="report-title">
            Weekly Sales Summary
        </div>

        <div class="generated">
            Generated: {{ $generatedAt }}
        </div>

    </div>

    <hr class="divider">

    <!-- SALES TABLE -->

    <table class="summary-table">

        <thead>

            <tr>

                <th width="40%">Week</th>
                <th width="15%">Orders</th>
                <th width="20%">Total Sales</th>
                <th width="12%">COD</th>
                <th width="13%">GCash</th>

            </tr>

        </thead>

        <tbody>

            @forelse($weeklyData as $week)
                <tr>

                    <td>{{ $week['week'] }}</td>

                    <td>{{ $week['order_count'] }}</td>

                    <td style="text-align:right;">
                        &#8369;{{ number_format($week['total_sales'], 2) }}
                    </td>

                    <td>{{ $week['payment_methods']['cod'] }}</td>

                    <td>{{ $week['payment_methods']['gcash'] }}</td>

                </tr>

            @empty

                <tr>

                    <td colspan="5" style="text-align:center;padding:18px;">
                        No completed orders found.
                    </td>

                </tr>
            @endforelse

        </tbody>

    </table>

    <!-- GRAND TOTAL -->

    <table class="grand-total">

        <tr>

            <td class="grand-title">
                GRAND TOTAL
            </td>

            <td>

                <div class="grand-label">Orders</div>

                <div class="grand-value">
                    {{ $grandTotals['total_orders'] }}
                </div>

            </td>

            <td>

                <div class="grand-label">Sales</div>

                <div class="grand-value">
                    &#8369;{{ number_format($grandTotals['total_sales'], 2) }}
                </div>

            </td>

            <td>

                <div class="grand-label">COD</div>

                <div class="grand-value">
                    {{ $grandTotals['cod_count'] }}
                </div>

            </td>

            <td>

                <div class="grand-label">GCash</div>

                <div class="grand-value">
                    {{ $grandTotals['gcash_count'] }}
                </div>

            </td>

        </tr>

    </table>

    <!-- FOOTER -->

    <div class="footer">

        Summary of weekly sales.<br>

        Detailed order information can be obtained from the admin panel.

    </div>

</body>

</html>
