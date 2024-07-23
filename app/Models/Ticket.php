<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    /**
     * Get the accesses for the ticket.
     */
    public function accesses(): HasMany
    {
        return $this->hasMany(Access::class, 'barcode', 'barcode');
    }
}
