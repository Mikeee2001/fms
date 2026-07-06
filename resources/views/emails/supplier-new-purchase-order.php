<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>New Purchase Order</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background: #0c0a09;
            font-family: Arial, sans-serif;
            color: #e7e5e4;
        }

        .wrapper {
            width: 100%;
            padding: 40px 0;
            background: #0c0a09;
        }

        .container {
            width: 600px;
            margin: auto;
            background: #000;
            border: 1px solid #292524;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            padding: 25px;
            color: #d97706;
            font-weight: bold;
            text-align: center;
            border-bottom: 1px solid #292524;
        }

        .content {
            padding: 25px;
            text-align: center;
        }

        h1 {
            color: #fff;
            font-size: 20px;
        }

        p {
            color: #a8a29e;
            font-size: 14px;
        }

        .box {
            background: #1c1917;
            border: 1px solid #44403c;
            padding: 18px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .row {
            margin: 6px 0;
            font-size: 14px;
        }

        .footer {
            background: #1c1917;
            padding: 15px;
            font-size: 12px;
            color: #78716c;
            text-align: center;
        }
    </style>
</head>

<body>

    <div class="wrapper">

        <div class="container">

            <div class="header">
                Arfeels Furniture Trading
            </div>

            <div class="content">

                <h1>New Purchase Order Received</h1>

                <p>Hello {{ $supplier->company_name }},</p>

                <p>You have received a new purchase order from our system.</p>

                <div class="box">
                    <div class="row"><strong>PO Number:</strong> {{ $po->po_number }}</div>
                    <div class="row"><strong>Date:</strong> {{ $po->order_date }}</div>
                    <div class="row"><strong>Total:</strong> ₱{{ number_format($po->total_amount, 2) }}</div>
                    <div class="row"><strong>Status:</strong> {{ strtoupper($po->status) }}</div>
                </div>

                <p>Please prepare the materials accordingly.</p>

            </div>

            <div class="footer">
                © {{ date('Y') }} Arfeels Furniture Trading
            </div>

        </div>

    </div>

</body>

</html>
