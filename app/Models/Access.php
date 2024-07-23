<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Access extends Model
{
    use HasFactory;

    /**
     * Get the ticket that owns the access.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'barcode', 'barcode');
    }

    /**
     * Get the device that owns the access.
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
