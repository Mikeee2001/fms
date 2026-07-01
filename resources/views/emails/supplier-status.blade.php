<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Supplier Account Status</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background: #0c0a09;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #e7e5e4;
        }

        .wrapper {
            width: 100%;
            padding: 20px 0;
            background: #0c0a09;
            text-align: center;
        }


        .container {
            width: 500px;
            max-width: 500px;
            margin: auto;
            background: #000;
            border: 1px solid #292524;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
        }


        .header {
            padding: 20px;
            border-bottom: 1px solid #292524;
            color: #d97706;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
        }


        .content {
            padding: 20px;
            text-align: center;
        }


        h1 {
            margin: 0 0 12px;
            font-size: 20px;
            color: #fff;
            text-align: center;
        }


        p {
            font-size: 14px;
            color: #a8a29e;
            line-height: 22px;
            margin: 0 0 12px;
            text-align: center;
        }


        .status-box {
            background: #1c1917;
            border: 1px solid #44403c;
            padding: 16px;
            border-radius: 8px;
            margin: 18px auto;
            width: 80%;
            text-align: center;
        }


        .status-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #78716c;
            font-weight: bold;
        }


        .status-active {
            color: #4ade80;
            font-size: 18px;
            font-weight: bold;
            margin-top: 6px;
        }


        .status-inactive {
            color: #f87171;
            font-size: 18px;
            font-weight: bold;
            margin-top: 6px;
        }


        .button {
            display: inline-block;
            background: #d97706;
            color: #000 !important;
            text-decoration: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            text-align: center;
        }


        .footer {
            background: #1c1917;
            padding: 16px;
            text-align: center;
            font-size: 11px;
            color: #78716c;
            border-top: 1px solid #292524;
        }



        /* MOBILE */
        @media only screen and (max-width: 600px) {


            .wrapper {
                padding: 0;
            }


            .container {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 0;
            }


            .header {
                padding: 16px;
                font-size: 16px;
            }


            .content {
                padding: 16px;
            }


            h1 {
                font-size: 18px;
            }


            p {
                font-size: 13px;
            }


            .status-box {
                width: 90%;
                padding: 14px;
            }


            .button {
                width: 80%;
                display: block;
                margin: 16px auto 0;
            }

        }
    </style>

</head>


<body>


    <div class="wrapper">


        <table class="container" role="presentation" cellspacing="0" cellpadding="0">


            <tr>

                <td class="header">

                    Arfeels Furniture Trading

                </td>

            </tr>



            <tr>

                <td class="content">


                    <h1>
                        Hello, {{ $supplier->company_name }}
                    </h1>



                    @if ($supplier->status === 'active')
                        <p>
                            Your supplier account has been approved and is now active.
                        </p>


                        <div class="status-box">


                            <div class="status-title">
                                Account Status
                            </div>


                            <div class="status-active">
                                ● ACTIVE
                            </div>


                        </div>



                        <p>
                            You can now manage materials and receive transactions.
                        </p>
                    @else
                        <p>
                            Your supplier account has been deactivated by the administrator.
                        </p>



                        <div class="status-box">


                            <div class="status-title">
                                Account Status
                            </div>


                            <div class="status-inactive">
                                ● INACTIVE
                            </div>


                        </div>



                        <p>
                            You cannot access transactions until reactivated.
                        </p>
                    @endif





                    <a href="{{ url('login') }}" class="button">

                        Login to Supplier Portal

                    </a>



                </td>

            </tr>




            <tr>

                <td class="footer">

                    © {{ date('Y') }} Arfeels Furniture Trading

                </td>

            </tr>



        </table>


    </div>



</body>

</html>
