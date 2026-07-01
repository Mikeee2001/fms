<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewStaffAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    // Public properties are automatically exposed inside your custom HTML view
    public $user;
    public $randomPassword;
    public $setupLink;


    /**
     * Create a new message instance.
     */
    public function __construct($user, $randomPassword, $setupLink)
    {
        $this->user = $user;
        $this->randomPassword = $randomPassword;
        $this->setupLink = $setupLink;


    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to the Team! Setup Your Account'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.staff.created'
        );
    }
    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
