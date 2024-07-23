<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'zones' => 'array',
    ];

    /**
     * Get the accesses for the device.
     */
    public function accesses(): HasMany
    {
        return $this->hasMany(Access::class);
    }
}
