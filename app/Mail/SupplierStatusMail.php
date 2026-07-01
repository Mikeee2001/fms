<?php

namespace App\Mail;

use App\Models\Supplier;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupplierStatusMail extends Mailable
{
    use SerializesModels;

    public $supplier;

    public function __construct(Supplier $supplier)
    {
        $this->supplier = $supplier;
    }

    public function build()
    {
        return $this->subject('Supplier Account Status')
            ->view('emails.supplier-status');
    }
}
