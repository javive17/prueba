<?php

namespace App\Imports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\ToModel;

class TicketImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Ticket([
            'barcode' => $row[0],
            'name'    => $row[1],
            'zone'    => $row[2],
        ]);
    }
}
