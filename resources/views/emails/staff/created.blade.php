<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Team</title>
    <style>
        /* Base Reset Rules */
        body {
            background-color: #0c0a09;
            /* stone-950 */
            color: #e7e5e4;
            /* stone-200 */
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        /* Layout Framework */
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0c0a09;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
            /* pure black card */
            border: 1px solid #292524;
            /* stone-800 */
            border-radius: 8px;
            overflow: hidden;
        }

        /* Content Elements */
        .header {
            padding: 32px;
            border-b: 1px solid #292524;
            text-align: left;
        }

        .body-content {
            padding: 32px;
        }

        .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px 0;
            letter-spacing: -0.025em;
        }

        .paragraph {
            font-size: 15px;
            line-height: 24px;
            color: #a8a29e;
            /* stone-400 */
            margin: 0 0 24px 0;
        }

        /* Profile Detail Panel */
        .credential-box {
            background-color: #1c1917;
            /* stone-900 */
            border: 1px solid #44403c;
            /* stone-700 */
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 28px;
        }

        .data-row {
            padding: 6px 0;
            font-size: 14px;
            border-bottom: 1px solid #292524;
        }

        .data-row:last-child {
            border-bottom: none;
        }

        .label {
            color: #78716c;
            /* stone-500 */
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
            display: inline-block;
            width: 120px;
        }

        .value {
            color: #f5f5f4;
            /* stone-100 */
            font-weight: 500;
        }

        .code-token {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            background-color: #0c0a09;
            padding: 3px 6px;
            border-radius: 4px;
            color: #fbbf24;
            /* amber-400 */
            border: 1px solid #292524;
        }

        /* CTA Action Component */
        .btn-container {
            margin: 32px 0 16px 0;
        }

        .action-button {
            background-color: #d97706;
            /* amber-600 */
            color: #000000 !important;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            display: inline-block;
            transition: background-color 0.2s ease;
        }

        /* Footer Details */
        .footer {
            padding: 24px 32px;
            background-color: #1c1917;
            border-top: 1px solid #292524;
            text-align: center;
            font-size: 12px;
            color: #57534e;
            /* stone-600 */
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <table class="container" width="100%" cellpadding="0" cellspacing="0">
            <!-- Header Block -->
            <tr>
                <td class="header">
                    <span style="color: #d97706; font-weight: 800; font-size: 18px; letter-spacing: 0.05em;">
                        Arfeels Furniture Trading
                    </span>
                </td>
            </tr>

            <!-- Core Content Workspace -->
            <tr>
                <td class="body-content">
                    <h1 class="title">Welcome to the Team, {{ $user->name }}!</h1>
                    <p class="paragraph">
                        An administrative workspace profile has been created and prepared for you. You can instantly
                        access your workspace tools by logging in with the secure account credentials generated below:
                    </p>

                    <!-- Meta Profile Box -->
                    <div class="credential-box">
                        <div class="data-row">
                            <span class="label">System Role</span>
                            <span class="value" style="color: #fbbf24;">{{ ucfirst($user->role_as) }}</span>
                        </div>
                        <div class="data-row">
                            <span class="label">Email Handle</span>
                            <span class="value">{{ $user->email }}</span>
                        </div>
                        {{-- <a href="{{ $setupLink }}" class="action-button">
                            Set Your Password
                        </a> --}}
                    </div>

                    <p class="paragraph" style="font-size: 13px; color: #78716c;">
                        <strong>Security Reminder:</strong> This access credential string was randomly generated. To
                        protect systemic integrity, please click the button below to authenticate immediately, then
                        update your password inside your manager settings dashboard.
                    </p>

                    <div class="btn-container">
                        <a href="{{ $setupLink }}" class="action-button" target="_blank">Authenticate Account</a>
                    </div>
                </td>
            </tr>

            <!-- Footer Block -->
            <tr>
                <td class="footer">
                    &copy; {{ date('Y') }} Arfeels Furniture Trading
                    . All workspace parameters active.<br>
                    <span style="display:inline-block; margin-top:8px;">Do not reply directly to this automated
                        structural transmission.</span>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
